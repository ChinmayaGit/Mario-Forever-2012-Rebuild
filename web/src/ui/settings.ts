// Web-only preferences (key bindings, on-screen controls), kept apart from the game's own settings file.
import { ACTIONS, DEFAULT_BINDINGS, type Action, type Bindings } from "../runtime/input.ts";

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

export interface Settings {
  keys: Bindings;
  touch: { mode: "auto" | "on" | "off"; scale: number; opacity: number; pos: Partial<Record<TouchKey, { x: number; y: number }>> };
}

const KEY = "mf2012:web-settings";

function defaults(): Settings {
  return { keys: structuredClone(DEFAULT_BINDINGS), touch: { mode: "auto", scale: 1, opacity: 0.8, pos: {} } };
}

export function loadSettings(): Settings {
  const d = defaults();
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!s) return d;
    for (const a of ACTIONS) if (Array.isArray(s.keys?.[a])) d.keys[a] = s.keys[a].filter((c: unknown) => typeof c === "string");
    Object.assign(d.touch, s.touch ?? {});
  } catch { /* corrupt settings fall back to defaults */ }
  return d;
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
