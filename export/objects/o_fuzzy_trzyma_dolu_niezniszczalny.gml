#event create:0
sekwencja=0
ruch_testowy=0
anim=random(360)

grawitacja=0
sekwencja=0
kierunek=1
stream=0
rozdeptywalny=0
kill=0
seened=0

energy=1000000000
gwiazdker=0
muszluje=0

niezjadywalny=1



/*
szybkosc=4


#event step:0
if global.pauza=0{
if sekwencja<0 {sekwencja=3}
if sekwencja>3 {sekwencja=0}
if sekwencja=0 && ruch_testowy=0
    {
    if !place_meeting(x+szybkosc,y,obj_wall) {x+=szybkosc}
    if !place_meeting(x,y+szybkosc,obj_wall) && !place_meeting(x+szybkosc,y,obj_wall) {sekwencja+=1}
    if place_meeting(x+szybkosc,y,obj_wall) && place_meeting(x,y+szybkosc,obj_wall) {sekwencja-=1}
    
    
    if !place_meeting(x,y+szybkosc,obj_wall) && place_meeting(x+szybkosc,y,obj_wall) {sekwencja+=1;}
    }    
if sekwencja=1 && ruch_testowy=0
    {
    if !place_meeting(x,y+szybkosc,obj_wall) {y+=szybkosc}
    if !place_meeting(x-szybkosc,y,obj_wall) && !place_meeting(x,y+szybkosc,obj_wall) {sekwencja+=1}
    if place_meeting(x,y+szybkosc,obj_wall) && place_meeting(x-szybkosc,y,obj_wall){sekwencja-=1}
    
    
    if !place_meeting(x-szybkosc,y,obj_wall) && place_meeting(x,y+szybkosc,obj_wall){sekwencja+=1}
    }   
if sekwencja=2 && ruch_testowy=0
    {
    if !place_meeting(x-szybkosc,y,obj_wall) {x-=szybkosc}
    if !place_meeting(x,y-szybkosc,obj_wall) && !place_meeting(x-szybkosc,y,obj_wall) {sekwencja+=1}
    if place_meeting(x-szybkosc,y,obj_wall) && place_meeting(x,y-szybkosc,obj_wall) {sekwencja-=1}
    
    
    if !place_meeting(x,y-szybkosc,obj_wall) && place_meeting(x-szybkosc,y,obj_wall) {sekwencja+=1}
    }      
if sekwencja=3 && ruch_testowy=0
    {
    if !place_meeting(x,y-szybkosc,obj_wall) {y-=szybkosc}
    if !place_meeting(x+szybkosc,y,obj_wall) && !place_meeting(x,y-szybkosc,obj_wall) {sekwencja+=1}
    if place_meeting(x,y-szybkosc,obj_wall) && place_meeting(x+szybkosc,y,obj_wall) {sekwencja-=1}
    
    if !place_meeting(x+szybkosc,y,obj_wall) && place_meeting(x,y-szybkosc,obj_wall) {sekwencja+=1}
    }      }


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.1 {
draw_set_blend_mode(bm_add)
draw_sprite_ext(global.buzzet_4,0,x+20,y+20,0.750-sin(degtorad(anim))/10,0.750-sin(degtorad(anim))/10,-sin(degtorad(anim*2))*10,c_white,0.74)
draw_sprite_ext(global.buzzet_4,0,x+20,y+20,0.750-sin(degtorad(anim))/10,0.750+sin(degtorad(anim))/10,sin(degtorad(anim*2))*10,c_white,0.74)
draw_set_blend_mode(bm_normal)

draw_sprite_ext(global.buzzet_4,0,x+20,y+20,0.50+sin(degtorad(anim))/20,0.50+sin(degtorad(anim))/20,sin(degtorad(anim))*10,c_white,1)
draw_set_blend_mode(bm_add)
draw_sprite_ext(global.buzzet_4,0,x+20,y+20,0.50-sin(degtorad(anim))/20,0.50-sin(degtorad(anim))/20,-sin(degtorad(anim))*10,c_white,0.4)
draw_set_blend_mode(bm_normal)

draw_sprite_ext(global.buzzet_3,0,x+20,y+30,0.50+sin(degtorad(anim*2))/20,0.50+sin(degtorad(anim))/20,sin(degtorad(anim))*10,c_white,1)


draw_sprite_ext(global.buzzet_2,0,x+12,y+15,0.50+sin(degtorad(anim))/120,0.50+sin(degtorad(anim))/120,-sin(degtorad(anim))*150,c_white,1)
draw_sprite_ext(global.buzzet_2,0,x+28,y+15,0.50+sin(degtorad(anim))/120,0.50+sin(degtorad(anim))/120,sin(degtorad(anim))*180,c_white,1)
anim+=10


// kill

if kill=1
    {
    SXMS_SFX_PlayExt(56,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)
    lolo=instance_create(x,y,o_enemy_goomba_lezy);
    if obj_mario_anim.size2=1 {lolo.ixor=8};
    if obj_mario_anim.size2=-1 {lolo.ixor=-8};
    instance_destroy()
    }


if energy<=0 {kill=10}

if kill=10
    {
    SXMS_SFX_PlayExt(51,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)
    lolo=instance_create(x,y,o_enemy_kill);
    lolo.specjalny_kill=140
    lolo.kierunek=kierunek
    instance_destroy()
    }
    
if kill=1000
    {
    obj_mario.power_star_combo+=1
    SXMS_SFX_PlayExt(51,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)
    lolo=instance_create(x,y,o_enemy_kill);
    lolo.specjalny_kill=140
    lolo.kierunek_idzie=kierunek
    instance_destroy()
    } 
    
    
    
    }


