import type { Game } from "../runtime/game.ts";
import { ACTIONS, DEFAULT_BINDINGS, type Action } from "../runtime/input.ts";
import { exportSaves, importSaves } from "../runtime/vfs.ts";
import { h, openPanel, toast } from "./panel.ts";
import { applyGraphics, GRAPHICS_TIERS, type GraphicsTier } from "./graphics.ts";
import {
  activeGraphicsTier, detectMobileDevice, isMobileProfile, keyLabel, saveSettings,
  type DeviceMode, type Settings, type TouchScheme,
} from "./settings.ts";
import type { GestureControls } from "./gestures.ts";
import type { TouchControls } from "./touch.ts";

const ACTION_NAMES: Record<Action, string> = { up: "Up / Enter pipe", down: "Down / Crouch", left: "Left", right: "Right", jump: "Jump", fire: "Fire / Run" };

export const LOAD_INFO =
  "If you are playing on a different device or browser to get your old progress go to map section where you played last time above you will find save and you can load here";

export function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.().catch(() => toast("Fullscreen is not available here."));
}

export function openSettings(game: Game, settings: Settings, touch: TouchControls, gestures?: GestureControls) {
  const p = openPanel(game, "Settings");
  let listening: { action: Action; slot: number; el: HTMLElement } | null = null;
  const refreshTouch = () => { touch.layout(); gestures?.layout(); };
  const mobileUi = isMobileProfile(settings);

  const applyActiveGraphics = () => {
    applyGraphics(game, activeGraphicsTier(settings), isMobileProfile(settings));
    dispatchEvent(new Event("resize"));
    refreshTouch();
  };

  // Device profile first — switching rebuilds this panel with desktop-only or mobile-only options.
  const deviceOpts: [DeviceMode, string][] = [
    ["auto", "Auto detect"],
    ["desktop", "Desktop"],
    ["mobile", "Mobile"],
  ];
  const deviceSel = h("select", {},
    ...deviceOpts.map(([v, l]) => h("option", { value: v, selected: settings.deviceMode === v }, l)));
  deviceSel.addEventListener("change", () => {
    settings.deviceMode = (deviceSel as HTMLSelectElement).value as DeviceMode;
    saveSettings(settings);
    applyActiveGraphics();
    p.close();
    openSettings(game, settings, touch, gestures);
  });
  p.body.append(
    h("h3", {}, "Device"),
    h("p", { class: "muted" },
      settings.deviceMode === "auto"
        ? (detectMobileDevice()
          ? "Auto picked Mobile. Switch to Desktop for PC graphics."
          : "Auto picked Desktop. Switch to Mobile for phone controls & lighter graphics.")
        : mobileUi
          ? "Mobile settings only — touch controls and phone graphics."
          : "Desktop settings only — keyboard and full PC graphics."),
    h("label", { class: "field" }, h("span", {}, "Profile"), deviceSel),
  );

  if (!mobileUi) {
    // ——— Desktop settings ———
    const grid = h("div", { class: "grid" });
    const renderKeys = () => {
      grid.replaceChildren();
      for (const a of ACTIONS) {
        grid.append(h("span", {}, ACTION_NAMES[a]));
        for (let slot = 0; slot < 2; slot++) {
          const code = settings.keys[a][slot];
          const b = h("button", { class: "key" + (code ? "" : " empty"), title: "Click, then press a key. Backspace clears." }, code ? keyLabel(code) : "—");
          b.addEventListener("click", () => {
            listening?.el.classList.remove("listening");
            listening = { action: a, slot, el: b };
            b.classList.add("listening");
            b.textContent = "Press a key…";
          });
          grid.append(b);
        }
      }
    };
    p.onKey = (e) => {
      if (!listening) return false;
      const { action, slot } = listening;
      listening = null;
      if (e.code !== "Escape") {
        const list = settings.keys[action];
        if (e.code === "Backspace" || e.code === "Delete") list.splice(slot, 1);
        else {
          for (const a of ACTIONS) settings.keys[a] = settings.keys[a].filter((c) => c !== e.code);
          const l = settings.keys[action];
          if (slot < l.length) l[slot] = e.code; else l.push(e.code);
        }
        game.input.bindings = settings.keys;
        saveSettings(settings);
      }
      renderKeys();
      return true;
    };
    renderKeys();

    const gfxSel = h("select", {},
      ...GRAPHICS_TIERS.map((v) => h("option", {
        value: v,
        selected: settings.graphics.desktop === v,
      }, v[0].toUpperCase() + v.slice(1))));
    gfxSel.addEventListener("change", () => {
      settings.graphics.desktop = (gfxSel as HTMLSelectElement).value as GraphicsTier;
      saveSettings(settings);
      applyActiveGraphics();
    });

    p.body.append(
      h("h3", {}, "Keyboard"),
      h("p", { class: "muted" }, "Enter confirms in menus. Click a key to change it."),
      grid,
      h("div", { class: "row", style: "margin-top:10px" },
        h("button", { class: "btn", onclick: () => { settings.keys = structuredClone(DEFAULT_BINDINGS); game.input.bindings = settings.keys; saveSettings(settings); renderKeys(); } }, "Reset keys")),
      h("h3", {}, "Graphics"),
      h("label", { class: "field" }, h("span", {}, "Quality"), gfxSel),
      h("h3", {}, "Display"),
      h("div", { class: "row" }, h("button", { class: "btn", onclick: toggleFullscreen }, "Toggle fullscreen")),
    );
    return;
  }

  // ——— Mobile settings ———
  const t = settings.touch;
  const mode = h("select", {},
    ...([["auto", "Automatic (touch screens)"], ["on", "Always show"], ["off", "Never show"]] as const)
      .map(([v, l]) => h("option", { value: v, selected: t.mode === v }, l)));
  mode.addEventListener("change", () => { t.mode = (mode as HTMLSelectElement).value as Settings["touch"]["mode"]; saveSettings(settings); refreshTouch(); });
  const scheme = h("select", {},
    ...([["buttons", "Buttons"], ["swipe", "Swipe gestures"]] as const)
      .map(([v, l]) => h("option", { value: v, selected: t.scheme === v }, l)));
  scheme.addEventListener("change", () => {
    t.scheme = (scheme as HTMLSelectElement).value as TouchScheme;
    saveSettings(settings);
    refreshTouch();
    renderTouchExtras();
  });
  const range = (min: number, max: number, step: number, get: () => number, set: (v: number) => void) => {
    const r = h("input", { type: "range", min, max, step, value: get() }) as HTMLInputElement;
    r.addEventListener("input", () => { set(+r.value); refreshTouch(); });
    r.addEventListener("change", () => saveSettings(settings));
    return r;
  };
  const touchExtras = h("div", {});
  const renderTouchExtras = () => {
    touchExtras.replaceChildren();
    if (t.scheme === "buttons") {
      touchExtras.append(
        h("label", { class: "field" }, h("span", {}, "Size"), range(0.5, 2, 0.05, () => t.scale, (v) => (t.scale = v))),
        h("label", { class: "field" }, h("span", {}, "Opacity"), range(0.2, 1, 0.05, () => t.opacity, (v) => (t.opacity = v))),
        h("div", { class: "row" },
          h("button", { class: "btn", onclick: () => { p.close(); touch.edit(() => openSettings(game, settings, touch, gestures)); } }, "Move buttons…"),
          h("button", { class: "btn", onclick: () => { t.pos = {}; t.scale = 1; t.opacity = 0.8; saveSettings(settings); refreshTouch(); p.close(); openSettings(game, settings, touch, gestures); } }, "Reset layout")),
      );
    } else {
      touchExtras.append(
        h("div", { class: "note" },
          h("p", {}, "Left side: drag left/right to walk (hold), drag up/down for up/down."),
          h("p", {}, "Right side: swipe up to jump (hold), tap to fire."),
        ),
      );
    }
  };
  renderTouchExtras();

  const gfxSel = h("select", {},
    ...GRAPHICS_TIERS.map((v) => h("option", {
      value: v,
      selected: settings.graphics.mobile === v,
    }, v[0].toUpperCase() + v.slice(1))));
  gfxSel.addEventListener("change", () => {
    settings.graphics.mobile = (gfxSel as HTMLSelectElement).value as GraphicsTier;
    saveSettings(settings);
    applyActiveGraphics();
  });

  p.body.append(
    h("h3", {}, "Touch controls"),
    h("label", { class: "field" }, h("span", {}, "Show"), mode),
    h("label", { class: "field" }, h("span", {}, "Style"), scheme),
    touchExtras,
    h("h3", {}, "Graphics"),
    h("label", { class: "field" }, h("span", {}, "Quality"), gfxSel),
    h("h3", {}, "Display"),
    h("div", { class: "row" }, h("button", { class: "btn", onclick: toggleFullscreen }, "Toggle fullscreen")),
  );
}

export function openCredits(game: Game) {
  const p = openPanel(game, "Credits");
  p.body.append(h("div", { class: "credits" },
    h("div", { class: "role" }, "Ported and imported by"), h("div", { class: "name" }, "Chinmaya Garanik"),
    h("div", { class: "role" }, "Developed by"), h("div", { class: "name" }, "Michal Gdaniec"),
    h("p", { class: "muted", style: "margin-top:22px" }, "New Super Mario Forever 2012. Fan game, not affiliated with Nintendo."),
  ));
}

export function downloadSave() {
  const data = exportSaves();
  if (!Object.keys(data.files).length) { toast("Nothing to save yet."); return; }
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = h("a", { href: URL.createObjectURL(blob), download: `mario-forever-2012-save-${data.date.slice(0, 10)}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast("Save downloaded.");
}

export function openLoad(game: Game) {
  const p = openPanel(game, "Load game");
  const status = h("p", {});
  const file = h("input", { type: "file", accept: ".json,application/json", hidden: true }) as HTMLInputElement;
  file.addEventListener("change", async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      const n = importSaves(JSON.parse(await f.text()));
      status.className = "ok";
      status.textContent = `Loaded ${n} save file${n === 1 ? "" : "s"}. Restarting…`;
      setTimeout(() => location.reload(), 900);
    } catch (e) {
      status.className = "error";
      status.textContent = e instanceof SyntaxError ? "That file could not be read." : (e as Error).message;
    }
  });
  p.body.append(
    h("p", {}, "Choose a save file you downloaded earlier. It replaces the progress stored in this browser."),
    h("div", { class: "row" }, h("button", { class: "btn accent", onclick: () => file.click() }, "Choose save file…"), file),
    status,
    h("div", { class: "note" }, LOAD_INFO),
  );
}
