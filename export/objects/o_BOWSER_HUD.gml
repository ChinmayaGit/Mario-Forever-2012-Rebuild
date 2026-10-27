#event create:0
stream=0


#event draw:0
stream+=0.1
tuptus=0
if instance_exists(o_boss_bowser){
for(i=0;i<o_boss_bowser.energy/25;i+=1)
    {
    if i>=10 {tuptus=1}
    draw_sprite_ext(global.energy_boss_1,0,view_xview[0]+270*global.ekran_size_act+i*30*global.ekran_size_act-tuptus*30*10*global.ekran_size_act,view_yview[0]+540*global.ekran_size_act+tuptus*40*global.ekran_size_act,0.8*global.ekran_size_act+sin(stream)/20*global.ekran_size_act,0.8*global.ekran_size_act+sin(stream)/20*global.ekran_size_act,0,c_white,1)
    draw_set_blend_mode(bm_add)
    draw_sprite_ext(global.energy_boss_1,0,view_xview[0]+270*global.ekran_size_act+i*30*global.ekran_size_act-tuptus*30*10*global.ekran_size_act,view_yview[0]+540*global.ekran_size_act+tuptus*40*global.ekran_size_act,0.8*global.ekran_size_act+sin(stream+1.7)/20*global.ekran_size_act,0.8*global.ekran_size_act+sin(stream+1.7)/20*global.ekran_size_act,0,c_white,1)
    draw_set_blend_mode(bm_norma)
    }



}


