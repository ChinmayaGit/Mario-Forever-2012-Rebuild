#event create:0
speed_set=0
wait=0
wait_direction=0


nagraj_speed=0

markerus_1=instance_create(x,y,o_big_marker_3_scrool_blocker)
markerus_1.image_yscale=5
markerus_1.blocker=1

markerus_2=instance_create(x,y,o_big_marker_3_scrool_blocker)
markerus_2.image_yscale=5
markerus_2.blocker=1


rusza_sie=0
rusza_sie_x=0
rusza_sie_y=0


timer_killer=0


stream=0
/*

speed=0
bujaj=0


#event step:0
if global.pauza<>0 {if speed<>0 {nagraj_speed=speed;speed=0}}
if global.pauza=0 {

if x>=400*global.ekran_size_act {
with(obj_mario)
    {
    if !place_meeting(x+2,y,obj_wall) && y>room_height-160 {x+=o_SCROOL_DLA_CZOLGOW.speed}
    if sekwencja=1 && !place_meeting(x+speed+1,y,obj_wall) {x+=o_SCROOL_DLA_CZOLGOW.speed}
    }}

// KILL MARIO
with (obj_mario) {
    if y<view_yview[0]-300
        {
        part_particles_create(global.particle_sys_1,x+16,y,global.part_effect_star,20);global.pauza=88;wiwi=instance_create(x+16,y+32,o_mario_dies);SXMS_SFX_PlayExt(128+round(random(1)),((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)
        wiwi.iyor=-18
        }}





//
timer_killer+=1
if timer_killer>20{
global.level_death_pit=view_yview[0]+600*global.ekran_size_act+80}


if place_meeting(x,y,o_CHANGE_DIR_UP)
    {
    kok=instance_place(x,y,o_CHANGE_DIR_UP); with(kok) {instance_destroy()}
    direction=90
    }
if place_meeting(x,y,o_CHANGE_DIR_DOWN)
    {
    kok=instance_place(x,y,o_CHANGE_DIR_DOWN); with(kok) {instance_destroy()}
    direction=-90
    }
if place_meeting(x,y,o_CHANGE_DIR_RIGHT)
    {
    kok=instance_place(x,y,o_CHANGE_DIR_RIGHT); with(kok) {instance_destroy()}
    direction=0
    }
if place_meeting(x,y,o_CHANGE_DIR_LEFT)
    {
    kok=instance_place(x,y,o_CHANGE_DIR_LEFT); with(kok) {instance_destroy()}
    direction=180
    }

if place_meeting(x,y,o_CHANGE_DIR_SET_DIRECTION)
    {
    kok=instance_place(x,y,o_CHANGE_DIR_SET_DIRECTION); 
    wait_direction=kok.direction
    speed_set=kok.set_speed
    wait=kok.set_wait
    with(kok) {instance_destroy()}
    }
if wait>0 {wait-=1; if speed>0 {speed-=0.1}}
if wait<=0 && speed<speed_set {speed+=0.1;direction=wait_direction}




if nagraj_speed<>0 {speed=nagraj_speed;nagraj_speed=0}}


markerus_1.x=view_xview[0]-40
markerus_1.y=view_yview[0]-800


markerus_2.x=view_xview[0]+800
markerus_2.y=view_yview[0]-800


if global.pauza=0
    {
    rusza_sie=0
    if rusza_sie_x<>view_xview[0] {rusza_sie_x=view_xview[0];rusza_sie=1}
    if rusza_sie_y<>view_yview[0] {rusza_sie_y=view_yview[0];rusza_sie=1}
    
    if bujaj=1
        {
        y+=sin(degtorad(stream))
        stream+=2
        
        
        
        }
    }








