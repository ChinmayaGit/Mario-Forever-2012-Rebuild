#event create:0
przejdz_na_mape=0
timer=0
iyor=-13

anim=0
kat=0
globalny_kat=0
size=0.75
size2=1
run_kat=0
torpeda=0
timer=0
kat=0

power_star_kolorek=c_white
miganie=0
niesie=0
run_promien=0
strzelanie=0
strzelanie2=0
schylak=0
run_pochylenie=0
mrugacz[2]=0

size2=obj_mario_anim.size2
with(obj_mario_anim) {visible=0;image_alpha=0}



global.rodzaj_mario=0
global.sequence_map_completed=0

global.chpoint_canuse=1

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["RESETUJ ZDOBYWANIE KLUCZY I RESETUJ ZDOBYWANIE SEKRETNYCH PRZEJŚĆ I INNE CACKA BONUSOWE"]
global.map_key_level_id=0
global.map_key_level_collected=0
global.game_over=0
global.used_power_star_on_start=0
global.used_budzix_on_start=0


#event draw:0
// PRZEJDZ NA MAPE
przejdz_na_mape+=1
    
    
    // TWORZ BLANKER/TRANSITIONS
if przejdz_na_mape=60
    {
    instance_create(x,y,o_BLANKER_MARIO_HEAD_OUT)
    }
// MARIO POKONAL MAPE WIEC WRACA NA MAPE
if przejdz_na_mape>180
    {
global.mario_wszedl_do_etapu=2
global.mario_completed_stage=0



// SEKWENCJA PRZEGRYWANIA Z PRZECIWNIKIEM

global.map_wgraj_wartosci=2
global.kill_atacker=0
global.delayer=0
global.uzyto_stoppera=0 
global.chwilowy_stopper=0
global.mario_skusil=2
global.zycia-=1
        
    // NAGRAJ PO PRZEGRANEJ WALCE
    zapis2=hex_open("./data/gfx/beetlee_h.jpg")
    hex_write(zapis2,global.hex_save_pos+1000+0,global.punkty)
    hex_write(zapis2,global.hex_save_pos+1000+1,global.zycia)
    hex_write(zapis2,global.hex_save_pos+1000+2,global.coins)
    hex_write(zapis2,global.hex_save_pos+1000+3,global.coins_red)
    hex_write(zapis2,global.hex_save_pos+1000+19,global.happy_stars)
    hex_close(zapis2)
    
room_goto(global.return_name_of_map)



    global.pauza=0
    room_goto(global.return_name_of_map)
    }
    
    
    

// torpeda
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size)*size2,y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15)*strzelanie+strzelanie2+torpeda)*size2+schylak,power_star_kolorek,1+miganie)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size)*size2,y+(cos(degtorad(20+kat+globalny_kat))*35/3)*size,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1+torpeda)*size2,power_star_kolorek,1+miganie)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,y+sin(degtorad(run_kat))/2,size,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5)*size2,power_star_kolorek,1+miganie)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size)*size2,y+(cos(degtorad(-22+kat+globalny_kat))*30/3)*size,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1+torpeda)*size2,power_star_kolorek,1+miganie)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7-torpeda)*size2,power_star_kolorek,1+miganie)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2,power_star_kolorek,mrugacz[2])

if global.rodzaj_mario=10 {wiatraczkowanie+=5;draw_sprite_ext(global.gfx_mario_head2[9],0,x-10*size2*size,sin(degtorad(0000/2))*3+y+sin(degtorad(run_kat))/2,(size*size2)*abs(sin(degtorad(wiatraczkowanie)))*1.25,size,(kat+run_pochylenie+strzelanie2/7+sin(degtorad(0000/2))*5)*size2,power_star_kolorek,1+miganie)}

if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(220+kat+globalny_kat))*40/3)*size)*size2,y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+torpeda*2)*size2+schylak,power_star_kolorek,1+miganie)}



timer+=2
if timer>50 {y+=iyor;iyor+=0.55if torpeda<70 {torpeda+=1}
kat-=5}
if timer=150 {SXMS_SFX_PlayExt(130,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)}
if timer=300 {instance_create(x,y,o_FADE_MARIO_DIES)}


