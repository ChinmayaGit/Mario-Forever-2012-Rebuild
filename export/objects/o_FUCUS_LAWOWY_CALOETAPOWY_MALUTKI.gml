#event create:0
kierunek=0
stream=0
alphar=0


#event draw:0

draw_sprite_ext(s_map_boczek,0,view_xview[0],view_yview[0],0.5*global.ekran_size_act,0.5*global.ekran_size_act,0,c_red,0.5)
draw_sprite_ext(s_map_boczek,0,view_xview[0]+view_wview[0],view_yview[0],-0.5*global.ekran_size_act,0.5*global.ekran_size_act,0,c_red,0.5)
draw_sprite_ext(s_map_boczek,0,view_xview[0],view_yview[0]+view_hview[0],0.5*global.ekran_size_act,-0.5*global.ekran_size_act,0,c_red,0.5)
draw_sprite_ext(s_map_boczek,0,view_xview[0]+view_wview[0],view_yview[0]+view_hview[0],-0.5*global.ekran_size_act,-0.5*global.ekran_size_act,0,c_red,0.5)


