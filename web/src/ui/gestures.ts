// Full-screen swipe / tap controls for phones.
// Left half: drag to hold left/right (and up/down). Right half: swipe up = jump, tap = fire.
import type { Game } from "../runtime/game.ts";
import type { Action } from "../runtime/input.ts";
import { h } from "./panel.ts";
import { inPauseZone, pulseKey, touchUiWanted, type Settings } from "./settings.ts";

const DEAD = 18;
const SWIPE = 28;
const TAP = 14;

type Side = "left" | "right";
interface Track {
  side: Side;
  x0: number; y0: number;
  moved: boolean;
  jump: boolean;
}

export class GestureControls {
  root = h("div", { id: "gestures", hidden: true });
  private left = h("div", { class: "gz gz-left", "data-side": "left" });
  private right = h("div", { class: "gz gz-right", "data-side": "right" });
  private tracks = new Map<number, Track>();
  private held = new Set<Action>();
  /** Menus and the world map: every tap is Select (Enter). */
  private menu = false;

  setMenu(menu: boolean) { this.menu = menu; }

  constructor(private game: Game, private settings: Settings) {
    this.root.append(this.left, this.right);
    document.body.append(this.root);
    for (const zone of [this.left, this.right]) {
      zone.addEventListener("pointerdown", (e) => this.down(e, zone.dataset.side as Side));
      zone.addEventListener("pointermove", (e) => this.move(e));
      zone.addEventListener("pointerup", (e) => this.up(e));
      zone.addEventListener("pointercancel", (e) => this.up(e));
      zone.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    this.layout();
  }

  layout() {
    const t = this.settings.touch;
    this.root.hidden = !touchUiWanted(this.settings) || t.scheme !== "swipe";
    if (this.root.hidden) this.clearAll();
  }

  private src(a: Action) { return `gesture:${a}`; }

  private setAction(a: Action, on: boolean) {
    if (on) {
      if (this.held.has(a)) return;
      this.held.add(a);
      this.game.input.pressAction(this.src(a), a);
    } else if (this.held.has(a)) {
      this.held.delete(a);
      this.game.input.release(this.src(a));
    }
  }

  private clearDir() {
    for (const a of ["left", "right", "up", "down"] as Action[]) this.setAction(a, false);
  }

  private clearAll() {
    for (const a of [...this.held]) this.setAction(a, false);
    this.tracks.clear();
  }

  private down(e: PointerEvent, side: Side) {
    if (this.root.hidden || !this.game.input.enabled) return;
    e.preventDefault();
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* */ }
    this.tracks.set(e.pointerId, { side, x0: e.clientX, y0: e.clientY, moved: false, jump: false });
  }

  private move(e: PointerEvent) {
    const t = this.tracks.get(e.pointerId);
    if (!t) return;
    const dx = e.clientX - t.x0, dy = e.clientY - t.y0;
    if (Math.abs(dx) > TAP || Math.abs(dy) > TAP) t.moved = true;

    if (t.side === "left") {
      // Hold left/right while the finger stays past the dead zone; same for up/down.
      this.setAction("left", dx < -DEAD);
      this.setAction("right", dx > DEAD);
      this.setAction("up", dy < -DEAD);
      this.setAction("down", dy > DEAD);
    } else if (!t.jump && dy < -SWIPE) {
      t.jump = true;
      this.setAction("jump", true);
    }
  }

  private up(e: PointerEvent) {
    const t = this.tracks.get(e.pointerId);
    if (!t) return;
    this.tracks.delete(e.pointerId);

    const pause = inPauseZone(t.x0, t.y0);
    if (!t.moved && !t.jump && (pause || this.menu)) {
      // Top-centre tap pauses; in menus any other tap is Select (no PAUSE / START buttons).
      if (t.side === "left" && ![...this.tracks.values()].some((x) => x.side === "left")) this.clearDir();
      pulseKey(this.game.input, `gesture:tap:${e.pointerId}`, pause ? 27 : 13);
      return;
    }
    if (t.side === "left") {
      // Drop move keys from this finger; other left fingers may still be active.
      if (![...this.tracks.values()].some((x) => x.side === "left")) this.clearDir();
    } else {
      if (t.jump) this.setAction("jump", false);
      else if (!t.moved) {
        // Tap on the right = fire (short pulse).
        this.game.input.pressAction("gesture:fire", "fire");
        setTimeout(() => this.game.input.release("gesture:fire"), 100);
      } else if (t.moved && !t.jump) {
        // Swipe that wasn't up enough — ignore.
      }
    }
  }
}
