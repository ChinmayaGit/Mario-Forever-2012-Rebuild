/**
 * Pure scenery we may skip drawing on low graphics.
 * Keep this narrow — names like "chmurka_do_chodzenia" are walkable platforms, not decor.
 */
export const DECOR_NAME =
  /paralax|parallax|hill_paral|desert_paralax|crystals_paralax|BIG_TLO|sceneriowy|CASTLE_FOG|sun_glow|weather|underwater_blue_glow|underwater.*glow|PERMANENT_EFFECT.*glow|GLOW_WINDOW|glow_swiatla|sparcle_mega_glow|ciel|swiatlo|fog|smoke_creator|smoke_kominowe|lava_smoke|DARK_CHMURKA|DARK_SMOKE|random_static_cloud|random_daleko_paralax_cloud|clouds_maker|small_cloud|wielka_chmura|nabrzmiala_chmura|chmurki_animowane_sceneriowe|chmury_z_boku|generator_latajacych_chmur|chmurken_efekt|map_chmurker|map_5_chmurker|efekt_zmien_alpha_chmur|lava_cloud|o_chmur_1|s_chmurol/i;

/** Never treat these as skippable decor even if a decor pattern matches. */
export const DECOR_KEEP =
  /chodzen|walk|platform|lift|rura|pipe|solid|mario|enemy|block|bonus|coin|ring_points|ODPYCHAJ|push/i;

export const FX_BG_NAME = /fog|ghost|caving|pociem|darker|glow|ciel|utter_glow|wet_ekran/i;

export function isSkipDecorName(name: string) {
  return DECOR_NAME.test(name) && !DECOR_KEEP.test(name);
}
