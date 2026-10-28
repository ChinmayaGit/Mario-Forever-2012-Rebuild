// Black loading screen with a jumping Mario in the bottom-right corner.

export class Loading {
  el = document.createElement("div");
  private label = document.createElement("div");
  private reasons = new Set<string>();

  constructor() {
    this.el.id = "loading";
    this.label.className = "label";
    this.label.textContent = "Loading";
    const runner = document.createElement("div");
    runner.className = "runner";
    const mario = document.createElement("div");
    mario.className = "mario";
    mario.style.backgroundImage = "url(assets/sprites/s_map_head_mario/0.png)";
    const shadow = document.createElement("div");
    shadow.className = "shadow";
    runner.append(shadow, mario);
    this.el.append(this.label, runner);
    document.body.append(this.el);
  }

  /** The screen stays up while any reason is active. A soft screen lets the game show through slightly. */
  set(reason: string, on: boolean, text = "Loading", soft = false) {
    if (on) this.reasons.add(reason);
    else this.reasons.delete(reason);
    if (on) this.label.textContent = text;
    this.el.classList.toggle("soft", soft && this.reasons.size === 1);
    this.el.classList.toggle("hidden", this.reasons.size === 0);
  }
}
