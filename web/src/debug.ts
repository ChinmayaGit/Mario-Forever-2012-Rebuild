// Dev-only console helpers for driving the game from DevTools.
import type { Game } from "./runtime/game.ts";

export function installDebug(game: Game) {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const inp = game.input;
  const api = {
    sleep,
    state: () => JSON.stringify({
      room: game.room, name: game.manifest.rooms[game.room]?.name, frames: game.frameCount, fps: game.fps,
      n: game.instances.length, log: game.log.slice(-20),
    }),
    find: (name: string) => game.instances.filter((i) => !i.destroyed && game.assets.objects[i.object_index]?.name === name),
    mario: () => api.find("obj_mario")[0],
    roomIndex: (name: string) => game.manifest.rooms.findIndex((r) => r?.name === name),
    goto: (name: string) => { game.sceneChange = { room: api.roomIndex(name) }; },
    async press(k: number, ms = 150) {
      inp.down.add(k); inp.pressedSet.add(k);
      await sleep(ms);
      inp.down.delete(k); inp.releasedSet.add(k);
      await sleep(100);
    },
    async hold(k: number, until: () => boolean, max = 8000) {
      inp.down.add(k); inp.pressedSet.add(k);
      const t0 = performance.now();
      while (!until() && performance.now() - t0 < max) await sleep(10);
      inp.down.delete(k); inp.releasedSet.add(k);
    },
    async click(x: number, y: number) {
      inp.mouseX = x; inp.mouseY = y;
      await sleep(500);
      inp.mouseDown.add(1); inp.mousePressed.add(1);
      await sleep(300);
      inp.mouseDown.delete(1);
    },
    async until(f: () => boolean, max = 30000) {
      const t0 = performance.now();
      while (!f() && performance.now() - t0 < max) await sleep(100);
      return f();
    },
    /** Language screen -> title -> save slot 2 pipe. */
    async newGame() {
      await api.until(() => game.room === api.roomIndex("room_wybierz_jezyk") && game.frameCount > 60);
      for (let k = 0; k < 5 && api.name() === "room_wybierz_jezyk"; k++) {
        const f = api.find("o_plansza_flagi")[0];
        await api.until(() => f.$timer > 45 && f.$timer < 350, 10000);
        await api.click(300, 280);
        await sleep(3000);
      }
      await api.until(() => api.name() === "room_TV_JOY");
      await sleep(2000);
      await api.press(13, 300);
      await api.until(() => api.name() === "room_title_screen_and_options", 60000);
      await sleep(3000);
      await api.press(13, 300); await sleep(2000); await api.press(13, 300);
      await api.until(() => api.name() === "save_game_room", 15000);
      await sleep(3000);
      const m = api.mario(); m.x = 1628; m.y = 1150;
      await sleep(800);
      await api.press(40, 2000);
      await api.until(() => api.name() !== "save_game_room", 10000);
      return api.state();
    },
    name: () => game.manifest.rooms[game.room]?.name,
  };
  (window as any).dbg = api;
}
