#event create:0
lifetime=1
randomer=random(360)
//effect_create_above(ef_smoke,x,y,0.75,c_white)

part_particles_create(global.particle_sys_2,x+random(10)-random(10),y-random(20),global.part_effect_smoke,3) 


#event draw:0
if global.pauza=0
{
lifetime+=1
if lifetime>2 {image_alpha-=0.05;image_xscale-=0.1;image_yscale-=0.1}
if image_alpha<=0 {instance_destroy()}

}


draw_sprite_ext(s_fireball_boom_2,0,x,y,image_xscale,image_yscale,randomer,c_white,image_alpha/1.2)
draw_set_blend_mode(bm_add)
draw_sprite_ext(s_fireball_boom,0,x,y,image_xscale,image_yscale,0,c_white,image_alpha/1.2)
draw_set_blend_mode(bm_normal)


