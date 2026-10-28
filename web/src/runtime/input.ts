// Keyboard/mouse state using Windows virtual-key codes, which is what GM8 code expects.

const CODE_TO_VK: Record<string, number> = {
  ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Enter: 13, NumpadEnter: 13, Space: 32, Escape: 27,
  Tab: 9, Backspace: 8, ShiftLeft: 16, ShiftRight: 16, ControlLeft: 17, ControlRight: 17, AltLeft: 18, AltRight: 18,
  Delete: 46, Insert: 45, Home: 36, End: 35, PageUp: 33, PageDown: 34,
};

export const ACTIONS = ["up", "down", "left", "right", "jump", "fire"] as const;
export type Action = (typeof ACTIONS)[number];
export type Bindings = Record<Action, string[]>;

export const DEFAULT_BINDINGS: Bindings = {
  up: ["ArrowUp", "KeyW"], down: ["ArrowDown", "KeyS"], left: ["ArrowLeft", "KeyA"], right: ["ArrowRight", "KeyD"],
  jump: ["Space"], fire: ["KeyQ"],
};

export class Input {
  down = new Set<number>();
  pressedSet = new Set<number>();
  releasedSet = new Set<number>();
  lastKey = 0;
  mouseX = 0; mouseY = 0;
  mouseDown = new Set<number>();
  mousePressed = new Set<number>();
  /** Keys/buttons released in the same frame they were pressed stay down until that frame ends. */
  lateKeyUp = new Set<number>();
  lateMouseUp = new Set<number>();
  /** Physical key codes per game action; the game sees whatever key it has configured for that action. */
  bindings: Bindings = structuredClone(DEFAULT_BINDINGS);
  /** The virtual key the game currently uses for an action (global.ster_*). */
  actionVk: (a: Action) => number = () => 0;
  /** Canvas pixels left of the game's 800-wide window on wide screens. */
  marginX = 0;
  /** False while an HTML overlay owns the keyboard. */
  enabled = true;
  /** Which virtual key each held source (a key code or a touch button) is holding. */
  private held = new Map<string, number>();

  constructor(canvas: HTMLCanvasElement) {
    addEventListener("keydown", (e) => {
      if (!this.enabled || e.repeat) return;
      const k = this.translate(e);
      if (!k) return;
      if (k >= 33 && k <= 40 || k === 32 || k === 9 || k === 8 || this.actionOf(e.code)) e.preventDefault();
      this.press(e.code, k);
    });
    addEventListener("keyup", (e) => this.release(e.code));
    addEventListener("blur", () => this.releaseAll());
    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      this.mouseX = ((e.clientX - r.left) / r.width) * canvas.width - this.marginX;
      this.mouseY = ((e.clientY - r.top) / r.height) * canvas.height;
    };
    canvas.addEventListener("pointermove", pos);
    canvas.addEventListener("pointerdown", (e) => { pos(e); const b = e.button === 2 ? 2 : e.button === 1 ? 3 : 1; this.mouseDown.add(b); this.mousePressed.add(b); });
    addEventListener("pointerup", (e) => {
      const b = e.button === 2 ? 2 : e.button === 1 ? 3 : 1;
      if (this.mousePressed.has(b)) this.lateMouseUp.add(b);
      else this.mouseDown.delete(b);
    });
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  actionOf(code: string): Action | undefined {
    return ACTIONS.find((a) => this.bindings[a].includes(code));
  }

  /** Bound keys become the game's key for that action; an unbound key that the game uses for an action is ignored. */
  private translate(e: KeyboardEvent): number {
    const a = this.actionOf(e.code);
    if (a) return this.actionVk(a);
    const k = CODE_TO_VK[e.code] ?? (e.keyCode || 0);
    return ACTIONS.some((x) => this.actionVk(x) === k) ? 0 : k;
  }

  press(source: string, k: number) {
    if (this.held.get(source) === k) return;
    this.held.set(source, k);
    if (!this.down.has(k)) this.pressedSet.add(k);
    this.down.add(k);
    this.lastKey = k;
  }

  release(source: string) {
    const k = this.held.get(source);
    if (k === undefined) return;
    this.held.delete(source);
    for (const v of this.held.values()) if (v === k) return;
    if (this.pressedSet.has(k)) this.lateKeyUp.add(k);
    else this.down.delete(k);
    this.releasedSet.add(k);
  }

  /** Touch buttons hold an action by name. */
  pressAction(source: string, a: Action) { const k = this.actionVk(a); if (k) this.press(source, k); }

  releaseAll() { for (const s of [...this.held.keys()]) this.release(s); }

  check(k: number) {
    if (k === 1) return this.down.size > 0;
    if (k === 0) return this.down.size === 0;
    return this.down.has(k);
  }
  pressed(k: number) { return k === 1 ? this.pressedSet.size > 0 : this.pressedSet.has(k); }
  released(k: number) { return k === 1 ? this.releasedSet.size > 0 : this.releasedSet.has(k); }
  step() {
    for (const k of this.lateKeyUp) this.down.delete(k);
    for (const b of this.lateMouseUp) this.mouseDown.delete(b);
    this.lateKeyUp.clear(); this.lateMouseUp.clear();
    this.pressedSet.clear(); this.releasedSet.clear(); this.mousePressed.clear();
  }
}
