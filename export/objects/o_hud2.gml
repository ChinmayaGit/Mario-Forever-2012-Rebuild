#event draw:0
draw_set_font(global.font)
draw_set_alpha(1)
draw_set_color(c_white)
draw_set_valign(fa_center)
draw_text_ext_transformed(view_xview[0]+32,view_yview[0]+32,"Mario",0,0,1,1,0)
draw_text_ext_transformed(view_xview[0]+32,view_yview[0]+62,"FPS:_"+string(fps),0,0,1,1,0)
draw_set_blend_mode(bm_normal)
draw_set_valign(fa_left)

