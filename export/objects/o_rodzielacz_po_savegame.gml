#event create:0
timer=0


if global.choosed_save=0
{
global.hex_save_pos=0
    // WGRAJ ZMIENNE PLAYERA
    
    zapis2=hex_open("./data/gfx/beetlee_h.jpg")
    global.map_completed[0]=hex_read(zapis2,global.hex_save_pos+1000+41)
    global.map_completed[1]=hex_read(zapis2,global.hex_save_pos+1000+42)
    global.map_completed[2]=hex_read(zapis2,global.hex_save_pos+1000+43)
    global.map_completed[3]=hex_read(zapis2,global.hex_save_pos+1000+44)
    global.map_completed[4]=hex_read(zapis2,global.hex_save_pos+1000+45)
    global.map_completed[5]=hex_read(zapis2,global.hex_save_pos+1000+46)
    global.map_completed[6]=hex_read(zapis2,global.hex_save_pos+1000+47)
    global.map_completed[7]=hex_read(zapis2,global.hex_save_pos+1000+48)
hex_close(zapis2)

}




if global.choosed_save=1
{
global.hex_save_pos=20000
    // WGRAJ ZMIENNE PLAYERA
    
    zapis2=hex_open("./data/gfx/beetlee_h.jpg")
    global.map_completed[0]=hex_read(zapis2,global.hex_save_pos+1000+41)
    global.map_completed[1]=hex_read(zapis2,global.hex_save_pos+1000+42)
    global.map_completed[2]=hex_read(zapis2,global.hex_save_pos+1000+43)
    global.map_completed[3]=hex_read(zapis2,global.hex_save_pos+1000+44)
    global.map_completed[4]=hex_read(zapis2,global.hex_save_pos+1000+45)
    global.map_completed[5]=hex_read(zapis2,global.hex_save_pos+1000+46)
    global.map_completed[6]=hex_read(zapis2,global.hex_save_pos+1000+47)
    global.map_completed[7]=hex_read(zapis2,global.hex_save_pos+1000+48)
hex_close(zapis2)

}






if global.choosed_save=2
{
global.hex_save_pos=40000
    // WGRAJ ZMIENNE PLAYERA
    
    zapis2=hex_open("./data/gfx/beetlee_h.jpg")
    global.map_completed[0]=hex_read(zapis2,global.hex_save_pos+1000+41)
    global.map_completed[1]=hex_read(zapis2,global.hex_save_pos+1000+42)
    global.map_completed[2]=hex_read(zapis2,global.hex_save_pos+1000+43)
    global.map_completed[3]=hex_read(zapis2,global.hex_save_pos+1000+44)
    global.map_completed[4]=hex_read(zapis2,global.hex_save_pos+1000+45)
    global.map_completed[5]=hex_read(zapis2,global.hex_save_pos+1000+46)
    global.map_completed[6]=hex_read(zapis2,global.hex_save_pos+1000+47)
    global.map_completed[7]=hex_read(zapis2,global.hex_save_pos+1000+48)
hex_close(zapis2)

}


wgaj=0

if global.map_completed[0]<>0 {wgaj=1}
if global.map_completed[1]<>0 {wgaj=2}
if global.map_completed[2]<>0 {wgaj=3}
if global.map_completed[3]<>0 {wgaj=4}
if global.map_completed[4]<>0 {wgaj=5}
if global.map_completed[5]<>0 {wgaj=6}
if global.map_completed[6]<>0 {wgaj=7}
if global.map_completed[7]<>0 {wgaj=8}









#event step:0
timer+=1
global.pauza=0

if wgaj>=1 {global.map_wgraj_wartosci=1;}

if timer>=5{


if wgaj=0 {room_goto(o_start_animation_game_room)
global.punkty=0
global.zycia=4
global.coins=0
global.coins_red=0
global.magic_stars=0
global.map_uzyto_budzika=0
global.map_uzyto_gwiazdki=0
global.map_item_grzyby=0
global.map_item_kwiatki=0
global.map_item_listek=0
global.map_item_burak=0
global.map_item_boomer=0
global.map_item_hammer=0
global.map_item_duch=0
global.map_item_bomber=0
global.map_item_tanoki=0
global.map_item_latacz=0
global.map_item_gwiazdka=0
global.map_item_budzik=0
global.player_started_new_game=1}


if wgaj=1 {room_goto(room_map_1);global.map_wgraj_wartosci=1}
if wgaj=2 {room_goto(room_map_2);global.map_wgraj_wartosci=1}
if wgaj=3 {room_goto(room_map_3);global.map_wgraj_wartosci=1}
if wgaj=4 {room_goto(room_map_4);global.map_wgraj_wartosci=1}
if wgaj=5 {room_goto(room_map_5);global.map_wgraj_wartosci=1}
if wgaj=6 {room_goto(room_map_6);global.map_wgraj_wartosci=1}
if wgaj=7 {room_goto(room_map_7);global.map_wgraj_wartosci=1}
if wgaj=8 {room_goto(room_map_8);global.map_wgraj_wartosci=1}}


