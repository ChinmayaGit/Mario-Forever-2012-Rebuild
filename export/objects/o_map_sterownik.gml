#event create:0
animerx=0

seq_przeszedl_mape=0
seq_przeszedl_timer=0
seq_przeszedl_add=0
seq_oddalacz_napisow=1000
seq_stream=0


wybral_mape_1=0
wybral_mape_2=0
zmien_mape=0
wielkosc_glowy_map=0
alpha_glowy_mario=1
blokuj_przyciemnianie_glowy_w_nastepnej_mapie=0

sampel_ogladania_mapy=0

sampel_gameover=0
sampel_zabierzitem=0

alpha_wyboru_mapy=0
wybrana_mapka=0
gracz_wybral_mapke=0

level_napis_efe=0
napis_efektor_1=0
napis_efektor_2=0
napis_efektor_3=0

game_over[0]=0
game_over[1]=0
game_over[2]=0
game_over[3]=0
game_over[4]=0
game_over[5]=0
game_over[6]=0
game_over[7]=0
game_over[8]=0
game_over[9]=0
game_over[10]=0
game_over[11]=0
game_over[12]=0
game_over_oddalacz=1
game_over_zabierz_przedmioty=0
game_over_zabierz_przedmioty_time=0
game_over_zabierz_przedmioty_sekwencja=0
game_over_tworz_efekt=0
game_zabierz_przedmiotow=0
game_dodawaj_zycia=0




game_over_click=0


koko=0
wafel=0
efektuj_uzycie_przedmiotow=0
gracz_wylacza_menu=0
stworz_efekt_uzycia=0



testvar=1
migacz_przyciskow=0

global.mapa_sterownosc=0
przesun_mape_x=0
przesun_mape_y=0
klicknieto=0
klicknieto2=0
efekciar=0


boczki=303
boczki_alpha=0.5
boczki_przyciemniaj_hud=1


przyciemniacz_przedmiotowy=1
klik_dodajnik_x=0
klik_dodajnik_y=0
klickersus=0
selecting=0
item_selecting=0
ixor=0
kreciolek=0
items=0
oczkowanie=0
oczkowanie2=0
animowanie=0
animer=0
obrotnis=0
last="a"
alpha_przedmiotow=1
wybrano_przedmiott=0

// animowanie przedmiotu wybranego z plecaka
wybrano_przedmiot[0]=0
wybrano_przedmiot[1]=0
wybrano_przedmiot[2]=0
wybrano_przedmiot[3]=0
wybrano_przedmiot[4]=0
wybrano_przedmiot[5]=0
wybrano_przedmiot[6]=0
wybrano_przedmiot[7]=0
wybrano_przedmiot[8]=0
wybrano_przedmiot[9]=0
wybrano_przedmiot[10]=0
wybrano_przedmiot[11]=0

selecterus=0



#event step:2
if !keyboard_check(vk_tab) && !keyboard_check(global.ster_up) && !keyboard_check(global.ster_down) && !keyboard_check(global.ster_left) && !keyboard_check(global.ster_right) && !keyboard_check(global.ster_jump)
&& !keyboard_check(global.ster_fire) {klicknieto=0;sampel_ogladania_mapy=0}
// efekt boczkow dla ogladania mapy

if keyboard_check(vk_tab) && boczki_alpha<1  && !item_selecting=1 && global.delayer>=1000 && global.chwilowy_stopper<=0 && global.mario_skusil=0 && global.game_over=0 {boczki_alpha+=0.1;klicknieto=1; if sampel_ogladania_mapy=0 {sampel_ogladania_mapy=1;SXMS_SFX_PlayExt(123,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)}}
if !keyboard_check(vk_tab) && boczki_alpha>0.5 {boczki_alpha-=0.1}

if keyboard_check(vk_tab) && boczki_przyciemniaj_hud<200 && !item_selecting=1 && global.delayer>=1000 && global.chwilowy_stopper<=0 && global.chwilowy_stopper<=0 && global.mario_skusil=0 && global.game_over=0 {boczki_przyciemniaj_hud+=1;klicknieto=1}
if !keyboard_check(vk_tab) && boczki_przyciemniaj_hud>1 {boczki_przyciemniaj_hud=boczki_przyciemniaj_hud/2}
if boczki_przyciemniaj_hud<1 {boczki_przyciemniaj_hud=1}

// przesuwanie ekranem mapy
if o_map_player_1.idzie=0 && keyboard_check(vk_tab) && !item_selecting=1 && global.delayer>=1000 && global.chwilowy_stopper<=0 && global.mario_skusil=0 && global.game_over=0
    {
    global.mapa_sterownosc=1
    klicknieto=1
    }
if global.mapa_sterownosc=1
    {
    if keyboard_check(global.ster_up) {przesun_mape_y-=5;klicknieto=1}
    if keyboard_check(global.ster_down) {przesun_mape_y+=5;klicknieto=1}
    if keyboard_check(global.ster_left) {przesun_mape_x-=5;if efekciar>-5 {efekciar-=0.1};klicknieto=1}
    if keyboard_check(global.ster_right) {przesun_mape_x+=5;;if efekciar<5 {efekciar+=0.1};klicknieto=1}
    if !keyboard_check(global.ster_left) && !keyboard_check(global.ster_right) {efekciar=efekciar/1.2}
    }
if global.mapa_sterownosc=1 && !keyboard_check(vk_tab)
    {
    global.mapa_sterownosc=0
    ;klicknieto=1
    }
if global.mapa_sterownosc<>1
    {
    przesun_mape_x=przesun_mape_x/1.2
    przesun_mape_y=przesun_mape_y/1.2
    if !keyboard_check(global.ster_left) && !keyboard_check(global.ster_right) {efekciar=efekciar/1.2}
    }
if global.mapa_sterownosc=0 {efekciar=efekciar/1.2}
view_angle[0]=efekciar


/*testvar+=0.001
view_wview[0]=800*testvar
view_hview[0]=600*testvar
*/

if global.map_baw_sie_scroolem_map_x>global.map_baw_sie_scroolem_map_x2 {global.map_baw_sie_scroolem_map_x-=2}
if global.map_baw_sie_scroolem_map_x<global.map_baw_sie_scroolem_map_x2 {global.map_baw_sie_scroolem_map_x+=2}
if global.map_baw_sie_scroolem_map_y>global.map_baw_sie_scroolem_map_y2 {global.map_baw_sie_scroolem_map_y-=2}
if global.map_baw_sie_scroolem_map_y<global.map_baw_sie_scroolem_map_y2 {global.map_baw_sie_scroolem_map_y+=2}



    view_xview[0]=o_map_player_1.x-400*testvar+przesun_mape_x+o_map_player_1.gate_opened_x+global.map_baw_sie_scroolem_map_x+o_map_player_1.open_road_x
    view_yview[0]=o_map_player_1.y-300*testvar+przesun_mape_y+o_map_player_1.gate_opened_y+global.map_baw_sie_scroolem_map_y+o_map_player_1.open_road_y
    
    
    // popraw pozycję mapy, zeby gracz nie mogl wyjsc po za playground
    
    if view_xview[0]<0 {view_xview[0]=0}
    if view_yview[0]<0 {view_yview[0]=0}


#event step:0
if global.map_number=8 {

// obliczanie srodka ekranu

global.odleglosc_ekranu=sqrt((view_wview[0]/2)*(view_wview[0]/2)+(view_hview[0]/2)*(view_hview[0]/2))
global.ekran_srodek_x=view_xview[0]+view_wview[0]/2
global.ekran_srodek_y=view_yview[0]+view_hview[0]/2



//view_angle[0]=360+sin(koko)*5;
koko+=0.05

background_y[0]+=sin(koko/2)/10
background_y[1]+=sin(koko/2+1.5)/10
background_x[0]+=cos(koko/2)/20
background_x[1]+=cos(koko/2+1.5)/20


background_hspeed[0]=0
//background_vspeed[0]=-0.1

background_hspeed[1]=0
background_vspeed[1]=0.25//-1/2
background_vspeed[0]=0.25

background_alpha[1]=sin(koko/2)/10+0.55
background_alpha[0]=cos(koko/2)/10+0.85


}


if global.map_number<>8 {

// obliczanie srodka ekranu

global.odleglosc_ekranu=sqrt((view_wview[0]/2)*(view_wview[0]/2)+(view_hview[0]/2)*(view_hview[0]/2))
global.ekran_srodek_x=view_xview[0]+view_wview[0]/2
global.ekran_srodek_y=view_yview[0]+view_hview[0]/2



//view_angle[0]=360+sin(koko)*5;
koko+=0.01

background_y[0]+=sin(koko)/3
background_y[1]+=sin(koko+1.5)/3
background_x[0]+=cos(koko)/4
background_x[1]+=cos(koko+1.5)/4


background_hspeed[0]=0
//background_vspeed[0]=-0.1

background_hspeed[1]=0
background_vspeed[1]=-1/2

background_alpha[1]=0.5+sin(koko)/20
background_alpha[0]=1+sin(koko+2)/20

}





/*
view_wview[0]=800+sin(koko)*40
view_hview[0]=600+sin(koko)*40



#event draw:0
script_map_control()
script_game_over()
script_show_level_names()

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["ZMIENIL MAPE"]
if wybral_mape_1=1
    {
    
    draw_set_color(c_black)
    draw_set_alpha(wybral_mape_2)
    draw_rectangle(view_xview[0],view_yview[0],view_xview[0]+view_wview[0],view_yview[0]+view_hview[0],0)
    draw_set_color(c_white)
    draw_set_alpha(1)
    
    wybral_mape_2+=0.01+wybral_mape_2/100
    
    if zmien_mape=0 && wybral_mape_2>=1 {global.map_wgraj_wartosci=1;room_goto(room_map_1)}
    if zmien_mape=1 && wybral_mape_2>=1 {global.map_wgraj_wartosci=1;room_goto(room_map_2)}
    if zmien_mape=2 && wybral_mape_2>=1 {global.map_wgraj_wartosci=1;room_goto(room_map_3)}
    if zmien_mape=3 && wybral_mape_2>=1 {global.map_wgraj_wartosci=1;room_goto(room_map_4)}
    if zmien_mape=4 && wybral_mape_2>=1 {global.map_wgraj_wartosci=1;room_goto(room_map_5)}
    if zmien_mape=5 && wybral_mape_2>=1 {global.map_wgraj_wartosci=1;room_goto(room_map_6)}
    if zmien_mape=6 && wybral_mape_2>=1 {global.map_wgraj_wartosci=1;room_goto(room_map_7)}
    if zmien_mape=7 && wybral_mape_2>=1 {global.map_wgraj_wartosci=1;room_goto(room_map_8)}
    
    draw_sprite_ext(s_map_twarz_przechodzenie,0,view_xview[0]+view_wview[0]/2,view_yview[0]+view_hview[0]/2,wielkosc_glowy_map,wielkosc_glowy_map,0,c_white,1)
    wielkosc_glowy_map+=0.01+wielkosc_glowy_map/50
    global.efektuj_przejscie_mapy=wielkosc_glowy_map
    blokuj_przyciemnianie_glowy_w_nastepnej_mapie=1
    }
if global.efektuj_przejscie_mapy<>0 && blokuj_przyciemnianie_glowy_w_nastepnej_mapie=0
    {
    draw_sprite_ext(s_map_twarz_przechodzenie,0,view_xview[0]+view_wview[0]/2,view_yview[0]+view_hview[0]/2,global.efektuj_przejscie_mapy,global.efektuj_przejscie_mapy,0,c_white,alpha_glowy_mario)
    draw_set_color(c_black)
    draw_set_alpha(alpha_glowy_mario/2)
    draw_rectangle(view_xview[0],view_yview[0],view_xview[0]+view_wview[0],view_yview[0]+view_hview[0],0)
    draw_set_color(c_white)
    draw_set_alpha(1)
    
    
    global.efektuj_przejscie_mapy+=0.01+global.efektuj_przejscie_mapy/50
    alpha_glowy_mario=alpha_glowy_mario/1.1
    if alpha_glowy_mario<=0.05 {global.efektuj_przejscie_mapy=0;alpha_glowy_mario=0}
    }



/*'
wybral_mape_1=0
wybral_mape_2=0


global.efektuj_przejscie_mapy


