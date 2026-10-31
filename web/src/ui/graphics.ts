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

/** Desktop stays sharp; only Low/Medium drop resolution. */
const DESKTOP: Record<GraphicsTier, GraphicsProfile> = {
  low: { scale: 0.7, fx: false, decor: false, particles: 0, backgrounds: 2, cullLevels: true },
  medium: { scale: 0.85, fx: true, decor: true, particles: 0.5, backgrounds: 4, cullLevels: false },
  high: { scale: 1, fx: true, decor: true, particles: 1, backgrounds: 8, cullLevels: false },
  ultra: { scale: 1, fx: true, decor: true, particles: 1, backgrounds: 8, cullLevels: false },
};

/** Phone tiers are cheaper than the same name on desktop (phone High ≈ desktop Low). */
const MOBILE: Record<GraphicsTier, GraphicsProfile> = {
  low: { scale: 0.4, fx: false, decor: false, particles: 0, backgrounds: 1, cullLevels: true },
  medium: { scale: 0.5, fx: false, decor: false, particles: 0, backgrounds: 2, cullLevels: true },
  high: { scale: 0.65, fx: false, decor: true, particles: 0.5, backgrounds: 3, cullLevels: true },
  ultra: { scale: 0.8, fx: true, decor: true, particles: 1, backgrounds: 6, cullLevels: false },
};

export const DEFAULT_GRAPHICS_DESKTOP: GraphicsTier = "ultra";
export const DEFAULT_GRAPHICS_MOBILE: GraphicsTier = "medium";

export function profileFor(tier: GraphicsTier, mobile: boolean): GraphicsProfile {
  return (mobile ? MOBILE : DESKTOP)[tier];
}

export function applyGraphics(game: Game, tier: GraphicsTier, mobile = game.mobilePerf) {
  const p = profileFor(tier, mobile);
  game.mobilePerf = mobile;
  game.gfx = { tier, ...p, particleTick: 0 };
  // Re-apply canvas size for the new scale.
  const aspect = (typeof innerWidth === "number" && innerHeight) ? innerWidth / innerHeight : 4 / 3;
  game.setAspect(aspect);
  // Smooth upscale on desktop full-res; pixelated only when the buffer is intentionally small.
  const crisp = p.scale < 0.95;
  game.canvas.style.imageRendering = crisp ? "pixelated" : "auto";
}
