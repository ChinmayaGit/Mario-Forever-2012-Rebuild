// Helpers referenced by the generated code (see compiler/codegen.ts) and the built-in global variables `R`.
import type { Game } from "./game.ts";
import type { Instance } from "./instance.ts";

const A_STRIDE = 32000;

/** GM8 (Delphi) rounding: halves round to even. */
export function round(v: number): number {
  const f = Math.floor(v), d = v - f;
  if (d > 0.5) return f + 1;
  if (d < 0.5) return f;
  return f % 2 === 0 ? f : f + 1;
}

export function makeRt(game: Game) {
  const G = game.G;
  const holderOf = (target: number, s: Instance, o: Instance): any[] => {
    if (target === -5) return [G];
    return game.resolve(target, s, o);
  };

  const rt = {
    eventStack: [] as { obj: number; key: string }[],
    noop: () => 0,
    seq: (fns: ((s: any, o: any, a: any[]) => any)[]) => (s: any, o: any, a: any[]) => { for (const f of fns) f(s, o, a); return 0; },
    t: (v: any) => (typeof v === "number" ? v >= 0.5 : false),
    r: (v: any) => (typeof v === "number" ? round(v) : 0),
    fdiv: (a: number, b: number) => (b === 0 ? 0 : a / b),
    div: (a: number, b: number) => (b === 0 ? 0 : Math.trunc(a / b)),
    mod: (a: number, b: number) => (b === 0 ? 0 : a % b),
    // GM8 compares reals with a tolerance: 20 × 0.05 must equal 1 (the map-select fade relies on it).
    eq: (a: any, b: any) => (a === b || (typeof a === "number" && typeof b === "number" && Math.abs(a - b) < 1e-9) ? 1 : 0),
    sw: (v: any) => v,
    nop: () => {},
    get(target: number, key: string, s: Instance, o: Instance) {
      const h = holderOf(target, s, o)[0];
      return h ? h[key] ?? 0 : 0;
    },
    set(target: number, key: string, v: any, s: Instance, o: Instance) {
      for (const h of holderOf(target, s, o)) h[key] = v;
    },
    aget(h: any, key: string, i: number, j: number) {
      i = round(i); j = round(j);
      if (i === 0 && j === 0) return h[key] ?? 0;
      return h["@" + key]?.get(i * A_STRIDE + j) ?? 0;
    },
    aset(h: any, key: string, i: number, j: number, v: any) {
      i = round(i); j = round(j);
      if (i === 0 && j === 0) { h[key] = v; return; }
      let m = h["@" + key];
      if (!m) { m = new Map(); Object.defineProperty(h, "@" + key, { value: m, enumerable: false, writable: true }); }
      m.set(i * A_STRIDE + j, v);
    },
    agetT(target: number, key: string, i: number, j: number, s: Instance, o: Instance) {
      const h = holderOf(target, s, o)[0];
      return h ? rt.aget(h, key, i, j) : 0;
    },
    inst1(target: number, s: Instance, o: Instance) {
      return game.resolve(target, s, o)[0] ?? game.dummy;
    },
    targets(target: number, s: Instance, o: Instance): Instance[] {
      return game.resolve(target, s, o);
    },
  };

  const V = game.views, B = game.bgs;
  const R: any = {
    get room() { return game.room; },
    set room(v: number) { game.sceneChange = { room: round(v) }; },
    get room_first() { return game.manifest.roomOrder[0]; },
    get room_last() { return game.manifest.roomOrder[game.manifest.roomOrder.length - 1]; },
    get room_width() { return game.roomWidth; }, set room_width(v: number) { game.roomWidth = v; },
    get room_height() { return game.roomHeight; }, set room_height(v: number) { game.roomHeight = v; },
    get room_speed() { return game.roomSpeed; }, set room_speed(v: number) { game.roomSpeed = v; },
    get room_caption() { return game.roomCaption; }, set room_caption(v: string) { game.roomCaption = v; },
    get room_persistent() { return game.roomPersistent ? 1 : 0; }, set room_persistent(v: number) { game.roomPersistent = v >= 0.5; },
    get background_color() { return game.bgColour; }, set background_color(v: number) { game.bgColour = v; },
    get background_showcolor() { return game.bgShowColour ? 1 : 0; }, set background_showcolor(v: number) { game.bgShowColour = v >= 0.5; },
    get view_enabled() { return game.viewsEnabled ? 1 : 0; }, set view_enabled(v: number) { game.viewsEnabled = v >= 0.5; },
    get view_current() { return game.viewCurrent; }, set view_current(_v: number) {},
    get mouse_x() { return game.input.mouseX + (game.viewsEnabled ? V.view_xview[0] : 0); }, set mouse_x(_v: number) {},
    get mouse_y() { return game.input.mouseY + (game.viewsEnabled ? V.view_yview[0] : 0); }, set mouse_y(_v: number) {},
    mouse_button: 0, mouse_lastbutton: 0,
    get keyboard_key() { return [...game.input.down].pop() ?? 0; }, set keyboard_key(_v: number) {},
    get keyboard_lastkey() { return game.input.lastKey; }, set keyboard_lastkey(v: number) { game.input.lastKey = v; },
    keyboard_lastchar: "", keyboard_string: "",
    get current_time() { return Math.floor(performance.now()); }, set current_time(_v: number) {},
    get current_year() { return new Date().getFullYear(); }, get current_month() { return new Date().getMonth() + 1; },
    get current_day() { return new Date().getDate(); }, get current_hour() { return new Date().getHours(); },
    get current_minute() { return new Date().getMinutes(); }, get current_second() { return new Date().getSeconds(); },
    get current_weekday() { return new Date().getDay(); },
    get fps() { return game.fps; }, set fps(_v: number) {},
    game_id: 88888888, working_directory: ".", temp_directory: ".", program_directory: ".",
    get instance_count() { return game.instances.filter((i) => !i.destroyed).length; }, set instance_count(_v: number) {},
    score: 0, lives: 3, health: 100, show_score: 0, show_lives: 0, show_health: 0, caption_score: "", caption_lives: "",
    caption_health: "", transition_kind: 0, transition_steps: 80, transition_time: 0, cursor_sprite: -1, secure_mode: 0,
    error_occurred: 0, error_last: "", debug_mode: 0, event_type: 0, event_number: 0, event_object: 0, event_action: 0,
    get instance_id() { return game.instances.filter((i) => !i.destroyed).map((i) => i.id); },
  };
  for (const k of Object.keys(V)) Object.defineProperty(R, k, { get: () => V[k as keyof typeof V], set: () => {} });
  for (const k of Object.keys(B)) Object.defineProperty(R, k, { get: () => B[k as keyof typeof B], set: () => {} });
  game.R = R;
  return rt;
}
