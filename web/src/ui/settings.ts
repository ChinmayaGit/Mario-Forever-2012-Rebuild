// Web-only preferences (key bindings, on-screen controls), kept apart from the game's own settings file.
import { ACTIONS, DEFAULT_BINDINGS, type Action, type Bindings } from "../runtime/input.ts";
import {
  DEFAULT_GRAPHICS_DESKTOP, DEFAULT_GRAPHICS_MOBILE, GRAPHICS_TIERS, type GraphicsTier,
} from "./graphics.ts";

export type TouchKey = Action;

export interface TouchButtonDef { id: TouchKey; label: string; small?: boolean; x: number; y: number }

/** Positions are the button centre as a fraction of the window. */
export const TOUCH_BUTTONS: TouchButtonDef[] = [
  { id: "left", label: "◀", x: 0.07, y: 0.8 },
  { id: "right", label: "▶", x: 0.21, y: 0.8 },
  { id: "up", label: "▲", x: 0.14, y: 0.67 },
  { id: "down", label: "▼", x: 0.14, y: 0.93 },
  { id: "fire", label: "FIRE", x: 0.78, y: 0.86 },
  { id: "jump", label: "JUMP", x: 0.91, y: 0.73 },
];

/** Same visibility as the MAP / ITEMS buttons; the Opacity slider can only lower it. */
export const DEFAULT_TOUCH_OPACITY = 1;

/** Top-centre of the screen (over the game HUD) acts as the pause key. */
export function inPauseZone(x: number, y: number) {
  return y < innerHeight * 0.18 && x > innerWidth * 0.3 && x < innerWidth * 0.7;
}

/** Title, options, world map, cutscenes: navigated with arrows + Enter rather than jump / fire. */
export const MENU_ROOM =
  /^room_title_screen|^room_map_|^room_end_map$|napis_tworcy|wybierz_jezyk|TV_JOY|END_GAME_ANIM|start_animation_game_room|initialize|^game_initialize$/;

/** Hold a key for a short pulse on behalf of a tap. */
export function pulseKey(input: { press(src: string, k: number): void; release(src: string): void }, src: string, vk: number) {
  input.press(src, vk);
  setTimeout(() => input.release(src), 120);
}

export type TouchScheme = "buttons" | "swipe";
/** Which performance/graphics profile to use. Auto guesses; Desktop/Mobile force it. */
export type DeviceMode = "auto" | "desktop" | "mobile";
export type { GraphicsTier };

export interface Settings {
  keys: Bindings;
  /** Auto / Desktop / Mobile — picks which graphics + touch defaults apply. */
  deviceMode: DeviceMode;
  touch: {
    mode: "auto" | "on" | "off";
    /** Buttons = on-screen pad. Swipe = left stick + right jump/fire gestures. */
    scheme: TouchScheme;
    scale: number;
    opacity: number;
    pos: Partial<Record<TouchKey, { x: number; y: number }>>;
  };
  /** Separate tiers so phone quality never rewrites desktop quality. */
  graphics: { desktop: GraphicsTier; mobile: GraphicsTier };
  /**
   * Mobile performance mode: skip redraws while catching up, and drop resolution further
   * when frames are slow (adaptive). Off = Quality scale only, exact image.
   */
  frameSkip: boolean;
}

const KEY = "mf2012:web-settings";

function defaults(): Settings {
  return {
    keys: structuredClone(DEFAULT_BINDINGS),
    deviceMode: "auto",
    touch: { mode: "auto", scheme: "buttons", scale: 1, opacity: DEFAULT_TOUCH_OPACITY, pos: {} },
    graphics: { desktop: DEFAULT_GRAPHICS_DESKTOP, mobile: DEFAULT_GRAPHICS_MOBILE },
    frameSkip: true,
  };
}

export function loadSettings(): Settings {
  const d = defaults();
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!s) return d;
    for (const a of ACTIONS) if (Array.isArray(s.keys?.[a])) d.keys[a] = s.keys[a].filter((c: unknown) => typeof c === "string");
    if (s.deviceMode === "auto" || s.deviceMode === "desktop" || s.deviceMode === "mobile") d.deviceMode = s.deviceMode;
    Object.assign(d.touch, s.touch ?? {});
    if (d.touch.scheme !== "buttons" && d.touch.scheme !== "swipe") d.touch.scheme = "buttons";
    // 0.8 was the old default, which looked faded next to MAP / ITEMS.
    if (d.touch.opacity === 0.8) d.touch.opacity = DEFAULT_TOUCH_OPACITY;
    d.touch.pos = Object.fromEntries(Object.entries(d.touch.pos).filter(([k]) => (ACTIONS as readonly string[]).includes(k)));
    if (s.graphics) {
      if (GRAPHICS_TIERS.includes(s.graphics.desktop)) d.graphics.desktop = s.graphics.desktop;
      if (GRAPHICS_TIERS.includes(s.graphics.mobile)) d.graphics.mobile = s.graphics.mobile;
    }
    if (typeof s.frameSkip === "boolean") d.frameSkip = s.frameSkip;
  } catch { /* corrupt settings fall back to defaults */ }
  return d;
}

/** True when this browser looks like a phone/tablet (not a touch laptop with a mouse). */
export function detectMobileDevice() {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const noHover = matchMedia("(hover: none)").matches;
  // Phones: coarse pointer and no hover. Ignore maxTouchPoints alone (Surface / touch laptops).
  if (coarse && noHover) return true;
  if (coarse && !fine) return true;
  return false;
}

/** Resolve whether the mobile graphics/touch profile should be active. */
export function isMobileProfile(s: Settings) {
  if (s.deviceMode === "desktop") return false;
  if (s.deviceMode === "mobile") return true;
  return detectMobileDevice();
}

export function activeGraphicsTier(s: Settings): GraphicsTier {
  return isMobileProfile(s) ? s.graphics.mobile : s.graphics.desktop;
}

export function saveSettings(s: Settings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export const isTouchDevice = () => detectMobileDevice() || navigator.maxTouchPoints > 0;

/** Whether on-screen touch/swipe UI should appear in "auto" mode (respects Device profile). */
export function wantTouchAuto(s: Settings) {
  if (s.deviceMode === "desktop") return false;
  if (s.deviceMode === "mobile") return true;
  return isTouchDevice();
}

/** Whether any on-screen touch UI (buttons, swipe zones, MAP / ITEMS) should be shown. */
export function touchUiWanted(s: Settings) {
  const t = s.touch;
  return t.mode === "on" || (t.mode === "auto" && wantTouchAuto(s));
}

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
