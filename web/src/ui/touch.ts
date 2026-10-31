// On-screen buttons for touch screens. Layout (position, size, opacity) is user-editable and saved in settings.
import type { Game } from "../runtime/game.ts";
import { h } from "./panel.ts";
import {
  DEFAULT_TOUCH_OPACITY, TOUCH_BUTTONS, inPauseZone, pulseKey, saveSettings, touchUiWanted, type Settings, type TouchKey,
} from "./settings.ts";

const BASE = 68;
const TAP = 14;
const ENTER = 13, ESC = 27;
/** Things Mario pulls out / picks up with the fire key, and the duel bonus that needs it. */
const GRAB_OBJECTS = ["o_point_brick_wyciagacz", "o_point_brick_alone2_blue", "o_wyciagacz"];
const GRAB_RANGE = 120;

export class TouchControls {
  root = h("div", { id: "touch", hidden: true });
  /** Called after every layout so other touch-only UI (MAP / ITEMS) can follow. */
  onLayout: () => void = () => {};
  /** Menus and the world map: the JUMP button becomes SELECT (Enter) and FIRE is hidden. */
  private menu = false;
  private buttons = new Map<TouchKey, HTMLElement>();
  private editing = false;
  private bar: HTMLElement | null = null;
  private active = false;
  /** FIRE only shows when Mario can use it (power-up, something to grab or carry). */
  private fireOn = false;
  private ids: { mario: number; duel: number; grab: Set<number> } | null = null;

  constructor(private game: Game, private settings: Settings) {
    for (const def of TOUCH_BUTTONS) {
      const el = h("div", { class: "tbtn" + (def.small ? " small" : ""), "data-id": def.id }, def.label);
      this.buttons.set(def.id, el);
      this.root.append(el);
      this.bind(el, def.id);
    }
    document.body.append(this.root);
    this.bindScreenTaps();
    this.layout();
    addEventListener("resize", () => this.layout());
    setInterval(() => {
      if (this.root.hidden) return;
      const on = this.fireNeeded();
      if (on === this.fireOn) return;
      this.fireOn = on;
      if (!on) this.game.input.release("touch:fire");
      this.layout();
    }, 200);
  }

  private objectIds() {
    if (this.ids) return this.ids;
    const objs = this.game.assets?.objects;
    if (!objs?.length) return null;
    const find = (n: string) => objs.findIndex((o) => o?.name === n);
    const roots = new Set(GRAB_OBJECTS.map(find).filter((i) => i >= 0));
    // Children of a grabbable object are grabbable too (place_meeting matches parents).
    const grab = new Set<number>();
    objs.forEach((_, i) => {
      for (let p = i, n = 0; p >= 0 && n < 32; p = objs[p]?.parent ?? -1, n++) if (roots.has(p)) { grab.add(i); break; }
    });
    this.ids = { mario: find("obj_mario"), duel: find("o_duel_ball_life"), grab };
    return this.ids;
  }

  private fireNeeded() {
    const ids = this.objectIds();
    if (!ids) return false;
    const g = this.game;
    if (Number((g.G as Record<string, unknown>).$rodzaj_mario) >= 2) return true;
    if (g.byObject[ids.duel]?.some((i) => !i.destroyed)) return true;
    for (const m of g.byObject[ids.mario] ?? []) {
      if (m.destroyed) continue;
      if ((m as unknown as Record<string, unknown>).$nosi_wyrwane === 1) return true;
      for (const o of ids.grab) {
        for (const b of g.byObject[o] ?? []) {
          if (!b.destroyed && Math.abs(b.x - m.x) < GRAB_RANGE && Math.abs(b.y - m.y) < GRAB_RANGE) return true;
        }
      }
    }
    return false;
  }

  get visible() { return touchUiWanted(this.settings); }

  setMenu(menu: boolean) {
    if (this.menu === menu) return;
    this.menu = menu;
    this.game.input.release("touch:jump");
    this.game.input.release("touch:fire");
    this.layout();
  }

  private pos(id: TouchKey) {
    return this.settings.touch.pos[id] ?? TOUCH_BUTTONS.find((b) => b.id === id)!;
  }

  layout() {
    const t = this.settings.touch;
    const want = touchUiWanted(this.settings);
    const buttons = t.scheme === "buttons" || this.editing;
    this.active = want && t.scheme === "buttons" && !this.editing;
    const menu = this.menu && !this.editing;
    // Positions are relative to the window, so sizes follow its short side to keep the default layout from overlapping.
    const k = t.scale * Math.min(1.2, Math.max(0.6, Math.min(innerWidth, innerHeight) / 480));
    const size = BASE * k;
    for (const def of TOUCH_BUTTONS) {
      const el = this.buttons.get(def.id)!, p = this.pos(def.id);
      const label = def.id === "jump" && menu ? "SELECT" : def.label;
      el.textContent = label;
      const w = def.small ? size * 1.3 : size, hgt = def.small ? size * 0.55 : size;
      const text = label.length > 4 ? 11 : label.length > 1 ? 13 : 24;
      el.hidden = !buttons || (def.id === "fire" && !this.editing && (menu || !this.fireOn));
      Object.assign(el.style, {
        left: `${p.x * 100}%`, top: `${p.y * 100}%`, width: `${w}px`, height: `${hgt}px`,
        fontSize: `${(def.small ? 11 : text) * k}px`, opacity: String(t.opacity),
      });
    }
    this.root.hidden = !this.editing && !want;
    this.onLayout();
  }

  /** Taps on the game itself: top-centre pauses; in menus any other tap also confirms. */
  private bindScreenTaps() {
    const canvas = this.game.canvas;
    const downs = new Map<number, { x: number; y: number; moved: boolean }>();
    canvas.addEventListener("pointerdown", (e) => {
      if (this.active && e.pointerType !== "mouse") downs.set(e.pointerId, { x: e.clientX, y: e.clientY, moved: false });
    });
    canvas.addEventListener("pointermove", (e) => {
      const d = downs.get(e.pointerId);
      if (d && (Math.abs(e.clientX - d.x) > TAP || Math.abs(e.clientY - d.y) > TAP)) d.moved = true;
    });
    canvas.addEventListener("pointerup", (e) => {
      const d = downs.get(e.pointerId);
      downs.delete(e.pointerId);
      if (!d || d.moved || !this.active || !this.game.input.enabled) return;
      const key = inPauseZone(d.x, d.y) ? ESC : this.menu ? ENTER : 0;
      if (key) pulseKey(this.game.input, `touch:tap:${e.pointerId}`, key);
    });
    canvas.addEventListener("pointercancel", (e) => downs.delete(e.pointerId));
  }

  private bind(el: HTMLElement, id: TouchKey) {
    const source = `touch:${id}`;
    let drag: { dx: number; dy: number } | null = null;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
      if (this.editing) {
        const r = el.getBoundingClientRect();
        drag = { dx: e.clientX - (r.left + r.width / 2), dy: e.clientY - (r.top + r.height / 2) };
        return;
      }
      el.classList.add("held");
      if (id === "jump" && this.menu) this.game.input.press(source, ENTER);
      else this.game.input.pressAction(source, id);
    });
    el.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const x = Math.min(0.98, Math.max(0.02, (e.clientX - drag.dx) / innerWidth));
      const y = Math.min(0.98, Math.max(0.02, (e.clientY - drag.dy) / innerHeight));
      this.settings.touch.pos[id] = { x, y };
      el.style.left = `${x * 100}%`;
      el.style.top = `${y * 100}%`;
    });
    const up = () => {
      if (drag) { drag = null; return; }
      el.classList.remove("held");
      this.game.input.release(source);
    };
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  /** Drag buttons around; the bar at the top sets size and opacity. */
  edit(onDone: () => void) {
    this.editing = true;
    this.root.classList.add("editing");
    this.game.input.releaseAll();
    this.game.input.enabled = false;
    const t = this.settings.touch;
    const slider = (min: number, max: number, step: number, value: number, set: (v: number) => void) =>
      h("input", { type: "range", min, max, step, value, oninput: (e: Event) => { set(+(e.target as HTMLInputElement).value); this.layout(); } });
    const done = () => {
      this.editing = false;
      this.root.classList.remove("editing");
      this.bar?.remove();
      this.bar = null;
      this.game.input.enabled = true;
      saveSettings(this.settings);
      this.layout();
      onDone();
    };
    this.bar = h("div", { class: "edit-bar" },
      h("span", { class: "muted" }, "Drag buttons to move them"),
      h("label", { class: "row" }, "Size", slider(0.5, 2, 0.05, t.scale, (v) => (t.scale = v))),
      h("label", { class: "row" }, "Opacity", slider(0.2, 1, 0.05, t.opacity, (v) => (t.opacity = v))),
      h("button", { class: "btn", onclick: () => { t.pos = {}; t.scale = 1; t.opacity = DEFAULT_TOUCH_OPACITY; this.layout(); } }, "Reset"),
      h("button", { class: "btn accent", onclick: done }, "Done"));
    document.body.append(this.bar);
    this.layout();
  }
}
