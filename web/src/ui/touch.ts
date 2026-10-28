// On-screen buttons for touch screens. Layout (position, size, opacity) is user-editable and saved in settings.
import type { Game } from "../runtime/game.ts";
import { h } from "./panel.ts";
import { TOUCH_BUTTONS, isTouchDevice, saveSettings, type Settings, type TouchKey } from "./settings.ts";

const BASE = 68;
const VK: Partial<Record<TouchKey, number>> = { start: 13, pause: 27 };

export class TouchControls {
  root = h("div", { id: "touch", hidden: true });
  private buttons = new Map<TouchKey, HTMLElement>();
  private editing = false;
  private bar: HTMLElement | null = null;

  constructor(private game: Game, private settings: Settings) {
    for (const def of TOUCH_BUTTONS) {
      const el = h("div", { class: "tbtn" + (def.small ? " small" : ""), "data-id": def.id }, def.label);
      this.buttons.set(def.id, el);
      this.root.append(el);
      this.bind(el, def.id);
    }
    document.body.append(this.root);
    this.layout();
    addEventListener("resize", () => this.layout());
  }

  private pos(id: TouchKey) {
    return this.settings.touch.pos[id] ?? TOUCH_BUTTONS.find((b) => b.id === id)!;
  }

  layout() {
    const t = this.settings.touch;
    // Positions are relative to the window, so sizes follow its short side to keep the default layout from overlapping.
    const k = t.scale * Math.min(1.2, Math.max(0.6, Math.min(innerWidth, innerHeight) / 480));
    const size = BASE * k;
    for (const def of TOUCH_BUTTONS) {
      const el = this.buttons.get(def.id)!, p = this.pos(def.id);
      const w = def.small ? size * 1.3 : size, hgt = def.small ? size * 0.55 : size;
      const text = def.label.length > 1 ? 13 : 24;
      Object.assign(el.style, {
        left: `${p.x * 100}%`, top: `${p.y * 100}%`, width: `${w}px`, height: `${hgt}px`,
        fontSize: `${(def.small ? 11 : text) * k}px`, opacity: String(t.opacity),
      });
    }
    this.root.hidden = !this.editing && !(t.mode === "on" || (t.mode === "auto" && isTouchDevice()));
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
      const vk = VK[id];
      if (vk) this.game.input.press(source, vk);
      else this.game.input.pressAction(source, id as Exclude<TouchKey, "start" | "pause">);
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
      h("button", { class: "btn", onclick: () => { t.pos = {}; t.scale = 1; t.opacity = 0.8; this.layout(); } }, "Reset"),
      h("button", { class: "btn accent", onclick: done }, "Done"));
    document.body.append(this.bar);
    this.layout();
  }
}
