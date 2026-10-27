#event create:0
koko=random(1)+0.1
image_xscale=0.5+random(0.5)
kiki=random(1000)
wowo=40+random(200)
image_alpha=0


#event draw:0
x-=koko
if image_alpha<1 && !x<view_xview[0]-200 && !x>view_xview[0]+1200 {image_alpha+=0.01}
if x<view_xview[0]-200 {if image_alpha>0 {image_alpha-=0.05}; if image_alpha<=0 {instance_destroy()}}
if x>view_xview[0]+1200 {if image_alpha>0 {image_alpha-=0.05}; if image_alpha<=0 {instance_destroy()}}

draw_sprite_ext(s_map_cloud,0,x,y,image_xscale+sin(kiki)/20,image_xscale+sin(kiki)/20,0,c_white,image_alpha)

draw_sprite_ext(s_map_cloud_2,0,x,y+wowo,image_xscale*1.2+sin(kiki)/10,image_xscale*1.2+sin(kiki)/10,0,c_white,image_alpha/2)
kiki+=0.025



if place_meeting(x,y,o_map_player_1) && image_alpha>0.5 {image_alpha-=0.01}
if !place_meeting(x,y,o_map_player_1) && image_alpha<1 {image_alpha+=0.01}


