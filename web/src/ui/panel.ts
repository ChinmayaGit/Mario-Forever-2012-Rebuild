// Modal panels drawn over the game. While one is open the game receives no keyboard input.
import type { Game } from "../runtime/game.ts";

let open: Panel | null = null;

export interface Panel {
  root: HTMLElement; body: HTMLElement; close: () => void;
  /** Sees key presses first; return true to swallow the key. */
  onKey?: (e: KeyboardEvent) => boolean;
}

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Record<string, any> = {}, ...kids: (Node | string | null | false)[]) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "class") el.className = v;
    else if (v === true) el.setAttribute(k, "");
    else if (v !== false && v != null) el.setAttribute(k, String(v));
  }
  for (const c of kids) if (c) el.append(c);
  return el;
}

export function openPanel(game: Game, title: string, opts: { onClose?: () => void; closable?: boolean } = {}): Panel {
  open?.close();
  const body = h("div", { class: "body" });
  const closeBtn = opts.closable === false ? null : h("button", { class: "close", title: "Close", "aria-label": "Close" }, "×");
  const panel = h("div", { class: "panel", role: "dialog", "aria-label": title }, h("header", {}, h("h2", {}, title), closeBtn), body);
  const root = h("div", { class: "backdrop" }, panel);
  const onKey = (e: KeyboardEvent) => {
    if (p.onKey?.(e)) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (e.key === "Escape" && opts.closable !== false) { e.stopImmediatePropagation(); p.close(); }
  };
  const p: Panel = {
    root, body,
    close() {
      if (open !== p) return;
      open = null;
      root.remove();
      removeEventListener("keydown", onKey, true);
      game.input.enabled = true;
      opts.onClose?.();
      game.canvas.focus();
    },
  };
  closeBtn?.addEventListener("click", () => p.close());
  if (opts.closable !== false) root.addEventListener("pointerdown", (e) => { if (e.target === root) p.close(); });
  // Registered on window in the capture phase so it runs before the game's own window listener.
  addEventListener("keydown", onKey, true);
  game.input.releaseAll();
  game.input.enabled = false;
  document.body.append(root);
  open = p;
  return p;
}

export function isPanelOpen() { return open !== null; }

export function toast(text: string) {
  const t = h("div", { class: "toast", role: "status" }, text);
  document.body.append(t);
  setTimeout(() => t.remove(), 2700);
}
