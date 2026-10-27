// Keyboard/mouse state using Windows virtual-key codes, which is what GM8 code expects.

const CODE_TO_VK: Record<string, number> = {
  ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Enter: 13, NumpadEnter: 13, Space: 32, Escape: 27,
  Tab: 9, Backspace: 8, ShiftLeft: 16, ShiftRight: 16, ControlLeft: 17, ControlRight: 17, AltLeft: 18, AltRight: 18,
  Delete: 46, Insert: 45, Home: 36, End: 35, PageUp: 33, PageDown: 34,
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

  constructor(canvas: HTMLCanvasElement) {
    const vk = (e: KeyboardEvent) => CODE_TO_VK[e.code] ?? (e.keyCode || 0);
    addEventListener("keydown", (e) => {
      const k = vk(e);
      if (!k) return;
      if (k >= 33 && k <= 40 || k === 32 || k === 9 || k === 8) e.preventDefault();
      if (!this.down.has(k)) this.pressedSet.add(k);
      this.down.add(k);
      this.lastKey = k;
    });
    addEventListener("keyup", (e) => {
      const k = vk(e);
      if (this.pressedSet.has(k)) this.lateKeyUp.add(k);
      else this.down.delete(k);
      this.releasedSet.add(k);
    });
    addEventListener("blur", () => this.down.clear());
    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      this.mouseX = ((e.clientX - r.left) / r.width) * canvas.width;
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
