// Web-only preferences (key bindings, on-screen controls), kept apart from the game's own settings file.
import { ACTIONS, DEFAULT_BINDINGS, type Action, type Bindings } from "../runtime/input.ts";
import {
  DEFAULT_GRAPHICS_DESKTOP, DEFAULT_GRAPHICS_MOBILE, GRAPHICS_TIERS, type GraphicsTier,
} from "./graphics.ts";

export type TouchKey = Action | "start" | "pause";

export interface TouchButtonDef { id: TouchKey; label: string; small?: boolean; x: number; y: number }

/** Positions are the button centre as a fraction of the window. */
export const TOUCH_BUTTONS: TouchButtonDef[] = [
  { id: "left", label: "◀", x: 0.07, y: 0.8 },
  { id: "right", label: "▶", x: 0.21, y: 0.8 },
  { id: "up", label: "▲", x: 0.14, y: 0.67 },
  { id: "down", label: "▼", x: 0.14, y: 0.93 },
  { id: "fire", label: "FIRE", x: 0.78, y: 0.86 },
  { id: "jump", label: "JUMP", x: 0.91, y: 0.73 },
  { id: "pause", label: "PAUSE", small: true, x: 0.4, y: 0.95 },
  { id: "start", label: "START", small: true, x: 0.6, y: 0.95 },
];

export type TouchScheme = "buttons" | "swipe";
export type { GraphicsTier };

export interface Settings {
  keys: Bindings;
  touch: {
    mode: "auto" | "on" | "off";
    /** Buttons = on-screen pad. Swipe = left stick + right jump/fire gestures. */
    scheme: TouchScheme;
    scale: number;
    opacity: number;
    pos: Partial<Record<TouchKey, { x: number; y: number }>>;
  };
  /** Separate tiers so phone "High" stays cheaper than desktop "High". */
  graphics: { desktop: GraphicsTier; mobile: GraphicsTier };
}

const KEY = "mf2012:web-settings";

function defaults(): Settings {
  return {
    keys: structuredClone(DEFAULT_BINDINGS),
    touch: { mode: "auto", scheme: "buttons", scale: 1, opacity: 0.8, pos: {} },
    graphics: { desktop: DEFAULT_GRAPHICS_DESKTOP, mobile: DEFAULT_GRAPHICS_MOBILE },
  };
}

export function loadSettings(): Settings {
  const d = defaults();
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!s) return d;
    for (const a of ACTIONS) if (Array.isArray(s.keys?.[a])) d.keys[a] = s.keys[a].filter((c: unknown) => typeof c === "string");
    Object.assign(d.touch, s.touch ?? {});
    if (d.touch.scheme !== "buttons" && d.touch.scheme !== "swipe") d.touch.scheme = "buttons";
    if (s.graphics) {
      if (GRAPHICS_TIERS.includes(s.graphics.desktop)) d.graphics.desktop = s.graphics.desktop;
      if (GRAPHICS_TIERS.includes(s.graphics.mobile)) d.graphics.mobile = s.graphics.mobile;
    }
  } catch { /* corrupt settings fall back to defaults */ }
  return d;
}

export function activeGraphicsTier(s: Settings, mobile: boolean): GraphicsTier {
  return mobile ? s.graphics.mobile : s.graphics.desktop;
}

export function saveSettings(s: Settings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export const isTouchDevice = () => matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

/** "KeyQ" -> "Q", "ArrowLeft" -> "←". */
export function keyLabel(code: string): string {
  const named: Record<string, string> = {
    ArrowLeft: "←", ArrowRight: "→", ArrowUp: "↑", ArrowDown: "↓", Space: "Space", Enter: "Enter",
    ShiftLeft: "L-Shift", ShiftRight: "R-Shift", ControlLeft: "L-Ctrl", ControlRight: "R-Ctrl", AltLeft: "L-Alt", AltRight: "R-Alt",
  };
  if (named[code]) return named[code];
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit\d$/.test(code)) return code.slice(5);
  if (/^Numpad/.test(code)) return "Num " + code.slice(6);
  return code;
}
