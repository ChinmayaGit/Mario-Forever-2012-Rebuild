// Source-level changes to the original GML, applied before compiling. Unit ids follow sources.ts:
// script name, `object/event:sub/actionIndex`, `room:<room>` or `inst:<room>:<instanceId>`.
// Every `find` must occur in the unit, so a stale patch fails the build instead of silently doing nothing.

export interface Patch { unit: string; find: string; replace: string; all?: boolean }

const HUD = "o_HUD_tworzony_przez_gracza/draw:0/0";

export const PATCHES: Patch[] = [
  // Boot straight into the title menu: skip language choice, the TV/joypad notice and the author screen.
  { unit: "room:game_initialize", find: "room_goto_next()", replace: "global.english_or_polish=0;room_goto(room_title_screen_and_options)" },

  // Title menu, handled by the web UI where noted. Rows are drawn as opcja[0],[2],[1],[4],[3] and row n acts on
  // wybor_opcji=n, so the result reads START GAME, LOAD GAME, MULTIPLAYER, OPTIONS, CREDITS:
  // QUIT (row 3) -> LOAD GAME (row 1), EDIT LEVELS (row 1) -> MULTIPLAYER (row 2), OPTIONS (row 2) -> row 3,
  // CLASSIC MARIO FOREVER -> CREDITS.
  { unit: "script_title_screen", find: 'opcja[1]="OPTIONS"', replace: 'opcja[1]="MULTIPLAYER"' },
  { unit: "script_title_screen", find: 'opcja[2]="EDIT LEVELS"', replace: 'opcja[2]="LOAD GAME"' },
  { unit: "script_title_screen", find: 'opcja[3]="CLASSIC MARIO FOREVER"', replace: 'opcja[3]="CREDITS"' },
  { unit: "script_title_screen", find: 'opcja[4]="QUIT"', replace: 'opcja[4]="OPTIONS"' },
  { unit: "script_title_screen", find: "if wybor_opcji=3 && (", replace: "if wybor_opcji=1 && (" },
  { unit: "script_title_screen", find: "if wybor_opcji=2 && (", replace: "if wybor_opcji=3 && (" },
  { unit: "script_title_screen", find: "o_SOON_Editor_Napis)=0 && wybor_opcji=1 &&", replace: "o_SOON_Editor_Napis)=0 && wybor_opcji=2 &&" },
  { unit: "script_title_screen", find: "game_end()", replace: 'web_menu("load");klik=1' },
  { unit: "script_title_screen", find: 'execute_shell("http://www.softendo.com/game/MF",0)', replace: 'web_menu("credits")' },
  { unit: "script_title_screen", find: "zniknij=250", replace: "zniknij=0" },
  { unit: "script_title_screen", find: "if mf_old_alpha<1 {mf_old_alpha+=0.05}", replace: "" },
  { unit: "script_title_screen", find: "instance_create(x,y,o_SOON_Editor_Napis)", replace: 'klik=1;web_menu("multiplayer")' },

  // HUD: lives, coins and happy stars hug the left edge of the (possibly widened) screen; score, time and the
  // ghost meter the right edge. Offsets stay as designed for the 800-wide window.
  { unit: HUD, find: "draw_sprite_ext(s_map_head_mario,0,view_xview[0]+", replace: "draw_sprite_ext(s_map_head_mario,0,web_hud_left()+" },
  { unit: HUD, find: "view_xview[0]+view_wview[0]/2+sin(degtorad(235+3.9))", replace: "web_hud_left()+view_wview[0]/2+sin(degtorad(235+3.9))" },
  { unit: HUD, find: "view_xview[0]+view_wview[0]/2+sin(degtorad(205+39.2))", replace: "web_hud_left()+view_wview[0]/2+sin(degtorad(205+39.2))" },
  { unit: HUD, find: "view_xview[0]+view_wview[0]/2+sin(degtorad(205+3.9+39.2))", replace: "web_hud_left()+view_wview[0]/2+sin(degtorad(205+3.9+39.2))" },
  { unit: HUD, find: "-1000/dzielnik+view_xview[0]+", replace: "-1000/dzielnik+web_hud_left()+", all: true },
  { unit: HUD, find: "view_xview[0]+view_wview[0]/2+270*", replace: "web_hud_right()-view_wview[0]/2+270*" },
  { unit: HUD, find: "view_xview[0]+view_wview[0]/2+290*", replace: "web_hud_right()-view_wview[0]/2+290*" },
  { unit: HUD, find: "view_xview[0]+view_wview[0]/2+320*", replace: "web_hud_right()-view_wview[0]/2+320*" },
  { unit: HUD, find: "view_xview[0]+800*global.ekran_size_act", replace: "web_hud_right()-view_wview[0]+800*global.ekran_size_act", all: true },

  // Ending dialogue: drop the softendo.com / toolbar plug.
  {
    unit: "inst:room_END_GAME_ANIM_2:180860",
    find: " The latest informations you will find on www.softendo.com site, if you have ideas or want to support Michael Gdaniec games, just install Mario Forever toolbar or play our games!",
    replace: "",
  },
];

/** Room instances dropped from the exported rooms (build-data.ts). */
export const REMOVED_OBJECTS = ["o_facebook", "o_softendo", "o_facebook_cursor"];

export function applyPatches<T extends { id: string; src: string }>(units: T[]): T[] {
  const byId = new Map(units.map((u) => [u.id, u]));
  for (const p of PATCHES) {
    const u = byId.get(p.unit);
    if (!u) throw new Error(`patch: unknown unit ${p.unit}`);
    if (!u.src.includes(p.find)) throw new Error(`patch: "${p.find}" not found in ${p.unit}`);
    u.src = p.all ? u.src.split(p.find).join(p.replace) : u.src.replace(p.find, () => p.replace);
  }
  return units;
}
