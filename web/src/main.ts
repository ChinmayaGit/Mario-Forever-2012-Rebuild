import { Game } from "./runtime/game.ts";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const status = document.getElementById("status")!;
document.getElementById("fs")!.addEventListener("click", () => void canvas.requestFullscreen().catch(() => {}));

const game = new Game(canvas);
game.onStatus = (m) => { status.textContent = m; };
if (import.meta.env.DEV) {
  (window as any).game = game;
  void import("./debug.ts").then((m) => m.installDebug(game));
}

try {
  await game.load();
  status.textContent = "";
  canvas.focus();
  await game.start();
} catch (e) {
  status.textContent = `Failed to start: ${(e as Error).message}`;
  throw e;
}
