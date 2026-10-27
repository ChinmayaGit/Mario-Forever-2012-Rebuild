// GM8 built-in names the compiler must resolve without going through user instance variables.

export const INSTANCE_VARS = new Set([
  "x", "y", "xprevious", "yprevious", "xstart", "ystart", "hspeed", "vspeed", "direction", "speed",
  "friction", "gravity", "gravity_direction", "path_index", "path_position", "path_positionprevious",
  "path_speed", "path_scale", "path_orientation", "path_endaction", "object_index", "id", "solid",
  "persistent", "mask_index", "depth", "visible", "sprite_index", "sprite_width", "sprite_height",
  "sprite_xoffset", "sprite_yoffset", "image_alpha", "image_angle", "image_blend", "image_index",
  "image_number", "image_speed", "image_xscale", "image_yscale", "bbox_left", "bbox_right", "bbox_top",
  "bbox_bottom", "timeline_index", "timeline_position", "timeline_speed", "timeline_running", "timeline_loop",
]);
export const INSTANCE_ARRAYS = new Set(["alarm"]);

export const GLOBAL_VARS = new Set([
  "room", "room_first", "room_last", "room_width", "room_height", "room_caption", "room_persistent",
  "room_speed", "background_color", "background_showcolor", "view_enabled", "view_current", "mouse_x",
  "mouse_y", "mouse_button", "mouse_lastbutton", "keyboard_key", "keyboard_lastkey", "keyboard_lastchar",
  "keyboard_string", "current_time", "current_year", "current_month", "current_day", "current_hour",
  "current_minute", "current_second", "current_weekday", "fps", "game_id", "working_directory",
  "temp_directory", "program_directory", "instance_count", "score", "lives", "health", "show_score",
  "show_lives", "show_health", "caption_score", "caption_lives", "caption_health", "transition_kind",
  "transition_steps", "transition_time", "cursor_sprite", "secure_mode", "error_occurred", "error_last",
  "debug_mode", "event_type", "event_number", "event_object", "event_action",
]);
export const GLOBAL_ARRAYS = new Set([
  "background_visible", "background_foreground", "background_index", "background_x", "background_y",
  "background_htiled", "background_vtiled", "background_xscale", "background_yscale", "background_hspeed",
  "background_vspeed", "background_blend", "background_alpha", "view_visible", "view_xview", "view_yview",
  "view_wview", "view_hview", "view_xport", "view_yport", "view_wport", "view_hport", "view_angle",
  "view_hborder", "view_vborder", "view_hspeed", "view_vspeed", "view_object", "instance_id",
]);

const rgb = (r: number, g: number, b: number) => r | (g << 8) | (b << 16);

export const CONSTANTS: Record<string, number> = {
  true: 1, false: 0, pi: Math.PI,
  self: -1, other: -2, all: -3, noone: -4, global: -5, local: -7,
  c_aqua: rgb(0, 255, 255), c_black: 0, c_blue: rgb(0, 0, 255), c_dkgray: rgb(64, 64, 64),
  c_fuchsia: rgb(255, 0, 255), c_gray: rgb(128, 128, 128), c_green: rgb(0, 128, 0), c_lime: rgb(0, 255, 0),
  c_ltgray: rgb(192, 192, 192), c_maroon: rgb(128, 0, 0), c_navy: rgb(0, 0, 128), c_olive: rgb(128, 128, 0),
  c_orange: rgb(255, 160, 64), c_purple: rgb(128, 0, 128), c_red: rgb(255, 0, 0), c_silver: rgb(192, 192, 192),
  c_teal: rgb(0, 128, 128), c_white: rgb(255, 255, 255), c_yellow: rgb(255, 255, 0),
  vk_nokey: 0, vk_anykey: 1, vk_backspace: 8, vk_tab: 9, vk_enter: 13, vk_return: 13, vk_shift: 16,
  vk_control: 17, vk_alt: 18, vk_pause: 19, vk_escape: 27, vk_space: 32, vk_pageup: 33, vk_pagedown: 34,
  vk_end: 35, vk_home: 36, vk_left: 37, vk_up: 38, vk_right: 39, vk_down: 40, vk_printscreen: 44,
  vk_insert: 45, vk_delete: 46, vk_numpad0: 96, vk_numpad1: 97, vk_numpad2: 98, vk_numpad3: 99,
  vk_numpad4: 100, vk_numpad5: 101, vk_numpad6: 102, vk_numpad7: 103, vk_numpad8: 104, vk_numpad9: 105,
  vk_multiply: 106, vk_add: 107, vk_subtract: 109, vk_decimal: 110, vk_divide: 111,
  vk_f1: 112, vk_f2: 113, vk_f3: 114, vk_f4: 115, vk_f5: 116, vk_f6: 117, vk_f7: 118, vk_f8: 119,
  vk_f9: 120, vk_f10: 121, vk_f11: 122, vk_f12: 123, vk_lshift: 160, vk_rshift: 161, vk_lcontrol: 162,
  vk_rcontrol: 163, vk_lalt: 164, vk_ralt: 165,
  mb_any: -1, mb_none: 0, mb_left: 1, mb_right: 2, mb_middle: 3,
  bm_normal: 0, bm_add: 1, bm_max: 2, bm_subtract: 3,
  bm_zero: 1, bm_one: 2, bm_src_color: 3, bm_inv_src_color: 4, bm_src_alpha: 5, bm_inv_src_alpha: 6,
  bm_dest_alpha: 7, bm_inv_dest_alpha: 8, bm_dest_color: 9, bm_inv_dest_color: 10, bm_src_alpha_sat: 11,
  fa_left: 0, fa_center: 1, fa_right: 2, fa_top: 0, fa_middle: 1, fa_bottom: 2,
  ef_explosion: 0, ef_ring: 1, ef_ellipse: 2, ef_firework: 3, ef_smoke: 4, ef_smokeup: 5, ef_star: 6,
  ef_spark: 7, ef_flare: 8, ef_cloud: 9, ef_rain: 10, ef_snow: 11,
  pt_shape_pixel: 0, pt_shape_disk: 1, pt_shape_square: 2, pt_shape_line: 3, pt_shape_star: 4,
  pt_shape_circle: 5, pt_shape_ring: 6, pt_shape_sphere: 7, pt_shape_flare: 8, pt_shape_spark: 9,
  pt_shape_explosion: 10, pt_shape_cloud: 11, pt_shape_smoke: 12, pt_shape_snow: 13,
  ps_shape_rectangle: 0, ps_shape_ellipse: 1, ps_shape_diamond: 2, ps_shape_line: 3,
  ps_distr_linear: 0, ps_distr_gaussian: 1, ps_distr_invgaussian: 2,
  ty_real: 0, ty_string: 1, dll_cdecl: 0, dll_stdcall: 1,
};
