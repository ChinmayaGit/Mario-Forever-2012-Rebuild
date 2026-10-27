#event create:0
stream=random(213)


#event draw:0
draw_sprite_ext(sprite_index,0,view_xview[0]+244*global.ekran_size_act,view_yview[0]+view_hview[0]+43*global.ekran_size_act,1.2*global.ekran_size_act,1.2*global.ekran_size_act,11+sin(stream)*5,c_white,0.5)
stream+=0.01


