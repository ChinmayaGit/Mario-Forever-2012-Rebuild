import "./ui/style.css";
import { Game } from "./runtime/game.ts";
import type { Action } from "./runtime/input.ts";
import { Loading } from "./ui/loading.ts";
import { Multiplayer } from "./ui/multiplayer.ts";
import { h, isPanelOpen } from "./ui/panel.ts";
import { downloadSave, openCredits, openLoad, openSettings, toggleFullscreen } from "./ui/panels.ts";
import { applyGraphics } from "./ui/graphics.ts";
import { GestureControls } from "./ui/gestures.ts";
import { activeGraphicsTier, isMobileProfile, loadSettings, MENU_ROOM, pulseKey as pulse } from "./ui/settings.ts";
import { TouchControls } from "./ui/touch.ts";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const loading = new Loading();
const settings = loadSettings();

const game = new Game(canvas);
game.input.bindings = settings.keys;
game.input.actionVk = (a: Action) => Number((game.G as Record<string, unknown>)[`$ster_${a}`]) || 0;
game.onStatus = (m) => loading.set("boot", !/^Game ended/.test(m), m);
game.onBusy = (busy) => loading.set("room", busy, "Loading", true);
// Desktop vs mobile graphics are independent; deviceMode can override a bad auto-detect.
applyGraphics(game, activeGraphicsTier(settings), isMobileProfile(settings));
if (import.meta.env.DEV) {
  (window as any).game = game;
  void import("./debug.ts").then((m) => m.installDebug(game));
}

// Fill the window: wider than 4:3 shows more of the level on both sides (desktop and phones in landscape).
const fit = () => {
  const vw = innerWidth, vh = innerHeight;
  game.setAspect(vw / vh);
  const a = canvas.width / canvas.height;
  const w = Math.min(vw, vh * a);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${w / a}px`;
};
addEventListener("resize", fit);
screen.orientation?.addEventListener("change", fit);
fit();

/** Hold a virtual key for a short pulse (map HUD uses keys 1 / 2 for ITEMS / MAPS). */
const pulseKey = (vk: number) => pulse(game.input, `ui:pulse:${vk}`, vk);

const touch = new TouchControls(game, settings);
const gestures = new GestureControls(game, settings);
const saveBtn = h("button", { class: "hud-btn primary", title: "Download your progress", hidden: true, onclick: downloadSave }, "💾 Save");
const fsBtn = h("button", { class: "hud-btn", title: "Fullscreen (F11)", onclick: toggleFullscreen }, "⛶");
const hud = h("div", { id: "hud" },
  saveBtn,
  h("button", { class: "hud-btn", title: "Settings", onclick: () => openSettings(game, settings, touch, gestures) }, "⚙"),
  fsBtn);
document.body.append(hud);
document.addEventListener("fullscreenchange", () => { fsBtn.textContent = document.fullscreenElement ? "🗗" : "⛶"; });

// World map: original game opens ITEMS with key "1" and MAPS with key "2" — expose big touch targets over those corners.
const mapItemsBtn = h("button", {
  class: "map-hot map-hot-items", type: "button", hidden: true, "aria-label": "Items",
  onpointerdown: (e: PointerEvent) => { e.preventDefault(); pulseKey(49); },
}, "ITEMS");
const mapMapsBtn = h("button", {
  class: "map-hot map-hot-maps", type: "button", hidden: true, "aria-label": "Maps",
  onpointerdown: (e: PointerEvent) => { e.preventDefault(); pulseKey(50); },
}, "MAPS");
document.body.append(mapItemsBtn, mapMapsBtn);
// MAP / ITEMS are touch-only: keyboard players press 1 / 2.
let onMap = false;
const syncMapButtons = () => {
  const show = onMap && touch.visible;
  mapItemsBtn.hidden = !show;
  mapMapsBtn.hidden = !show;
};
touch.onLayout = syncMapButtons;

loading.set("boot", true, "Loading");
try {
  await game.load();
  const multiplayer = new Multiplayer(game, hud);
  if (import.meta.env.DEV) (window as any).multiplayer = multiplayer;
  game.onMenu = (kind) => {
    if (isPanelOpen()) return;
    if (kind === "credits") openCredits(game);
    else if (kind === "load") openLoad(game);
    else if (kind === "multiplayer") multiplayer.open();
  };
  // The boot rooms only load sounds and settings; keep the loading screen up until the title menu appears.
  game.onRoom = (name) => {
    loading.set("boot", name.startsWith("room_initialize") || name === "debug_mode_for_development" || name === "initialize_maps_values" || name === "game_initialize", "Loading");
    onMap = name.startsWith("room_map_");
    saveBtn.hidden = !onMap;
    const menu = MENU_ROOM.test(name);
    touch.setMenu(menu);
    gestures.setMenu(menu);
    syncMapButtons();
  };
  canvas.focus();
  await game.start();
} catch (e) {
  loading.set("boot", true, `Failed to start: ${(e as Error).message}`);
  throw e;
}
