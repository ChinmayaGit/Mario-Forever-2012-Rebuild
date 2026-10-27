#event create:0
ixor=random(800*global.ekran_size_act)
iyor=random(100*global.ekran_size_act)
stream=1
image_angle=random(30)-random(30)
image_xscale=1+random(1)
image_yscale=1+random(1)


#event draw:0
draw_set_blend_mode(bm_add)
draw_sprite_ext(global.lightning,0,view_xview[0]+ixor,view_yview[0]+iyor,image_xscale,image_yscale,image_angle,c_white,stream)
draw_set_blend_mode(bm_normal)


if global.pauza=0{
stream-=0.1
if stream<=0 {instance_destroy()}}


