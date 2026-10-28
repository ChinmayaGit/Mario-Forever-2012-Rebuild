// GM8 built-in functions. Every function receives (self, other, ...args), matching compiler/codegen.ts.
import { BASE_H, BASE_W, Background, type Frame, Sprite, preciseMasks, processImage } from "./assets.ts";
import type { Game, Tile } from "./game.ts";
import type { Instance } from "./instance.ts";
import { PartType } from "./particles.ts";
import { round } from "./rt.ts";

type I = Instance;
const DEG = Math.PI / 180;
const NOONE = -4;

/** GM8 real -> string: integers print bare, others with 2 decimals. */
export function gmString(v: any): string {
  if (typeof v === "string") return v;
  if (typeof v !== "number" || !Number.isFinite(v)) return "0";
  if (Number.isInteger(v)) return String(v);
  const s = v.toFixed(2);
  return s === "-0.00" ? "0.00" : s;
}

/** A string-typed argument: GM8 reads reals passed there as "". */
const str = (v: any): string => (typeof v === "string" ? v : "");

interface SpriteFont { sprite: number; first: number; prop: boolean; sep: number; widths: number[]; lefts: number[] }

export function makeFunctions(game: Game) {
  const r = game.renderer;
  const A = game.assets;
  const fonts: SpriteFont[] = [];
  const surfaces: ({ fb: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number; frame: Frame } | null)[] = [];
  const paths: { points: number[][]; closed: boolean }[] = [];
  const externals: string[] = [];
  const textCache = new Map<string, Frame>();

  const sprite = (i: number) => A.sprites[round(i)];
  const bg = (i: number) => A.backgrounds[round(i)];
  const colourAlpha = () => game.drawAlpha;
  const rgba = (c: number, a: number) => [(c & 255) / 255, ((c >> 8) & 255) / 255, ((c >> 16) & 255) / 255, a];

  function imageFor(fname: string): HTMLImageElement | undefined {
    const key = fname.replace(/\\/g, "/").replace(/^\.\//, "").toLowerCase();
    const img = game.images.get(key);
    if (!img) game.warn(`image not preloaded: ${fname}`);
    return img;
  }

  /** Build sprite frames from a horizontal strip image with GM8.1 sprite_add processing. */
  function framesFromImage(img: HTMLImageElement, imgnumb: number, removeback: boolean, smooth: boolean) {
    const n = Math.max(1, round(imgnumb));
    const fw = Math.floor(img.width / n), fh = img.height;
    let src: TexImageSource = img;
    let pixels: Uint8ClampedArray | null = null;
    if (removeback || smooth) {
      const cv = document.createElement("canvas");
      cv.width = fw * n; cv.height = fh;
      const c = cv.getContext("2d", { willReadFrequently: true })!;
      c.drawImage(img, 0, 0);
      for (let f = 0; f < n; f++) {
        const d = c.getImageData(f * fw, 0, fw, fh);
        processImage(d.data, fw, fh, removeback, smooth);
        c.putImageData(d, f * fw, 0);
      }
      pixels = c.getImageData(0, 0, fw * n, fh).data;
      src = cv;
    }
    const frames: Frame[] = [];
    for (let f = 0; f < n; f++) frames.push({ src, sx: f * fw, sy: 0, w: fw, h: fh });
    const masks = () => {
      let data = pixels;
      if (!data) {
        const cv = document.createElement("canvas");
        cv.width = fw * n; cv.height = fh;
        const c = cv.getContext("2d", { willReadFrequently: true })!;
        c.drawImage(img, 0, 0);
        data = c.getImageData(0, 0, fw * n, fh).data;
      }
      const perFrame: Uint8ClampedArray[] = [];
      for (let f = 0; f < n; f++) {
        const out = new Uint8ClampedArray(fw * fh * 4);
        for (let y = 0; y < fh; y++) out.set(data.subarray((y * fw * n + f * fw) * 4, (y * fw * n + f * fw + fw) * 4), y * fw * 4);
        perFrame.push(out);
      }
      return preciseMasks(perFrame, fw, fh);
    };
    return { frames, fw, fh, masks };
  }

  function fillSprite(s: Sprite, fname: string, imgnumb: number, removeback: number, smooth: number, xo: number, yo: number): boolean {
    const img = imageFor(fname);
    if (!img) return false;
    const { frames, fw, fh, masks } = framesFromImage(img, imgnumb, removeback >= 0.5, smooth >= 0.5);
    s.frames = frames; s.w = fw; s.h = fh; s.ox = round(xo); s.oy = round(yo); s.sep = false;
    s.pendingMasks = () => { s.masks = masks(); const m = s.masks[0]; s.bbox = { l: m.l, r: m.r, t: m.t, b: m.b }; };
    s.bbox = { l: 0, r: fw - 1, t: 0, b: fh - 1 };
    return true;
  }

  // ---- collision helpers
  function anyCollision(s: I, obj: number, test: (i: I) => boolean, notme = true): I | null {
    for (const i of game.resolve(obj, s, s)) {
      if (notme && i === s) continue;
      if (test(i)) return i;
    }
    return null;
  }
  function atPosition<T>(s: I, x: number, y: number, fn: () => T): T {
    const ox = s.x, oy = s.y;
    s.x = x; s.y = y;
    try { return fn(); } finally { s.x = ox; s.y = oy; }
  }

  // ---- text
  function lines(str: any): string[] {
    return gmString(str).split("#");
  }
  function fontInfo() {
    const f = fonts[game.font];
    if (!f) return null;
    const spr = sprite(f.sprite);
    if (!spr) return null;
    return { f, spr };
  }
  function measure(line: string): { w: number; h: number } {
    const fi = fontInfo();
    if (!fi) return { w: line.length * 7, h: 16 };
    const { f, spr } = fi;
    let w = 0;
    for (const ch of line) w += glyphAdvance(f, spr, ch.charCodeAt(0));
    return { w, h: spr.h };
  }
  function glyphAdvance(f: SpriteFont, spr: Sprite, code: number): number {
    let gi = code - f.first;
    if (gi < 0 || gi >= spr.frames.length) gi = 0;
    return f.prop ? f.widths[gi] : spr.w + f.sep;
  }
  function wrap(str: any, width: number): string[] {
    const out: string[] = [];
    for (const raw of lines(str)) {
      if (width <= 0) { out.push(raw); continue; }
      let cur = "";
      for (const word of raw.split(" ")) {
        const cand = cur ? cur + " " + word : word;
        if (cur && measure(cand).w > width) { out.push(cur); cur = word; } else cur = cand;
      }
      out.push(cur);
    }
    return out;
  }
  function drawText(x: number, y: number, text: string[], xs: number, ys: number, angle: number, sep: number) {
    const fi = fontInfo();
    const lh = sep > 0 ? sep : fi ? fi.spr.h : 16;
    const total = lh * text.length;
    const oy = game.valign === 1 ? -total / 2 : game.valign === 2 ? -total : 0;
    const a = -angle * DEG, cs = Math.cos(a), sn = Math.sin(a);
    r.setBlendMode(game.blendMode);
    text.forEach((line, li) => {
      const w = measure(line).w;
      let cx = game.halign === 1 ? -Math.trunc(w / 2) : game.halign === 2 ? -w : 0;
      const cy = oy + li * lh;
      if (!fi) {
        const f = defaultTextFrame(line);
        const px = x + (cx * xs) * cs - (cy * ys) * sn, py = y + (cx * xs) * sn + (cy * ys) * cs;
        r.drawFrame(f, 0, 0, f.w, f.h, px, py, 0, 0, xs, ys, angle, game.drawColour, colourAlpha());
        return;
      }
      const { f, spr } = fi;
      for (const ch of line) {
        const code = ch.charCodeAt(0), gi = code - f.first;
        if (gi >= 0 && gi < spr.frames.length) {
          const fr = spr.frames[gi];
          const lx = cx - (f.prop ? f.lefts[gi] : 0);
          const px = x + (lx * xs) * cs - (cy * ys) * sn, py = y + (lx * xs) * sn + (cy * ys) * cs;
          r.drawFrame(fr, 0, 0, fr.w, fr.h, px, py, -spr.ox, -spr.oy, xs, ys, angle, game.drawColour, colourAlpha());
        }
        cx += glyphAdvance(f, spr, code);
      }
    });
  }
  function defaultTextFrame(line: string): Frame {
    let f = textCache.get(line);
    if (!f) {
      const cv = document.createElement("canvas");
      const c = cv.getContext("2d")!;
      c.font = "12px Arial";
      cv.width = Math.max(1, Math.ceil(c.measureText(line).width)); cv.height = 16;
      c.font = "12px Arial"; c.fillStyle = "#fff"; c.textBaseline = "top";
      c.fillText(line, 0, 1);
      f = { src: cv, sx: 0, sy: 0, w: cv.width, h: cv.height };
      if (textCache.size > 500) textCache.clear();
      textCache.set(line, f);
    }
    return f;
  }

  // ---- SXMS.dll
  const au = () => game.audio;
  const SXMS: Record<string, (...a: any[]) => any> = {
    SXMS_SFX_Load: (slot, path) => au().load(round(slot), path),
    SXMS_SFX_PlayExt: (slot, pan, vol, freq) => au().play(round(slot), pan, vol, freq),
    SXMS_SFX_Play: (slot) => au().play(round(slot), 128, 255, -1),
    SXMS_SFX_Stop: (ch) => { au().stop(round(ch)); return 1; },
    SXMS_SFX_Volume: (ch, v) => { au().volume(round(ch), v); return 1; },
    SXMS_SFX_VolumeAbsolute: (ch, v) => { au().volume(round(ch), v); return 1; },
    SXMS_SFX_Pan: (ch, v) => { au().setPan(round(ch), v); return 1; },
    SXMS_SFX_Position: (get, ch, pos) => au().position(round(get), round(ch), pos),
    SXMS_SFX_MasterVolume: (v) => { au().masterVolume(v); return 1; },
    SXMS_C_Play: (path) => au().playMusic(path),
    SXMS_C_Stop: () => { au().stopMusic(); return 1; },
    SXMS_C_Pause: () => { au().pauseMusic(); return 1; },
    SXMS_C_Loop: () => au().toggleLoop(),
    SXMS_C_Volume: (v) => { au().setMusicVolume(v); return 1; },
    SXMS_C_Time: () => au().musicTime(),
    SXMS_C_IsPlaying: () => au().musicPlaying(),
  };

  const F: Record<string, (s: I, o: I, ...a: any[]) => any> = {
    // ---------------- maths
    abs: (_s, _o, x) => Math.abs(x),
    ceil: (_s, _o, x) => Math.ceil(x),
    floor: (_s, _o, x) => Math.floor(x),
    round: (_s, _o, x) => round(x),
    sin: (_s, _o, x) => Math.sin(x),
    cos: (_s, _o, x) => Math.cos(x),
    sqrt: (_s, _o, x) => Math.sqrt(Math.max(0, x)),
    degtorad: (_s, _o, x) => x * DEG,
    random: (_s, _o, x) => Math.random() * x,
    min: (_s, _o, ...a) => Math.min(...a),
    max: (_s, _o, ...a) => Math.max(...a),
    point_distance: (_s, _o, x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
    point_direction: (_s, _o, x1, y1, x2, y2) => ((Math.atan2(y1 - y2, x2 - x1) / DEG) + 360) % 360,
    make_color_rgb: (_s, _o, rr, g, b) => (round(rr) & 255) | ((round(g) & 255) << 8) | ((round(b) & 255) << 16),
    make_color_hsv: (_s, _o, h, sat, v) => {
      h = (h / 255) * 360; sat /= 255; v /= 255;
      const c = v * sat, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
      const [r1, g1, b1] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
      return Math.round((r1 + m) * 255) | (Math.round((g1 + m) * 255) << 8) | (Math.round((b1 + m) * 255) << 16);
    },

    // ---------------- strings
    string: (_s, _o, v) => gmString(v),
    real: (_s, _o, v) => (typeof v === "number" ? v : parseFloat(v) || 0),
    ord: (_s, _o, v) => str(v).charCodeAt(0) || 0,
    chr: (_s, _o, v) => String.fromCharCode(round(v)),
    string_length: (_s, _o, v) => str(v).length,
    string_char_at: (_s, _o, v, i) => str(v).charAt(round(i) - 1),
    string_copy: (_s, _o, v, i, n) => str(v).substr(Math.max(0, round(i) - 1), Math.max(0, round(n))),
    string_delete: (_s, _o, v, i, n) => { const s = str(v), p = Math.max(0, round(i) - 1); return s.slice(0, p) + s.slice(p + Math.max(0, round(n))); },
    string_insert: (_s, _o, sub, v, i) => { const s = str(v), p = Math.max(0, round(i) - 1); return s.slice(0, p) + str(sub) + s.slice(p); },
    string_pos: (_s, _o, sub, v) => str(v).indexOf(str(sub)) + 1,
    string_count: (_s, _o, sub, v) => { const s = str(sub); return s ? str(v).split(s).length - 1 : 0; },
    string_lower: (_s, _o, v) => str(v).toLowerCase(),
    string_upper: (_s, _o, v) => str(v).toUpperCase(),
    string_replace: (_s, _o, v, a, b) => str(v).replace(str(a), () => str(b)),
    string_replace_all: (_s, _o, v, a, b) => str(v).split(str(a)).join(str(b)),
    string_digits: (_s, _o, v) => str(v).replace(/[^0-9]/g, ""),

    // ---------------- instances
    instance_create: (s, _o, x, y, obj) => {
      const i = game.spawn(round(obj), x, y);
      if (s && s !== game.dummy) game.onSpawn(s, round(obj));
      return i.id;
    },
    instance_destroy: (s) => { if (s && s !== game.dummy) game.destroy(s); return 0; },
    instance_exists: (s, o, obj) => (game.resolve(obj, s, o).length > 0 ? 1 : 0),
    instance_number: (s, o, obj) => game.resolve(obj, s, o).length,
    instance_nearest: (s, o, x, y, obj) => {
      let best: I | null = null, bd = Infinity;
      for (const i of game.resolve(obj, s, o)) { const d = Math.hypot(i.x - x, i.y - y); if (d < bd) { bd = d; best = i; } }
      return best ? best.id : NOONE;
    },
    place_meeting: (s, _o, x, y, obj) => atPosition(s, x, y, () => (anyCollision(s, obj, (i) => game.collide(s, i)) ? 1 : 0)),
    instance_place: (s, _o, x, y, obj) => atPosition(s, x, y, () => anyCollision(s, obj, (i) => game.collide(s, i))?.id ?? NOONE),
    collision_point: (s, _o, x, y, obj, prec, notme) => anyCollision(s, obj, (i) => game.collidePoint(i, x, y, prec >= 0.5), notme >= 0.5)?.id ?? NOONE,
    collision_rectangle: (s, _o, x1, y1, x2, y2, obj, prec, notme) =>
      anyCollision(s, obj, (i) => game.collideRect(i, x1, y1, x2, y2, prec >= 0.5), notme >= 0.5)?.id ?? NOONE,
    collision_circle: (s, _o, x, y, rad, obj, prec, notme) =>
      anyCollision(s, obj, (i) => game.collideCircle(i, x, y, rad, prec >= 0.5), notme >= 0.5)?.id ?? NOONE,
    motion_add: (s, _o, dir, sp) => { s.setHV(s.hspeed + Math.cos(dir * DEG) * sp, s.vspeed - Math.sin(dir * DEG) * sp); return 0; },
    motion_set: (s, _o, dir, sp) => { s.direction = dir; s.speed = sp; return 0; },
    variable_local_exists: (s, _o, name) => (("$" + name) in s ? 1 : 0),
    event_inherited: (s, o) => {
      const top = game.rt.eventStack[game.rt.eventStack.length - 1];
      if (!top) return 0;
      const parent = A.objects[top.obj]?.parent ?? -1;
      if (parent < 0) return 0;
      const fn = game.resolveEvent(parent, top.key);
      if (!fn) return 0;
      game.rt.eventStack.push({ obj: game.ownerOf(parent, top.key), key: top.key });
      try { fn(s, o, []); } finally { game.rt.eventStack.pop(); }
      return 0;
    },

    // ---------------- input
    keyboard_check: (_s, _o, k) => (game.input.check(round(k)) ? 1 : 0),
    keyboard_check_pressed: (_s, _o, k) => (game.input.pressed(round(k)) ? 1 : 0),
    keyboard_check_released: (_s, _o, k) => (game.input.released(round(k)) ? 1 : 0),
    keyboard_key_press: (_s, _o, k) => { game.input.down.add(round(k)); game.input.pressedSet.add(round(k)); return 0; },
    keyboard_key_release: (_s, _o, k) => { game.input.down.delete(round(k)); game.input.releasedSet.add(round(k)); return 0; },
    mouse_check_button: (_s, _o, b) => (b === -1 ? game.input.mouseDown.size > 0 : game.input.mouseDown.has(round(b))) ? 1 : 0,
    mouse_check_button_pressed: (_s, _o, b) => (b === -1 ? game.input.mousePressed.size > 0 : game.input.mousePressed.has(round(b))) ? 1 : 0,
    joystick_check_button: () => 0,
    joystick_xpos: () => 0,
    joystick_ypos: () => 0,

    // ---------------- rooms / game
    room_goto: (_s, _o, rm) => { game.sceneChange = { room: round(rm) }; return 0; },
    room_goto_next: () => {
      const o = game.manifest.roomOrder, i = o.indexOf(game.room);
      if (i >= 0 && i + 1 < o.length) game.sceneChange = { room: o[i + 1] };
      return 0;
    },
    room_goto_previous: () => {
      const o = game.manifest.roomOrder, i = o.indexOf(game.room);
      if (i > 0) game.sceneChange = { room: o[i - 1] };
      return 0;
    },
    room_get_name: (_s, _o, rm) => game.manifest.rooms[round(rm)]?.name ?? "",
    game_end: () => { game.sceneChange = { end: true }; return 0; },
    execute_shell: () => 0,
    web_menu: (_s, _o, kind) => { game.onMenu(str(kind)); return 0; },

    // ---------------- window / display
    window_set_fullscreen: (_s, _o, v) => {
      if (v >= 0.5 && !document.fullscreenElement && navigator.userActivation?.isActive) void game.canvas.requestFullscreen().catch(() => {});
      if (v < 0.5 && document.fullscreenElement) void document.exitFullscreen().catch(() => {});
      return 0;
    },
    window_get_width: () => BASE_W,
    window_get_height: () => BASE_H,
    window_set_position: () => 0,
    window_set_size: () => 0,
    window_set_visible: () => 0,
    window_handle: () => 1,
    window_get_stayontop: () => 0,
    display_get_width: () => screen.width,
    display_get_height: () => screen.height,
    screen_refresh: () => 0,

    // ---------------- sprites / backgrounds
    sprite_add: (_s, _o, fname, imgnumb, removeback, smooth, xo, yo) => {
      const s = new Sprite(`__newsprite${A.sprites.length}`);
      if (!fillSprite(s, fname, imgnumb, removeback, smooth, xo, yo)) return -1;
      A.sprites.push(s);
      return A.sprites.length - 1;
    },
    sprite_replace: (_s, _o, ind, fname, imgnumb, removeback, smooth, xo, yo) => {
      const s = sprite(ind);
      if (!s) return 0;
      fillSprite(s, fname, imgnumb, removeback, smooth, xo, yo);
      return 0;
    },
    sprite_exists: (_s, _o, ind) => (sprite(ind) && sprite(ind).frames.length ? 1 : 0),
    sprite_get_width: (_s, _o, ind) => sprite(ind)?.w ?? 0,
    sprite_get_height: (_s, _o, ind) => sprite(ind)?.h ?? 0,
    sprite_set_offset: (_s, _o, ind, x, y) => { const s = sprite(ind); if (s) { s.ox = round(x); s.oy = round(y); } return 0; },
    background_add: (_s, _o, fname) => {
      const img = imageFor(fname);
      if (!img) return -1;
      const b = new Background(`__newbackground${A.backgrounds.length}`);
      b.w = img.width; b.h = img.height;
      b.frame = { src: img, sx: 0, sy: 0, w: img.width, h: img.height };
      A.backgrounds.push(b);
      return A.backgrounds.length - 1;
    },

    // ---------------- drawing
    draw_set_color: (_s, _o, c) => { game.drawColour = round(c); return 0; },
    draw_set_alpha: (_s, _o, a) => { game.drawAlpha = a; return 0; },
    draw_set_blend_mode: (_s, _o, m) => { game.blendMode = round(m); r.setBlendMode(game.blendMode); return 0; },
    draw_set_blend_mode_ext: (_s, _o, src, dst) => { game.blendMode = -1; r.setBlendExt(round(src), round(dst)); return 0; },
    draw_set_font: (_s, _o, f) => { game.font = round(f); return 0; },
    draw_set_halign: (_s, _o, a) => { game.halign = round(a); return 0; },
    draw_set_valign: (_s, _o, a) => { game.valign = round(a); return 0; },
    draw_sprite: (s, _o, spr, sub, x, y) => {
      const sp = sprite(spr);
      if (sp) game.drawSprite(sp, sub < 0 ? s.image_index : sub, x, y, 1, 1, 0, 0xffffff, 1);
      return 0;
    },
    draw_sprite_ext: (s, _o, spr, sub, x, y, xs, ys, rot, col, alpha) => {
      const sp = sprite(spr);
      if (sp) game.drawSprite(sp, sub < 0 ? s.image_index : sub, x, y, xs, ys, rot, round(col), alpha);
      return 0;
    },
    draw_sprite_part_ext: (s, _o, spr, sub, left, top, w, h, x, y, xs, ys, col, alpha) => {
      const sp = sprite(spr);
      if (!sp || !sp.frames.length) return 0;
      const n = sp.frames.length, idx = sub < 0 ? s.image_index : sub;
      const f = sp.frames[((Math.floor(idx) % n) + n) % n];
      const l = Math.max(0, left), t = Math.max(0, top);
      const pw = Math.min(w, f.w - l), ph = Math.min(h, f.h - t);
      if (pw > 0 && ph > 0) r.drawFrame(f, l, t, pw, ph, x, y, 0, 0, xs, ys, 0, round(col), alpha);
      return 0;
    },
    draw_background: (_s, _o, b, x, y) => { const f = bg(b)?.frame; if (f) r.drawFrame(f, 0, 0, f.w, f.h, x, y, 0, 0, 1, 1, 0, 0xffffff, 1); return 0; },
    draw_background_ext: (_s, _o, b, x, y, xs, ys, rot, col, alpha) => {
      const f = bg(b)?.frame; if (f) r.drawFrame(f, 0, 0, f.w, f.h, x, y, 0, 0, xs, ys, rot, round(col), alpha); return 0;
    },
    draw_background_stretched: (_s, _o, b, x, y, w, h) => {
      const f = bg(b)?.frame;
      if (f) { [x, w] = game.widenSpan(x, w); r.drawFrame(f, 0, 0, f.w, f.h, x, y, 0, 0, w / f.w, h / f.h, 0, 0xffffff, 1); }
      return 0;
    },
    draw_background_stretched_ext: (_s, _o, b, x, y, w, h, col, alpha) => {
      const f = bg(b)?.frame;
      if (f) { [x, w] = game.widenSpan(x, w); r.drawFrame(f, 0, 0, f.w, f.h, x, y, 0, 0, w / f.w, h / f.h, 0, round(col), alpha); }
      return 0;
    },
    web_hud_left: () => game.hudLeft(),
    web_hud_right: () => game.hudRight(),
    draw_background_part_ext: (_s, _o, b, left, top, w, h, x, y, xs, ys, col, alpha) => {
      const f = bg(b)?.frame;
      if (!f) return 0;
      const l = Math.max(0, left), t = Math.max(0, top), pw = Math.min(w, f.w - l), ph = Math.min(h, f.h - t);
      if (pw > 0 && ph > 0) r.drawFrame(f, l, t, pw, ph, x, y, 0, 0, xs, ys, 0, round(col), alpha);
      return 0;
    },
    draw_rectangle: (_s, _o, x1, y1, x2, y2, outline) => {
      const c = rgba(game.drawColour, game.drawAlpha);
      let l = Math.min(x1, x2), rr = Math.max(x1, x2);
      const t = Math.min(y1, y2), b = Math.max(y1, y2);
      if (outline < 0.5) [l, rr] = game.widenRect(l, rr);
      if (outline >= 0.5) {
        r.rect(l, t, rr + 1, t + 1, [c, c, c, c]); r.rect(l, b, rr + 1, b + 1, [c, c, c, c]);
        r.rect(l, t, l + 1, b + 1, [c, c, c, c]); r.rect(rr, t, rr + 1, b + 1, [c, c, c, c]);
      } else r.rect(l, t, rr + 1, b + 1, [c, c, c, c]);
      return 0;
    },
    draw_circle_color: (_s, _o, x, y, rad, c1, c2, outline) => {
      const ci = rgba(round(c1), game.drawAlpha), co = rgba(round(c2), game.drawAlpha);
      const n = 32;
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
        const px0 = x + Math.cos(a0) * rad, py0 = y + Math.sin(a0) * rad, px1 = x + Math.cos(a1) * rad, py1 = y + Math.sin(a1) * rad;
        if (outline >= 0.5) r.line(px0, py0, px1, py1, 1, co);
        else r.quad(r.white, [x, px0, px1, x], [y, py0, py1, y], 0, 0, 1, 1, [ci, co, co, ci]);
      }
      return 0;
    },
    draw_text: (_s, _o, x, y, str) => { drawText(x, y, lines(str), 1, 1, 0, -1); return 0; },
    draw_text_transformed: (_s, _o, x, y, str, xs, ys, ang) => { drawText(x, y, lines(str), xs, ys, ang, -1); return 0; },
    draw_text_ext_transformed: (_s, _o, x, y, str, sep, w, xs, ys, ang) => { drawText(x, y, wrap(str, w), xs, ys, ang, sep); return 0; },
    font_add_sprite: (_s, _o, spr, first, prop, sep) => {
      const sp = sprite(spr);
      const f: SpriteFont = { sprite: round(spr), first: round(first), prop: prop >= 0.5, sep: round(sep), widths: [], lefts: [] };
      if (sp) {
        // Proportional widths come from each glyph's opaque columns.
        const cv = document.createElement("canvas");
        const c = cv.getContext("2d", { willReadFrequently: true })!;
        sp.frames.forEach((fr, gi) => {
          cv.width = fr.w; cv.height = fr.h;
          c.clearRect(0, 0, fr.w, fr.h);
          try { c.drawImage(fr.src as CanvasImageSource, fr.sx, fr.sy, fr.w, fr.h, 0, 0, fr.w, fr.h); } catch {}
          const d = c.getImageData(0, 0, fr.w, fr.h).data;
          let l = fr.w - 1, rr = 0, found = false;
          for (let x = 0; x < fr.w; x++) for (let y = 0; y < fr.h; y++) if (d[(y * fr.w + x) * 4 + 3] > 0) { if (!found) l = x; found = true; rr = x; break; }
          f.lefts[gi] = l;
          f.widths[gi] = rr + f.sep - l;
        });
      }
      fonts.push(f);
      return fonts.length - 1;
    },

    // ---------------- surfaces
    surface_create: (_s, _o, w, h) => {
      const gl = r.gl;
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, r.target.fb);
      gl.bindTexture(gl.TEXTURE_2D, r.curTex);
      const key = {};
      r.texCache.set(key, { tex, w, h });
      surfaces.push({ fb, tex, w, h, frame: { src: key as any, sx: 0, sy: 0, w, h } });
      return surfaces.length - 1;
    },
    surface_exists: (_s, _o, id) => (surfaces[round(id)] ? 1 : 0),
    surface_set_target: (_s, _o, id) => {
      const sf = surfaces[round(id)];
      if (!sf) return 0;
      r.setTarget(sf.fb, sf.w, sf.h);
      r.setView(0, 0, sf.w, sf.h, 0, 0, 0, sf.w, sf.h);
      return 1;
    },
    surface_reset_target: () => {
      r.setTarget(null, game.canvas.width, game.canvas.height);
      game.applyView(game.viewsEnabled ? game.viewCurrent : -1);
      return 0;
    },
    draw_surface_ext: (_s, _o, id, x, y, xs, ys, rot, col, alpha) => {
      const sf = surfaces[round(id)];
      if (sf) r.drawFrame(sf.frame, 0, 0, sf.w, sf.h, x, y, 0, 0, xs, ys, rot, round(col), alpha);
      return 0;
    },

    // ---------------- particles
    part_system_create: () => game.particles.sysId(game.particles.createSystem()),
    part_system_depth: (_s, _o, ps, d) => { const s = game.particles.sys(ps); if (s) { s.depth = d; game.depthDirty = true; } return 0; },
    part_system_automatic_update: (_s, _o, ps, v) => { const s = game.particles.sys(ps); if (s) s.auto = v >= 0.5; return 0; },
    part_type_create: () => { game.particles.types.push(new PartType()); return game.particles.types.length - 1; },
    part_type_shape: (_s, _o, t, sh) => { const p = game.particles.types[t]; if (p) p.shape = round(sh); return 0; },
    part_type_sprite: (_s, _o, t, spr, anim, stretch, rnd) => {
      const p = game.particles.types[t];
      if (p) { p.sprite = round(spr); p.spriteAnimate = anim >= 0.5; p.spriteStretch = stretch >= 0.5; p.spriteRandom = rnd >= 0.5; }
      return 0;
    },
    part_type_size: (_s, _o, t, mn, mx, inc, wig) => { const p = game.particles.types[t]; if (p) Object.assign(p, { sizeMin: mn, sizeMax: mx, sizeIncr: inc, sizeWiggle: wig }); return 0; },
    part_type_scale: (_s, _o, t, xs, ys) => { const p = game.particles.types[t]; if (p) Object.assign(p, { xscale: xs, yscale: ys }); return 0; },
    part_type_orientation: (_s, _o, t, mn, mx, inc, wig, rel) => {
      const p = game.particles.types[t]; if (p) Object.assign(p, { angMin: mn, angMax: mx, angIncr: inc, angWiggle: wig, angRelative: rel >= 0.5 }); return 0;
    },
    part_type_color1: (_s, _o, t, c) => { const p = game.particles.types[t]; if (p) { p.colourMode = 0; p.colours = [c, c, c]; } return 0; },
    part_type_color_mix: (_s, _o, t, c1, c2) => { const p = game.particles.types[t]; if (p) { p.colourMode = 1; p.colours = [c1, c2, c2]; } return 0; },
    part_type_color2: (_s, _o, t, c1, c2) => { const p = game.particles.types[t]; if (p) { p.colourMode = 2; p.colours = [c1, c2, c2]; } return 0; },
    part_type_color3: (_s, _o, t, c1, c2, c3) => { const p = game.particles.types[t]; if (p) { p.colourMode = 3; p.colours = [c1, c2, c3]; } return 0; },
    part_type_alpha1: (_s, _o, t, a) => { const p = game.particles.types[t]; if (p) p.alphas = [a, a, a]; return 0; },
    part_type_alpha2: (_s, _o, t, a1, a2) => { const p = game.particles.types[t]; if (p) p.alphas = [a1, (a1 + a2) / 2, a2]; return 0; },
    part_type_alpha3: (_s, _o, t, a1, a2, a3) => { const p = game.particles.types[t]; if (p) p.alphas = [a1, a2, a3]; return 0; },
    part_type_blend: (_s, _o, t, add) => { const p = game.particles.types[t]; if (p) p.additive = add >= 0.5; return 0; },
    part_type_life: (_s, _o, t, mn, mx) => { const p = game.particles.types[t]; if (p) Object.assign(p, { lifeMin: mn, lifeMax: mx }); return 0; },
    part_type_speed: (_s, _o, t, mn, mx, inc, wig) => { const p = game.particles.types[t]; if (p) Object.assign(p, { speedMin: mn, speedMax: mx, speedIncr: inc, speedWiggle: wig }); return 0; },
    part_type_direction: (_s, _o, t, mn, mx, inc, wig) => { const p = game.particles.types[t]; if (p) Object.assign(p, { dirMin: mn, dirMax: mx, dirIncr: inc, dirWiggle: wig }); return 0; },
    part_type_gravity: (_s, _o, t, amt, dir) => { const p = game.particles.types[t]; if (p) Object.assign(p, { gravAmount: amt, gravDir: dir }); return 0; },
    part_particles_create: (_s, _o, ps, x, y, t, n) => { game.particles.create(round(ps), x, y, round(t), round(n)); return 0; },
    part_particles_create_color: (_s, _o, ps, x, y, t, c, n) => { game.particles.create(round(ps), x, y, round(t), round(n), round(c)); return 0; },
    part_emitter_create: (_s, _o, ps) => {
      const s = game.particles.sys(ps);
      if (!s) return -1;
      s.emitters.push({ x1: 0, y1: 0, x2: 0, y2: 0, shape: 0, distr: 0 });
      return s.emitters.length - 1;
    },
    part_emitter_region: (_s, _o, ps, em, x1, x2, y1, y2, shape, distr) => {
      const e = game.particles.sys(ps)?.emitters[em];
      if (e) Object.assign(e, { x1, x2, y1, y2, shape: round(shape), distr: round(distr) });
      return 0;
    },
    part_emitter_burst: (_s, _o, ps, em, t, n) => { game.particles.burst(round(ps), round(em), round(t), round(n)); return 0; },
    effect_create_above: (_s, _o, kind, x, y, size, col) => { game.particles.effect(true, round(kind), x, y, round(size), round(col)); return 0; },
    effect_create_below: (_s, _o, kind, x, y, size, col) => { game.particles.effect(false, round(kind), x, y, round(size), round(col)); return 0; },

    // ---------------- paths (straight segments)
    path_add: () => { paths.push({ points: [], closed: true }); return paths.length - 1; },
    path_add_point: (_s, _o, p, x, y, sp) => { paths[p]?.points.push([x, y, sp]); return 0; },
    path_set_kind: () => 0,
    path_set_precision: () => 0,
    path_set_closed: (_s, _o, p, c) => { if (paths[p]) paths[p].closed = c >= 0.5; return 0; },
    path_start: (s, _o, p, sp, _end, absolute) => {
      const path = paths[round(p)];
      if (!path || path.points.length < 2) return 0;
      const ox = absolute >= 0.5 ? 0 : s.x - path.points[0][0], oy = absolute >= 0.5 ? 0 : s.y - path.points[0][1];
      let seg = 0;
      const stepFn = () => {
        if (s.destroyed || seg >= path.points.length - 1) return;
        const [tx, ty] = path.points[seg + 1];
        const dx = tx + ox - s.x, dy = ty + oy - s.y, d = Math.hypot(dx, dy);
        if (d <= sp) { s.x = tx + ox; s.y = ty + oy; seg++; }
        else { s.x += (dx / d) * sp; s.y += (dy / d) * sp; }
        requestAnimationFrame(stepFn);
      };
      game.warn("path_start uses a simplified straight-line follower");
      stepFn();
      return 0;
    },

    // ---------------- tiles
    tile_add: (_s, _o, b, left, top, w, h, x, y, depth) => {
      const t: Tile = { id: game.nextTileId++, bg: round(b), left, top, w, h, x, y, depth, xscale: 1, yscale: 1, blend: 0xffffff, alpha: 1, visible: true };
      game.tiles.push(t);
      game.tilesSorted = false;
      return t.id;
    },
    tile_delete: (_s, _o, id) => { game.tiles = game.tiles.filter((t) => t.id !== id); game.tilesSorted = false; return 0; },
    tile_exists: (_s, _o, id) => (game.tiles.some((t) => t.id === id) ? 1 : 0),
    tile_get_x: (_s, _o, id) => game.tiles.find((t) => t.id === id)?.x ?? 0,
    tile_get_y: (_s, _o, id) => game.tiles.find((t) => t.id === id)?.y ?? 0,
    tile_get_width: (_s, _o, id) => game.tiles.find((t) => t.id === id)?.w ?? 0,
    tile_get_height: (_s, _o, id) => game.tiles.find((t) => t.id === id)?.h ?? 0,
    tile_get_depth: (_s, _o, id) => game.tiles.find((t) => t.id === id)?.depth ?? 0,
    tile_set_alpha: (_s, _o, id, a) => { const t = game.tiles.find((t) => t.id === id); if (t) t.alpha = a; return 0; },
    tile_set_blend: (_s, _o, id, c) => { const t = game.tiles.find((t) => t.id === id); if (t) t.blend = round(c); return 0; },
    tile_layer_find: (_s, _o, depth, x, y) =>
      game.tiles.find((t) => t.depth === depth && x >= t.x && y >= t.y && x < t.x + t.w * t.xscale && y < t.y + t.h * t.yscale)?.id ?? -1,

    // ---------------- files
    file_bin_open: (_s, _o, f, mode) => game.vfs.open(gmString(f), round(mode)),
    file_bin_close: (_s, _o, h) => { game.vfs.close(round(h)); return 0; },
    file_bin_seek: (_s, _o, h, pos) => { game.vfs.seek(round(h), pos); return 0; },
    file_bin_read_byte: (_s, _o, h) => game.vfs.readByte(round(h)),
    file_bin_write_byte: (_s, _o, h, v) => { game.vfs.writeByte(round(h), v); return 0; },
    file_exists: (_s, _o, f) => (game.vfs.exists(gmString(f)) || game.images.has(gmString(f).replace(/^\.\//, "").toLowerCase()) ? 1 : 0),
    file_rename: (_s, _o, a, b) => game.vfs.rename(gmString(a), gmString(b)),

    // ---------------- DLLs
    external_define: (_s, _o, _dll, name) => { externals.push(gmString(name)); return externals.length - 1; },
    external_call: (_s, _o, id, ...args) => {
      const name = externals[round(id)];
      const fn = name ? SXMS[name] : undefined;
      if (fn) return fn(...args) ?? 0;
      return 0;
    },
    external_free: () => 0,
  };
  return F;
}
