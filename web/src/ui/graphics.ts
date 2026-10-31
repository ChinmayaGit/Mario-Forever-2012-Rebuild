// Graphics quality presets. Mobile and desktop keep separate saved tiers so "High" on a phone
// is closer to "Low/Medium" on a PC (phones get a lower internal resolution and fewer effects).
import type { Game } from "../runtime/game.ts";

export type GraphicsTier = "low" | "medium" | "high" | "ultra";

export const GRAPHICS_TIERS: GraphicsTier[] = ["low", "medium", "high", "ultra"];

export interface GraphicsProfile {
  /** Internal buffer scale (1 = native 800×600+). */
  scale: number;
  /** Draw fog / glow / soft overlays. */
  fx: boolean;
  /** Draw parallax hills, clouds, big scenery backdrops. */
  decor: boolean;
  /** 0 = no particles, 0.5 = every other frame, 1 = full. */
  particles: number;
  /** How many of the 8 room background slots to draw (front-most first). */
  backgrounds: number;
  /** Cull off-screen sprited instances in normal levels too (not only map/title). */
  cullLevels: boolean;
}

/** Desktop stays sharp; only Low/Medium drop resolution. Never cull stage objects. */
const DESKTOP: Record<GraphicsTier, GraphicsProfile> = {
  low: { scale: 0.7, fx: false, decor: false, particles: 0, backgrounds: 4, cullLevels: false },
  medium: { scale: 0.85, fx: true, decor: true, particles: 0.5, backgrounds: 6, cullLevels: false },
  high: { scale: 1, fx: true, decor: true, particles: 1, backgrounds: 8, cullLevels: false },
  ultra: { scale: 1, fx: true, decor: true, particles: 1, backgrounds: 8, cullLevels: false },
};

/**
 * Phone tiers use a lower internal resolution so Quality changes are obvious and usable.
 * Frame Skip (settings) can lower resolution further when the phone can't keep up.
 * cullLevels stays off in stages (only map/title cull); decor false only skips pure parallax draw.
 */
const MOBILE: Record<GraphicsTier, GraphicsProfile> = {
  low: { scale: 0.45, fx: false, decor: false, particles: 0, backgrounds: 3, cullLevels: false },
  medium: { scale: 0.55, fx: false, decor: false, particles: 0.25, backgrounds: 4, cullLevels: false },
  high: { scale: 0.7, fx: false, decor: true, particles: 0.5, backgrounds: 6, cullLevels: false },
  ultra: { scale: 0.85, fx: true, decor: true, particles: 1, backgrounds: 8, cullLevels: false },
};

export const DEFAULT_GRAPHICS_DESKTOP: GraphicsTier = "ultra";
export const DEFAULT_GRAPHICS_MOBILE: GraphicsTier = "medium";

/** Short labels for the Quality dropdown help text. */
export const GRAPHICS_HINTS: Record<GraphicsTier, string> = {
  low: "Fastest — lowest resolution, no FX",
  medium: "Balanced — lower resolution",
  high: "Sharper — more backgrounds",
  ultra: "Best look — still below desktop",
};

export function profileFor(tier: GraphicsTier, mobile: boolean): GraphicsProfile {
  return (mobile ? MOBILE : DESKTOP)[tier];
}

export function applyGraphics(
  game: Game,
  tier: GraphicsTier,
  mobile = game.mobilePerf,
  frameSkip = game.frameSkip,
) {
  const p = profileFor(tier, mobile);
  game.mobilePerf = mobile;
  game.frameSkip = frameSkip;
  game.gfx = { tier, ...p, particleTick: 0 };
  // Re-apply canvas size for the new scale (and reset any adaptive drop).
  const aspect = (typeof innerWidth === "number" && innerHeight) ? innerWidth / innerHeight : 4 / 3;
  game.dynScale = 1;
  game.setAspect(aspect);
}
