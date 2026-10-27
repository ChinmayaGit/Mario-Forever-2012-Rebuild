import { Background, type Frame, type Manifest, type ObjectDef, Sprite, loadImage, maskHit } from "./assets.ts";
import { Audio } from "./audio.ts";
import { Instance } from "./instance.ts";
import { Particles, type PartSystem } from "./particles.ts";
import { Renderer } from "./renderer.ts";
import { VFS } from "./vfs.ts";
import { Input } from "./input.ts";
import { makeFunctions } from "./functions.ts";
import { makeRt } from "./rt.ts";
import { install } from "../generated/game.js";

type Fn = (s: any, o: any, a: any[]) => any;

export const EV = { CREATE: 0, DESTROY: 1, ALARM: 2, STEP: 3, COLLISION: 4, KEYBOARD: 5, MOUSE: 6, OTHER: 7, DRAW: 8, KEYPRESS: 9, KEYRELEASE: 10 };

export interface Tile {
  id: number; bg: number; left: number; top: number; w: number; h: number;
  x: number; y: number; depth: number; xscale: number; yscale: number; blend: number; alpha: number;
  visible: boolean;
}

interface RoomData {
  name: string; caption: string; w: number; h: number; speed: number; persistent: boolean; colour: number;
  clear: boolean; hasCode: boolean; backgrounds: any[]; viewsEnabled: boolean; views: any[];
  instances: { x: number; y: number; obj: number; id: number; code: number; xs?: number; ys?: number; a?: number; c?: number }[];
  tiles: number[][];
}

interface StoredRoom { instances: Instance[]; tiles: Tile[]; state: any }

const VIEW_KEYS = ["view_visible", "view_xview", "view_yview", "view_wview", "view_hview", "view_xport", "view_yport",
  "view_wport", "view_hport", "view_angle", "view_hborder", "view_vborder", "view_hspeed", "view_vspeed", "view_object"] as const;
const BG_KEYS = ["background_visible", "background_foreground", "background_index", "background_x", "background_y",
  "background_htiled", "background_vtiled", "background_xscale", "background_yscale", "background_hspeed",
  "background_vspeed", "background_blend", "background_alpha"] as const;

export class Game {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  audio!: Audio;
  vfs = new VFS();
  input: Input;
  particles: Particles;
  manifest!: Manifest;
  assets = { objects: [] as ObjectDef[], sprites: [] as Sprite[], backgrounds: [] as Background[] };
  images = new Map<string, HTMLImageElement>();
  rooms = new Map<number, RoomData>();

  E: Record<string, Fn>[] = [];
  RC: Fn[] = [];
  IC: Record<string, Fn> = {};
  S: Record<string, Fn> = {};
  F: Record<string, (...a: any[]) => any> = {};
  G: Record<string, any> = {};
  R: any;
  rt: any;

  instances: Instance[] = [];
  byObject: Instance[][] = [];
  byId = new Map<number, Instance>();
  descendants: number[][] = [];
  holders = new Map<string, number[]>();
  eventCache = new Map<string, Fn | null>();
  nextId = 1000000;
  nextOrder = 0;
  depthDirty = true;
  drawList: (Instance | Tile | PartSystem)[] = [];

  room = -1;
  roomWidth = 800; roomHeight = 600; roomSpeed = 60; roomCaption = ""; roomPersistent = false;
  bgColour = 0; bgShowColour = true;
  viewsEnabled = false;
  views: Record<(typeof VIEW_KEYS)[number], number[]> = {} as any;
  bgs: Record<(typeof BG_KEYS)[number], number[]> = {} as any;
  viewCurrent = 0;
  tiles: Tile[] = [];
  tilesSorted = true;
  nextTileId = 20000000;
  storedRooms = new Map<number, StoredRoom>();
  sceneChange: { room: number } | { end: true } | null = null;
  gameStart = true;
  dummy!: Instance;

  // draw state
  drawColour = 0;
  drawAlpha = 1;
  blendMode = 0;
  font = -1;
  halign = 0;
  valign = 0;

  // timing
  fps = 60;
  frameCount = 0;
  ended = false;
  warned = new Set<string>();
  log: string[] = [];
  snapWaiters: ((url: string) => void)[] = [];
  /** PNG data URL of the next drawn frame (debugging aid). */
  snapshot() { return new Promise<string>((res) => this.snapWaiters.push(res)); }
  onStatus: (msg: string) => void = () => {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.input = new Input(canvas);
    this.particles = new Particles(this);
    for (const k of VIEW_KEYS) this.views[k] = new Array(8).fill(0);
    for (const k of BG_KEYS) this.bgs[k] = new Array(8).fill(0);
  }

  warn(msg: string) {
    if (this.warned.has(msg)) return;
    this.warned.add(msg);
    this.log.push("W " + msg);
    console.warn("[gm8]", msg);
  }

  // ---------------------------------------------------------------- loading
  async load() {
    this.manifest = await (await fetch("assets/manifest.json")).json();
    const m = this.manifest;
    this.audio = new Audio(m.unsupportedAudio);
    this.renderer.interpolate = true;
    const maskBin = new Uint8Array(await (await fetch("assets/masks.bin")).arrayBuffer());

    this.assets.objects = m.objects as ObjectDef[];
    this.computeHierarchy();

    const jobs: (() => Promise<void>)[] = [];
    this.assets.sprites = m.sprites.map((d: any, i: number) => {
      const s = new Sprite(d?.name ?? `__sprite${i}`);
      if (!d) return s;
      s.w = d.w; s.h = d.h; s.ox = d.ox; s.oy = d.oy; s.sep = d.sep; s.bbox = d.bbox;
      s.masks = d.masks.map((c: any) => ({ w: c.w, h: c.h, l: c.l, r: c.r, t: c.t, b: c.b, off: c.off, bits: maskBin }));
      s.frames = new Array(d.frames);
      for (let f = 0; f < d.frames; f++) {
        jobs.push(async () => {
          const img = await loadImage(`assets/sprites/${d.dir}/${f}.png`);
          s.frames[f] = { src: img, sx: 0, sy: 0, w: img.width, h: img.height };
        });
      }
      return s;
    });
    this.assets.backgrounds = m.backgrounds.map((d: any, i: number) => {
      const b = new Background(d?.name ?? `__bg${i}`);
      if (!d) return b;
      b.w = d.w; b.h = d.h;
      if (d.w > 0) jobs.push(async () => {
        const img = await loadImage(`assets/backgrounds/${d.file}.png`);
        b.frame = { src: img, sx: 0, sy: 0, w: img.width, h: img.height };
      });
      return b;
    });
    // The game loads most of its art at runtime with sprite_add(); preload those files so the calls can be synchronous.
    for (const f of m.gfxFiles) {
      jobs.push(async () => {
        try { this.images.set(`data/gfx/${f}`.toLowerCase(), await loadImage(`data/gfx/${f}`)); } catch { /* not an image */ }
      });
    }
    for (const f of ["tit1.png", "tit2.png", "tit3.png", "tit_back_1.png", "tit_glowwing.png", "tit_main_1.png", "tit_main_2.png", "tit_sparcle_logo.png", "mariotail.png", "napis_efekt.png"]) {
      jobs.push(async () => { this.images.set(`data/t/${f}`, await loadImage(`data/t/${f}`)); });
    }
    jobs.push(() => this.vfs.preload(m.binaryFiles));

    let done = 0;
    const total = jobs.length;
    const queue = jobs.slice();
    const worker = async () => {
      while (queue.length) {
        const j = queue.shift()!;
        await j();
        done++;
        if (done % 25 === 0) this.onStatus(`Loading ${Math.round((done / total) * 100)}%`);
      }
    };
    await Promise.all(Array.from({ length: 16 }, worker));

    this.rt = makeRt(this);
    this.F = makeFunctions(this);
    install(this.rt, this.R, this.G, this.F, this.S, this.E, this.RC, this.IC);
    this.buildHolders();
    this.dummy = new Instance(this, -999, 0, 0, 0, -1);
  }

  computeHierarchy() {
    const objs = this.assets.objects;
    this.descendants = objs.map(() => []);
    this.byObject = objs.map(() => []);
    objs.forEach((o, i) => {
      if (!o) return;
      let p: number = i;
      const seen = new Set<number>();
      while (p >= 0 && objs[p] && !seen.has(p)) {
        seen.add(p);
        this.descendants[p].push(i);
        p = objs[p].parent;
      }
    });
  }

  /** Find an event for an object, walking up the parent chain like GM8. */
  resolveEvent(obj: number, key: string): Fn | null {
    const ck = obj + "|" + key;
    const hit = this.eventCache.get(ck);
    if (hit !== undefined) return hit;
    let p = obj, fn: Fn | null = null;
    const seen = new Set<number>();
    while (p >= 0 && !seen.has(p)) {
      seen.add(p);
      const ev = this.E[p]?.[key];
      if (ev) { fn = ev; break; }
      p = this.assets.objects[p]?.parent ?? -1;
    }
    this.eventCache.set(ck, fn);
    return fn;
  }

  /** Parent of the object owning the event currently resolved for (obj, key): used by event_inherited. */
  resolveParentEvent(owner: number, key: string): Fn | null {
    const parent = this.assets.objects[owner]?.parent ?? -1;
    return parent >= 0 ? this.resolveEvent(parent, key) : null;
  }

  buildHolders() {
    const keys = new Set<string>();
    for (const e of this.E) if (e) for (const k of Object.keys(e)) keys.add(k);
    for (const k of keys) {
      const list: number[] = [];
      this.assets.objects.forEach((o, i) => { if (o && this.resolveEvent(i, k)) list.push(i); });
      this.holders.set(k, list);
    }
  }

  async roomData(index: number): Promise<RoomData> {
    let r = this.rooms.get(index);
    if (!r) {
      r = await (await fetch(`assets/rooms/${index}.json`)).json() as RoomData;
      this.rooms.set(index, r);
    }
    return r;
  }

  // ---------------------------------------------------------------- instances
  createInstance(obj: number, x: number, y: number, id?: number): Instance {
    const inst = new Instance(this, id ?? this.nextId++, obj, x, y, this.nextOrder++);
    this.instances.push(inst);
    this.byObject[obj]?.push(inst);
    this.byId.set(inst.id, inst);
    this.depthDirty = true;
    return inst;
  }

  /** instance_create semantics: create and immediately run the create event. */
  spawn(obj: number, x: number, y: number): Instance {
    const inst = this.createInstance(obj, x, y);
    this.runEvent(inst, EV.CREATE, 0, inst);
    return inst;
  }

  destroy(inst: Instance, runEvent = true) {
    if (inst.destroyed) return;
    if (runEvent) this.runEvent(inst, EV.DESTROY, 0, inst);
    inst.destroyed = true;
    this.byId.delete(inst.id);
  }

  purge() {
    if (!this.instances.some((i) => i.destroyed)) return;
    this.instances = this.instances.filter((i) => !i.destroyed);
    for (let o = 0; o < this.byObject.length; o++) {
      const l = this.byObject[o];
      if (l.length && l.some((i) => i.destroyed)) this.byObject[o] = l.filter((i) => !i.destroyed);
    }
    this.depthDirty = true;
  }

  /** Live instances matching an object index (including children), an instance id, or a keyword. */
  resolve(target: number, s: Instance | null, o: Instance | null): Instance[] {
    target = Math.round(target);
    if (target >= 0 && target < this.assets.objects.length) {
      const d = this.descendants[target];
      if (d.length === 1) return this.byObject[target].filter((i) => !i.destroyed);
      const out: Instance[] = [];
      for (const ob of d) for (const i of this.byObject[ob]) if (!i.destroyed) out.push(i);
      out.sort((a, b) => a.order - b.order);
      return out;
    }
    if (target === -1) return s && !s.destroyed ? [s] : [];
    if (target === -2) return o && !o.destroyed ? [o] : [];
    if (target === -3) return this.instances.filter((i) => !i.destroyed);
    const inst = this.byId.get(target);
    return inst && !inst.destroyed ? [inst] : [];
  }

  // ---------------------------------------------------------------- events
  runEvent(inst: Instance, type: number, sub: number, other: Instance): boolean {
    if (inst.destroyed && type !== EV.DESTROY) return false;
    const fn = this.resolveEvent(inst.object_index, `${type}:${sub}`);
    if (!fn) return false;
    const prev = this.rt.eventStack.length;
    this.rt.eventStack.push({ obj: this.ownerOf(inst.object_index, `${type}:${sub}`), key: `${type}:${sub}` });
    try {
      fn(inst, other, []);
    } catch (e) {
      this.reportError(e, `${this.assets.objects[inst.object_index]?.name} event ${type}:${sub}`);
    } finally {
      this.rt.eventStack.length = prev;
    }
    return true;
  }

  ownerOf(obj: number, key: string): number {
    let p = obj;
    const seen = new Set<number>();
    while (p >= 0 && !seen.has(p)) {
      seen.add(p);
      if (this.E[p]?.[key]) return p;
      p = this.assets.objects[p]?.parent ?? -1;
    }
    return obj;
  }

  reportError(e: unknown, where: string) {
    const msg = `${where}: ${(e as Error)?.message ?? e}`;
    if (!this.warned.has(msg)) {
      this.warned.add(msg);
      this.log.push("E " + msg + " @ " + String((e as Error)?.stack ?? "").split("\n").slice(1, 3).join(" | "));
      console.error("[gm8]", msg, e);
    }
  }

  runObjectEvent(type: number, sub: number) {
    const holders = this.holders.get(`${type}:${sub}`);
    if (!holders) return;
    for (const obj of holders) {
      const list = this.byObject[obj];
      if (!list.length) continue;
      for (const inst of list.slice()) {
        if (!inst.destroyed) this.runEvent(inst, type, sub, inst);
        if (this.sceneChange) return;
      }
    }
  }

  runOtherEvent(sub: number) {
    for (const inst of this.instances.slice()) if (!inst.destroyed) this.runEvent(inst, EV.OTHER, sub, inst);
  }

  // ---------------------------------------------------------------- rooms
  async gotoRoom(index: number) {
    const data = await this.roomData(index);
    this.log.push(`R ${this.frameCount} ${this.manifest.rooms[this.room]?.name ?? "-"} -> ${data.name}`);
    this.runOtherEvent(5); // room end
    this.sceneChange = null;

    const persistent = this.instances.filter((i) => !i.destroyed && i.persistent);
    if (this.room >= 0 && this.roomPersistent) {
      this.storedRooms.set(this.room, {
        instances: this.instances.filter((i) => !i.destroyed && !i.persistent),
        tiles: this.tiles,
        state: this.saveRoomState(),
      });
    }
    this.instances = [];
    this.byObject = this.assets.objects.map(() => []);
    this.byId.clear();

    const stored = this.storedRooms.get(index);
    this.storedRooms.delete(index);
    this.room = index;
    const fresh: { inst: Instance; code: number }[] = [];
    if (stored) {
      for (const i of stored.instances) this.reinsert(i);
      this.tiles = stored.tiles;
      this.restoreRoomState(stored.state);
    } else {
      this.applyRoomData(data);
      for (const d of data.instances) {
        if (persistent.some((p) => p.id === d.id)) continue;
        const inst = this.createInstance(d.obj, d.x, d.y, d.id);
        if (d.xs !== undefined) inst.image_xscale = d.xs;
        if (d.ys !== undefined) inst.image_yscale = d.ys;
        if (d.a !== undefined) inst.image_angle = d.a;
        if (d.c !== undefined) { inst.image_blend = d.c & 0xffffff; inst.image_alpha = (d.c >>> 24) / 255; }
        fresh.push({ inst, code: d.code ? d.id : 0 });
      }
    }
    for (const p of persistent) this.reinsert(p);
    this.input.step();
    this.particles.effectsAbove.parts = [];
    this.particles.effectsBelow.parts = [];

    for (const { inst, code } of fresh) {
      if (inst.destroyed) continue;
      if (code) this.callTop(this.IC[`${index}:${code}`], inst, inst, `instance code ${code}`);
      this.runEvent(inst, EV.CREATE, 0, inst);
    }
    if (this.gameStart) { this.runOtherEvent(2); this.gameStart = false; }
    if (!stored && data.hasCode) this.callTop(this.RC[index], this.dummy, this.dummy, `room ${data.name} creation code`);
    this.runOtherEvent(4); // room start
    this.depthDirty = true;
    this.tilesSorted = false;
  }

  reinsert(i: Instance) {
    this.instances.push(i);
    this.byObject[i.object_index]?.push(i);
    this.byId.set(i.id, i);
  }

  callTop(fn: Fn | undefined, s: Instance, o: Instance, where: string) {
    if (!fn) return;
    try { fn(s, o, []); } catch (e) { this.reportError(e, where); }
  }

  applyRoomData(d: RoomData) {
    this.roomWidth = d.w; this.roomHeight = d.h; this.roomSpeed = d.speed; this.roomCaption = d.caption;
    this.roomPersistent = d.persistent; this.bgColour = d.colour; this.bgShowColour = d.clear;
    this.viewsEnabled = d.viewsEnabled;
    d.views.forEach((v, i) => {
      const V = this.views;
      V.view_visible[i] = v.visible ? 1 : 0; V.view_xview[i] = v.x; V.view_yview[i] = v.y; V.view_wview[i] = v.w;
      V.view_hview[i] = v.h; V.view_xport[i] = v.port_x; V.view_yport[i] = v.port_y; V.view_wport[i] = v.port_w;
      V.view_hport[i] = v.port_h; V.view_angle[i] = 0; V.view_hborder[i] = v.hborder; V.view_vborder[i] = v.vborder;
      V.view_hspeed[i] = v.hspeed; V.view_vspeed[i] = v.vspeed; V.view_object[i] = v.follow;
    });
    d.backgrounds.forEach((b, i) => {
      const B = this.bgs;
      B.background_visible[i] = b.visible ? 1 : 0; B.background_foreground[i] = b.foreground ? 1 : 0;
      B.background_index[i] = b.bg; B.background_x[i] = b.x; B.background_y[i] = b.y;
      B.background_htiled[i] = b.tile_h ? 1 : 0; B.background_vtiled[i] = b.tile_v ? 1 : 0;
      B.background_xscale[i] = 1; B.background_yscale[i] = 1; B.background_hspeed[i] = b.hspeed;
      B.background_vspeed[i] = b.vspeed; B.background_blend[i] = 0xffffff; B.background_alpha[i] = 1;
      (B as any).stretch = (B as any).stretch ?? []; (B as any).stretch[i] = b.stretch;
    });
    this.tiles = d.tiles.map((t) => ({
      x: t[0], y: t[1], bg: t[2], left: t[3], top: t[4], w: t[5], h: t[6], depth: t[7], id: t[8],
      xscale: t[9], yscale: t[10], blend: t[11] & 0xffffff, alpha: (t[11] >>> 24) / 255, visible: true,
    }));
  }

  saveRoomState() {
    return {
      w: this.roomWidth, h: this.roomHeight, speed: this.roomSpeed, caption: this.roomCaption, persistent: this.roomPersistent,
      colour: this.bgColour, show: this.bgShowColour, viewsEnabled: this.viewsEnabled,
      views: JSON.parse(JSON.stringify(this.views)), bgs: JSON.parse(JSON.stringify(this.bgs)),
    };
  }
  restoreRoomState(s: any) {
    this.roomWidth = s.w; this.roomHeight = s.h; this.roomSpeed = s.speed; this.roomCaption = s.caption;
    this.roomPersistent = s.persistent; this.bgColour = s.colour; this.bgShowColour = s.show; this.viewsEnabled = s.viewsEnabled;
    Object.assign(this.views, s.views); Object.assign(this.bgs, s.bgs);
  }

  // ---------------------------------------------------------------- frame
  step() {
    const insts = this.instances;
    for (const i of insts) { i.xprevious = i.x; i.yprevious = i.y; }
    this.runObjectEvent(EV.STEP, 1);
    if (this.sceneChange) return;
    this.runAlarms();
    if (this.sceneChange) return;
    this.runKeyboardEvents();
    if (this.sceneChange) return;
    this.runObjectEvent(EV.STEP, 0);
    if (this.sceneChange) return;
    for (const i of this.instances) if (!i.destroyed) this.applyMotion(i);
    this.runObjectEvent(EV.STEP, 2);
    if (this.sceneChange) return;
    for (const s of this.particles.systems) if (s && s.auto) this.particles.update(s);
    this.purge();
    this.draw();
    if (this.snapWaiters.length) {
      const url = this.canvas.toDataURL("image/png");
      for (const w of this.snapWaiters.splice(0)) w(url);
    }
    for (let b = 0; b < 8; b++) {
      this.bgs.background_x[b] += this.bgs.background_hspeed[b];
      this.bgs.background_y[b] += this.bgs.background_vspeed[b];
    }
    for (const i of this.instances) {
      if (i.destroyed) continue;
      const n = i.image_number;
      let idx = i.image_index + i.image_speed;
      if (n > 0 && idx >= n) {
        idx -= n;
        i.image_index = idx;
        this.runEvent(i, EV.OTHER, 7, i);
      } else i.image_index = idx;
    }
    this.input.step();
    this.frameCount++;
  }

  applyMotion(i: Instance) {
    if (i.friction !== 0) {
      const sp = i.speed;
      if (sp >= 0) i.speed = i.friction > sp ? 0 : sp - i.friction;
      else i.speed = i.friction > -sp ? 0 : sp + i.friction;
    }
    if (i.gravity !== 0) {
      const d = (i.gravity_direction * Math.PI) / 180;
      i.setHV(i.hspeed + Math.cos(d) * i.gravity, i.vspeed - Math.sin(d) * i.gravity);
    }
    if (i.hspeed !== 0 || i.vspeed !== 0) { i.x += i.hspeed; i.y += i.vspeed; }
  }

  runAlarms() {
    if (!this.holders.has("2:0") && ![...this.holders.keys()].some((k) => k.startsWith("2:"))) return;
    for (const inst of this.instances.slice()) {
      for (let a = 0; a < 12; a++) {
        if (inst.alarm[a] > 0) {
          inst.alarm[a] = Math.round(inst.alarm[a]) - 1;
          if (inst.alarm[a] === 0) { inst.alarm[a] = -1; this.runEvent(inst, EV.ALARM, a, inst); }
        }
      }
    }
  }

  runKeyboardEvents() {
    for (const [key, holders] of this.holders) {
      const [t, s] = key.split(":").map(Number);
      if (t !== EV.KEYBOARD && t !== EV.KEYPRESS && t !== EV.KEYRELEASE) continue;
      const active = t === EV.KEYBOARD ? this.input.check(s) : t === EV.KEYPRESS ? this.input.pressed(s) : this.input.released(s);
      if (!active) continue;
      for (const obj of holders) for (const inst of this.byObject[obj].slice()) if (!inst.destroyed) this.runEvent(inst, t, s, inst);
    }
  }

  // ---------------------------------------------------------------- collision
  /** GM8 precise collision between two instances (OpenGMK's port of the runner algorithm). */
  collide(a: Instance, b: Instance): boolean {
    if (a === b) return false;
    const sa = a.maskSprite, sb = b.maskSprite;
    if (!sa || !sb) return false;
    a.updateBBox(); b.updateBBox();
    if (a._br < b._bl || b._br < a._bl || a._bb < b._bt || b._bb < a._bt) return false;
    const ma = sa.maskFor(a.image_index), mb = sb.maskFor(b.image_index);
    if (!ma || !mb) return false;
    const il = Math.max(a._bl, b._bl), ir = Math.min(a._br, b._br), it = Math.max(a._bt, b._bt), ib = Math.min(a._bb, b._bb);
    const ta = this.localTransform(a, sa), tb = this.localTransform(b, sb);
    for (let y = it; y <= ib; y++) {
      for (let x = il; x <= ir; x++) {
        if (ta(x, y, ma) && tb(x, y, mb)) return true;
      }
    }
    return false;
  }

  /** Point test against an instance's mask, in room coordinates. */
  localTransform(i: Instance, s: Sprite) {
    const ix = Math.round(i.x), iy = Math.round(i.y);
    const xs = i.image_xscale, ys = i.image_yscale;
    if (i.image_angle === 0) {
      return (x: number, y: number, m: any) => maskHit(m, Math.floor(s.ox + (x - ix) / xs), Math.floor(s.oy + (y - iy) / ys));
    }
    const a = (i.image_angle * Math.PI) / 180, sn = Math.sin(a), cs = Math.cos(a);
    return (x: number, y: number, m: any) => {
      const dx = x - ix, dy = y - iy;
      const rx = dx * cs - dy * sn, ry = dx * sn + dy * cs;
      return maskHit(m, Math.floor(s.ox + rx / xs), Math.floor(s.oy + ry / ys));
    };
  }

  collidePoint(i: Instance, x: number, y: number, precise: boolean): boolean {
    const s = i.maskSprite;
    if (!s) return false;
    i.updateBBox();
    if (i._br < x || x < i._bl || i._bb < y || y < i._bt) return false;
    if (!precise) return true;
    const m = s.maskFor(i.image_index);
    return !!m && this.localTransform(i, s)(Math.round(x), Math.round(y), m);
  }

  collideRect(i: Instance, x1: number, y1: number, x2: number, y2: number, precise: boolean): boolean {
    const s = i.maskSprite;
    if (!s) return false;
    i.updateBBox();
    const l = Math.round(Math.min(x1, x2)), t = Math.round(Math.min(y1, y2)), r = Math.round(Math.max(x1, x2)), b = Math.round(Math.max(y1, y2));
    if (i._br < l || r < i._bl || i._bb < t || b < i._bt) return false;
    if (!precise) return true;
    const m = s.maskFor(i.image_index);
    if (!m) return false;
    const tf = this.localTransform(i, s);
    for (let y = Math.max(t, i._bt); y <= Math.min(b, i._bb); y++)
      for (let x = Math.max(l, i._bl); x <= Math.min(r, i._br); x++) if (tf(x, y, m)) return true;
    return false;
  }

  collideCircle(i: Instance, cx: number, cy: number, rad: number, precise: boolean): boolean {
    if (!this.collideRect(i, cx - rad, cy - rad, cx + rad, cy + rad, false)) return false;
    const s = i.maskSprite!;
    const m = s.maskFor(i.image_index);
    const tf = this.localTransform(i, s);
    for (let y = Math.max(Math.round(cy - rad), i._bt); y <= Math.min(Math.round(cy + rad), i._bb); y++)
      for (let x = Math.max(Math.round(cx - rad), i._bl); x <= Math.min(Math.round(cx + rad), i._br); x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 > rad * rad) continue;
        if (!precise || (m && tf(x, y, m))) return true;
      }
    return false;
  }

  // ---------------------------------------------------------------- drawing
  draw() {
    const r = this.renderer;
    if (this.depthDirty || !this.tilesSorted) this.sortDrawList();
    const W = this.canvas.width, H = this.canvas.height;
    r.setTarget(null, W, H);
    if (this.viewsEnabled) {
      r.setView(0, 0, W, H, 0, 0, 0, W, H);
      r.clear(0);
      const V = this.views;
      for (let v = 0; v < 8; v++) {
        if (!V.view_visible[v]) continue;
        this.followView(v);
        this.viewCurrent = v;
        r.setView(V.view_xview[v], V.view_yview[v], V.view_wview[v] || 1, V.view_hview[v] || 1, V.view_angle[v],
          V.view_xport[v], V.view_yport[v], V.view_wport[v] || W, V.view_hport[v] || H);
        this.drawScene(V.view_xview[v], V.view_yview[v], V.view_wview[v], V.view_hview[v]);
      }
    } else {
      this.viewCurrent = 0;
      r.setView(0, 0, W, H, 0, 0, 0, W, H);
      this.drawScene(0, 0, W, H);
    }
    r.flush();
  }

  followView(v: number) {
    const V = this.views;
    const obj = V.view_object[v];
    if (obj < 0 || obj === undefined) return;
    const target = this.resolve(obj, null, null)[0];
    if (!target) return;
    const w = V.view_wview[v], h = V.view_hview[v];
    let x = V.view_xview[v], y = V.view_yview[v];
    const hb = Math.min(V.view_hborder[v], w / 2), vb = Math.min(V.view_vborder[v], h / 2);
    let nx = x, ny = y;
    if (target.x - hb < x) nx = target.x - hb;
    else if (target.x + hb > x + w) nx = target.x + hb - w;
    if (target.y - vb < y) ny = target.y - vb;
    else if (target.y + vb > y + h) ny = target.y + vb - h;
    nx = Math.max(0, Math.min(nx, this.roomWidth - w));
    ny = Math.max(0, Math.min(ny, this.roomHeight - h));
    const hs = V.view_hspeed[v], vs = V.view_vspeed[v];
    if (hs >= 0) nx = x + Math.max(-hs, Math.min(hs, nx - x));
    if (vs >= 0) ny = y + Math.max(-vs, Math.min(vs, ny - y));
    x = nx; y = ny;
    V.view_xview[v] = x; V.view_yview[v] = y;
  }

  sortDrawList() {
    const items: (Instance | Tile | PartSystem)[] = [];
    for (const i of this.instances) if (!i.destroyed) items.push(i);
    for (const t of this.tiles) items.push(t);
    for (const s of this.particles.systems) if (s) items.push(s);
    const depth = (x: any) => (x instanceof Instance ? x.depth : x.depth);
    items.sort((a, b) => depth(b) - depth(a));
    this.drawList = items;
    this.depthDirty = false;
    this.tilesSorted = true;
  }

  drawScene(vx: number, vy: number, vw: number, vh: number) {
    const r = this.renderer;
    if (this.bgShowColour) {
      r.setBlendMode(0);
      const c = this.bgColour;
      const col = [(c & 255) / 255, ((c >> 8) & 255) / 255, ((c >> 16) & 255) / 255, 1];
      r.rect(vx, vy, vx + vw, vy + vh, [col, col, col, col]);
    }
    this.drawBackgrounds(false, vx, vy, vw, vh);
    // Instances added mid-frame are drawn next frame, exactly like a depth-sorted GM8 list rebuilt per step.
    for (const item of this.drawList) {
      if (item instanceof Instance) {
        if (item.destroyed || !item.visible) continue;
        const fn = this.resolveEvent(item.object_index, "8:0");
        if (fn) {
          this.rt.eventStack.push({ obj: this.ownerOf(item.object_index, "8:0"), key: "8:0" });
          try { fn(item, item, []); } catch (e) { this.reportError(e, `${this.assets.objects[item.object_index]?.name} draw`); }
          this.rt.eventStack.pop();
          if (this.sceneChange && "end" in this.sceneChange) return;
        } else this.drawSelf(item);
      } else if ("parts" in item) {
        if (item.autoDraw) this.particles.draw(item);
      } else {
        if (!item.visible) continue;
        const t = item;
        if (t.x > vx + vw || t.y > vy + vh || t.x + t.w * t.xscale < vx || t.y + t.h * t.yscale < vy) continue;
        const bg = this.assets.backgrounds[t.bg];
        if (!bg?.frame) continue;
        r.setBlendMode(this.blendMode);
        r.drawFrame(bg.frame, t.left, t.top, t.w, t.h, t.x, t.y, 0, 0, t.xscale, t.yscale, 0, t.blend, t.alpha);
      }
    }
    this.drawBackgrounds(true, vx, vy, vw, vh);
  }

  drawSelf(i: Instance) {
    const s = i.sprite;
    if (!s || !s.frames.length) return;
    this.drawSprite(s, i.image_index, i.x, i.y, i.image_xscale, i.image_yscale, i.image_angle, i.image_blend, i.image_alpha);
  }

  drawSprite(s: Sprite, sub: number, x: number, y: number, xs: number, ys: number, angle: number, colour: number, alpha: number) {
    const n = s.frames.length;
    if (!n) return;
    const f = s.frames[((Math.floor(sub) % n) + n) % n];
    if (!f) return;
    this.renderer.drawFrame(f, 0, 0, f.w, f.h, x, y, -s.ox, -s.oy, xs, ys, angle, colour, alpha);
  }

  drawBackgrounds(foreground: boolean, vx: number, vy: number, vw: number, vh: number) {
    const B = this.bgs;
    for (let i = 0; i < 8; i++) {
      if (!B.background_visible[i] || !!B.background_foreground[i] !== foreground) continue;
      const bg = this.assets.backgrounds[B.background_index[i]];
      if (!bg?.frame) continue;
      const stretch = (B as any).stretch?.[i];
      const xs = stretch ? this.roomWidth / bg.w : B.background_xscale[i];
      const ys = stretch ? this.roomHeight / bg.h : B.background_yscale[i];
      this.drawTiledBackground(bg.frame, B.background_x[i], B.background_y[i], xs, ys, !!B.background_htiled[i], !!B.background_vtiled[i],
        B.background_blend[i], B.background_alpha[i], vx, vy, vw, vh);
    }
  }

  drawTiledBackground(f: Frame, x: number, y: number, xs: number, ys: number, ht: boolean, vt: boolean, col: number, alpha: number,
    vx: number, vy: number, vw: number, vh: number) {
    const w = f.w * xs, h = f.h * ys;
    if (w <= 0 || h <= 0) return;
    let x0 = x, y0 = y;
    if (ht) x0 = x - Math.ceil((x - vx) / w) * w;
    if (vt) y0 = y - Math.ceil((y - vy) / h) * h;
    this.renderer.setBlendMode(this.blendMode);
    for (let yy = y0; vt ? yy < vy + vh : yy === y0; yy += h) {
      for (let xx = x0; ht ? xx < vx + vw : xx === x0; xx += w) {
        this.renderer.drawFrame(f, 0, 0, f.w, f.h, xx, yy, 0, 0, xs, ys, 0, col, alpha);
      }
    }
  }

  // ---------------------------------------------------------------- main loop
  async start() {
    await this.gotoRoom(this.manifest.roomOrder[0]);
    let last = performance.now();
    let acc = 0;
    let fpsCount = 0, fpsTime = last;
    const loop = async () => {
      if (this.ended) return;
      const now = performance.now();
      acc += Math.min(now - last, 250);
      last = now;
      const stepMs = 1000 / Math.max(1, this.roomSpeed);
      const budget = now + 14;
      let steps = 0;
      while (acc >= stepMs && performance.now() < budget) {
        acc -= stepMs;
        this.step();
        steps++; fpsCount++;
        if (this.sceneChange) {
          const sc = this.sceneChange;
          this.sceneChange = null;
          if ("end" in sc) { this.ended = true; this.onStatus("Game ended"); return; }
          await this.gotoRoom(sc.room);
          acc = 0;
          last = performance.now();
          break;
        }
        if (this.roomSpeed <= 60 && steps >= 4) { acc = 0; break; }
      }
      if (now - fpsTime >= 1000) { this.fps = fpsCount; fpsCount = 0; fpsTime = now; }
      requestAnimationFrame(() => void loop());
    };
    requestAnimationFrame(() => void loop());
  }
}
