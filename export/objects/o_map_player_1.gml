#event create:0
tick_start_not_using_check_point_enemy=0


instance_create(x,y,o_JOYSTICK_ASSISTANCE)

stream_strzalki=0
not_rysuj_strzalki=0
strzalki_alphor=0

tested_1=0
czy_etap_nastepny_ma_brame=0
step_into_gate=0



ruch_delay=0 // musi byc delay przed wejsciem etapu bo inaczej gdy znajduje sie generator dialogow to wygeneruje chmure dialogow i mario wejdzie do etapu a po wyjsciu powiesi sie sterowanie

sampel_ataku=0
sampel_chodzenie=0

open_road_x=0
open_road_y=0

gate_opened_x=0
gate_opened_y=0
gate_dzielnik=10000
gate_gwiazdkuj=0
gate_gwiazdkuj_number=0


animacja_wyjscia_z_etapu=0
anim_wyjscia_y=0
anim_wyjscia_add=0
loloxx=0



animacja_wchodzenia_do_etapu=0
alpha_wchodzenie_do_etapu=1
no_smoke_po_wejsciu=0
wlacz_etap_timer=0

mamamija=0
mamamija2=0

podskocz_po_gameover=0
podskoczenie=0
podskocznix=0


efekt_straty_zycia=0
efekt_straty_zycia2=0
dodatkowa_chmurka_po_zdechnieciu=0

zabierz_ruch_przeciwnikom=0

ilosc_przeciwnikow=0
ilosc_etapow=0
ilosc_wgrania_przeciwnikow=0
ilosc_wgrania_etapow=0
wgraj_id=0
speeder=0
triggered_by_enemy=0

uzyto_bonusu_1=0
uzyto_bonusu_2=0
uzyto_bonusu_4=0
uzyto_bonusu_3=0


rusz_przeciwnikami=0
lastmove=0




szybkosc=2

idzie_do=0
idzie=0
dotykal=0
zatrzymuj=0
zatrzymuj_na=0

scrooling=0
animacja=0



// zmienne animacji - pRZESZCZEP Z GRY
ducher=0
ducher_y=80
ducher_obracacz=0
duch_alpha=0
duch_efekter=100
swim_nozkowanie=0
swim_nozkowanie2=0

ogon_merda=0
ogon_uderzak=0
tanooki_sizer=0
bieg_sampel=0
climbing=0

//


anim=1
anim_docelowy=0
migacz=0


nalezy_do=0
anim_mario_start=0
anim_mario_zmiana=0




kopniak=0

fifel=0

bujanie_nogami=0

linowanie=0

size=0.75
size2=-1
szybkosc_biegu=-20
berserk=0
kat=0
lolo=0
run_kat=0
run_promien=0
run_pochylenie=0
animacja=0
jump=0
schylanie=0
torpeda=0
torpeda2=0

hamowanie=0

berserk=1
berserk2=0
berserk3=0
berserk4=0
berserk5=0
berserk6=0

stanie=0

strzelanie=1
strzelanie2=0

mrugacz[0]=0
mrugacz[1]=0
mrugacz[2]=0

kierunek=1

schylak=0
schylak_sek=0

bieganie_reki=0
globalny_kat=0

niesie=0

drazkowanie=0

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["SAVE GAME JEST W ROOM END"]
// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["GAME OVER SET"]
if global.zycia<=-1
    {
    global.game_over=1
    }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["KASOWANIE PLIKOW SAVE!!!!!!!!!!!"]
// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["UZYWAJ TYLKO DO TESTOW"]
// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["PRZED ADMINA"]
/*

zapis=hex_open("./data/gfx/beetlee.jpg")

                for (i=0;i<40000;i+=1)
            {

                {
                hex_write(zapis,i,0)};
            }
        
    hex_close(zapis)
    
    
    
/*
zapis=hex_open("./data/gfx/beetlee.jpg")

                for (i=0;i<40000;i+=1)
            {

                {
                hex_write(zapis,1+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.id)
                hex_write(zapis,2+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.x)
                hex_write(zapis,3+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.y)
                hex_write(zapis,4+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.idzie)
                hex_write(zapis,5+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.last_x_point)
                hex_write(zapis,6+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.last_y_point)
                hex_write(zapis,7+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.dotykal)
                hex_write(zapis,8+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.killed)
                ilosc_przeciwnikow+=1};
            hex_write(zapis,0+global.hex_save_pos,ilosc_przeciwnikow)
            }
        
    hex_close(zapis)

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["USTAW POZYCJE NA PRZEJSCIE RUROWE - O ILE BYLO DEFINIOWANE"]
if global.przenies_do_etapu<>0
    {
    x=(global.przenies_do_etapu).x
    y=(global.przenies_do_etapu).y
    }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["WGRANIE ZAPISU - TEST SKASUJ"]
/*zapis3=0
zapis2=0
zapis=0

    zapis3=hex_open("./data/gfx/beetlee_m.jpg")
    
    
ilosc_wgrania_etapow=hex_read(zapis3,0+global.hex_save_pos)

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["TWORZ BLANKER/TRANSITION po wejsciu na mape ZAWSZE!"]
instance_create(x,y,o_FADE_blanker_out)

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["SEKWENCJA POKONANIA MAPY - WLACZ i STWORZ ODPOWIEDNI OBIEKT"]
if global.sequence_map_completed=1
    {
    global.sequence_map_completed=0
    instance_create(-100,-100,o_MAP_COMPLETED_OBJECT)
    
    
    }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["NADPISZ NA ZMIENNE global.map_completed CZYLI ZROB TAK ZEBY ALGORYTM WIEDZIAL KTORA MAPE MOZE GRACZ WLACZYC"]
if room_get_name(room)="room_map_1" && global.map_completed[0]=0 {global.map_completed[0]=1}
if room_get_name(room)="room_map_2" && global.map_completed[1]=0 {global.map_completed[1]=1}
if room_get_name(room)="room_map_3" && global.map_completed[2]=0 {global.map_completed[2]=1}
if room_get_name(room)="room_map_4" && global.map_completed[3]=0 {global.map_completed[3]=1}
if room_get_name(room)="room_map_5" && global.map_completed[4]=0 {global.map_completed[4]=1}
if room_get_name(room)="room_map_6" && global.map_completed[5]=0 {global.map_completed[5]=1}
if room_get_name(room)="room_map_7" && global.map_completed[6]=0 {global.map_completed[6]=1}
if room_get_name(room)="room_map_8" && global.map_completed[7]=0 {global.map_completed[7]=1}

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["PLAYER STARTED NEW GAME"]
if global.player_started_new_game=1
    {
    global.player_started_new_game=0
    x=(171658).x
    y=(171658).y
    lolo=(171658).id
    global.mapa_sterownosc=0
    global.pauza=0
    }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["WYLACZAJ MEGA PROCESORORZERNY ALGORYTM!!!"]
global.algorytm_KULKA=0


#event step:0
// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["WYGRAL LEVEL + SPRAWDZ ZDOBYTY KLUCZ"]
// OTWIERANIE NOWEJ SCIEZKI NA MAPIE


if global.game_over=2000
    {
    if global.map_key_level_id.ukryta_droga<>1 {global.game_over=0}}
    
    
if global.game_over=2000
    {
    
    if global.map_key_level_id.ukryta_droga=1 {
    gate_opened_x=(global.map_key_level_id.x-o_map_player_1.x)/gate_dzielnik
    gate_opened_y=(global.map_key_level_id.y-o_map_player_1.y+global.map_key_level_id.brama_y)/gate_dzielnik
    if gate_dzielnik>1 {gate_dzielnik=gate_dzielnik/1.2}
    if gate_dzielnik<1 {global.game_over=2005 ;gate_dzielnik=1;global.map_key_level_id.ukryta_droga=2 }
    }}
    
    
    
if global.game_over=2006
    {
    if instance_exists(o_tworz_ukryta_droge)
        {
        if o_tworz_ukryta_droge.odleglosc_x<0 {open_road_x-=1}
        if o_tworz_ukryta_droge.odleglosc_x>0 {open_road_x+=1}
        if o_tworz_ukryta_droge.odleglosc_y<0 {open_road_y-=1}
        if o_tworz_ukryta_droge.odleglosc_y>0 {open_road_y+=1}
        //open_road_x=o_tworz_ukryta_droge.odleglosc_x*20;
        //open_road_y=o_tworz_ukryta_droge.odleglosc_y*20
        }
        
        
    if !instance_exists(o_tworz_ukryta_droge) {global.game_over=2010}
    repeat(3){
    
    }
    }
if global.game_over=2005 {global.game_over=2006}

if global.game_over=2010
    {
    gate_opened_x=(global.map_key_level_id.x-o_map_player_1.x)/gate_dzielnik
    gate_opened_y=(global.map_key_level_id.y-o_map_player_1.y+global.map_key_level_id.brama_y)/gate_dzielnik
    if gate_dzielnik<99 {gate_dzielnik+=1+gate_dzielnik/1000;open_road_x=open_road_x/1.1;open_road_y=open_road_y/1.1}
    if gate_dzielnik>=50 {global.game_over=0}
    }

    
    
    

// ZDOBYWANIE KLUCZY
/*
if global.map_key_level_collected=1
    {
    global.map_key_level_collected=0
    global.map_key_level_id.posiada_brame=2
    }*/
    
    
    
    
    // OTWIERANIE BRAMY LUB GDY JUZ OTWARTA WRACANIE DO PUNKTU ZWROTNEGO
if global.game_over=1000
    {
    if global.map_key_level_id.posiada_brame<>1 {global.game_over=0}}
    
if global.game_over=1000
    {
    if global.map_key_level_id.posiada_brame=1 {
    global.mario_ktory_pokonal.key=0
    gate_opened_x=(global.map_key_level_id.x-o_map_player_1.x)/gate_dzielnik
    gate_opened_y=(global.map_key_level_id.y-o_map_player_1.y+global.map_key_level_id.brama_y)/gate_dzielnik
    if gate_dzielnik>1 {gate_dzielnik=gate_dzielnik/1.2}
    if gate_dzielnik<1 {gate_dzielnik=1;global.game_over=1001}
    }}
    
    
    
if global.game_over=1001
    {
    global.map_key_level_id.posiada_brame=2
    global.game_over=1002
    gate_gwiazdkuj_number=1
    SXMS_SFX_PlayExt(145,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)
    repeat(3){
    part_system_depth(global.particle_map_sterring,depth+100) 
    part_particles_create(global.particle_map_sterring,random(30)-random(30)+global.map_key_level_id.x,random(30)-random(30)+global.map_key_level_id.y+global.map_key_level_id.brama_y,global.part_map_chmurker,3);
    part_system_depth(global.particle_map_przed_mario,depth-100) 
    part_particles_create(global.particle_map_przed_mario,random(30)-random(30)+global.map_key_level_id.x,random(30)-random(30)+global.map_key_level_id.y+global.map_key_level_id.brama_y,global.part_map_chmurker,1)
    }
    part_particles_create(global.particle_map_przed_mario,global.map_key_level_id.x,global.map_key_level_id.y+global.map_key_level_id.brama_y,global.part_effect_mapgate,1)
    }
if global.game_over=1002 && gate_gwiazdkuj_number>40
    {
    gate_opened_x=(global.map_key_level_id.x-o_map_player_1.x)/gate_dzielnik
    gate_opened_y=(global.map_key_level_id.y-o_map_player_1.y+global.map_key_level_id.brama_y)/gate_dzielnik
    if gate_dzielnik<99 {gate_dzielnik+=1+gate_dzielnik/1000}
    if gate_dzielnik>=50 {global.game_over=0}
    }
if global.game_over=0
    {
    if gate_dzielnik<99 {gate_dzielnik+=1+gate_dzielnik/1000;open_road_x=open_road_x/1.1;open_road_y=open_road_y/1.1}
    }


    
    if gate_gwiazdkuj_number>0 && gate_gwiazdkuj_number<60 {gate_gwiazdkuj+=1}
    if gate_gwiazdkuj>gate_gwiazdkuj_number/20 {gate_gwiazdkuj=0;gate_gwiazdkuj_number+=1;repeat(1){part_particles_create(global.particle_map_przed_mario,random(80)-random(80)+global.map_key_level_id.x,random(80)-random(80)+global.map_key_level_id.y+global.map_key_level_id.brama_y,global.part_effect_water_sparkle,1)}}
    
    
// WYGRAL LEVEL - PRZESZEDL LEVEL LUB PRZECIWNIKA
if global.map_wgraj_wartosci=1 {

SXMS_SFX_PlayExt(134+round(random(1)),(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)
    global.map_wgraj_wartosci=0
    if global.choosed_save=0 {global.hex_save_pos=0}
    if global.choosed_save=1 {global.hex_save_pos=20000}
    if global.choosed_save=2 {global.hex_save_pos=40000}
    
    zapis=hex_open("./data/gfx/beetlee.jpg")
    ilosc_wgrania_przeciwnikow=hex_read(zapis,0+global.hex_save_pos+global.map_number*1000)
    if ilosc_wgrania_przeciwnikow>0
        {
        for (i=0;i<ilosc_wgrania_przeciwnikow;i+=1)
            {

            id_wgrania=hex_read(zapis,1+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.x=hex_read(zapis,2+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.y=hex_read(zapis,3+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.idzie=hex_read(zapis,4+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.last_x_point=hex_read(zapis,5+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.last_y_point=hex_read(zapis,6+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.dotykal=hex_read(zapis,7+global.hex_save_pos+i*10+global.map_number*1000)
            if id_wgrania<>global.id_of_killed_atacker {id_wgrania.killed=hex_read(zapis,8+global.hex_save_pos+i*10+global.map_number*1000)}
            if id_wgrania=global.id_of_killed_atacker && global.kill_atacker=1 {id_wgrania.killed=1}
            }
        hex_close(zapis)
        global.delayer=1
        }
        
        
    // WGRAJ ZMIENNE PLAYERA
    
    zapis2=hex_open("./data/gfx/beetlee_h.jpg")
    
    iii=0
    global.punkty=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.zycia=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.coins=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.coins_red=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.magic_stars=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_uzyto_budzika=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_uzyto_gwiazdki=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_grzyby=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_kwiatki=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_listek=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_burak=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_boomer=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_hammer=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_duch=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_bomber=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_tanoki=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_latacz=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_gwiazdka=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_budzik=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.happy_stars=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_2=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_3=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_4=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_5=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_6=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    
    
    global.map_completed[0]=hex_read(zapis2,global.hex_save_pos+1000+41)
    global.map_completed[1]=hex_read(zapis2,global.hex_save_pos+1000+42)
    global.map_completed[2]=hex_read(zapis2,global.hex_save_pos+1000+43)
    global.map_completed[3]=hex_read(zapis2,global.hex_save_pos+1000+44)
    global.map_completed[4]=hex_read(zapis2,global.hex_save_pos+1000+45)
    global.map_completed[5]=hex_read(zapis2,global.hex_save_pos+1000+46)
    global.map_completed[6]=hex_read(zapis2,global.hex_save_pos+1000+47)
    global.map_completed[7]=hex_read(zapis2,global.hex_save_pos+1000+48)

    
    
    o_map_player_1.x=hex_read(zapis2,global.hex_save_pos+40+global.map_number);iii+=1
    o_map_player_1.y=hex_read(zapis2,global.hex_save_pos+60+global.map_number);iii+=1
    
    o_map_player_1.idzie=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    o_map_player_1.speeder=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    o_map_player_1.dotykal=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    o_map_player_1.size2=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    if o_map_player_1.size2>99999 {o_map_player_1.size2=-1}
    o_map_player_1.animacja=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    o_map_player_1.lastmove=hex_read(zapis2,global.hex_save_pos+1000+iii+global.map_number);iii+=1
    
    hex_close(zapis2)
        
        
        
        
        
        
        
        
        
        
        
        
        
    
    
    
    
    
    
    
    
    
    zapis3=hex_open("./data/gfx/beetlee_m.jpg")
    ilosc_wgrania_etapow=hex_read(zapis3,0+global.hex_save_pos+global.map_number*1000)
    if ilosc_wgrania_etapow>0
        {
        for (i=0;i<ilosc_wgrania_etapow;i+=1)
            {
            id_wgrania_etapu=hex_read(zapis3,1+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.completed=hex_read(zapis3,2+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.posiada_brame=hex_read(zapis3,3+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.grafika_bramy=hex_read(zapis3,4+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.kierunek_bramy=hex_read(zapis3,5+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.generuj_statek=hex_read(zapis3,6+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.generuj_dialog=hex_read(zapis3,7+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.ukryta_droga=hex_read(zapis3,8+global.hex_save_pos+i*10+global.map_number*1000)
            }
        hex_close(zapis3)
        global.delayer=1
        }
        
        
        
        
        }// DELAYER END
        

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["PRZEGRAL LEVEL"]
// WYGRAL LEVEL - PRZEGRANA
if global.map_wgraj_wartosci=2 {
    SXMS_SFX_PlayExt(19,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)
    SXMS_SFX_PlayExt(136+round(random(1)),(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)

    global.map_wgraj_wartosci=0
    efekt_straty_zycia=60
    if global.choosed_save=0 {global.hex_save_pos=0}
    if global.choosed_save=1 {global.hex_save_pos=20000}
    if global.choosed_save=2 {global.hex_save_pos=40000}
    
    zapis=hex_open("./data/gfx/beetlee.jpg")
    ilosc_wgrania_przeciwnikow=hex_read(zapis,0+global.hex_save_pos+global.map_number*1000)
    if ilosc_wgrania_przeciwnikow>0
        {
        for (i=0;i<ilosc_wgrania_przeciwnikow;i+=1)
            {

            id_wgrania=hex_read(zapis,1+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.x=hex_read(zapis,2+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.y=hex_read(zapis,3+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.idzie=hex_read(zapis,4+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.last_x_point=hex_read(zapis,5+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania.last_y_point=hex_read(zapis,6+global.hex_save_pos+i*10+global.map_number*1000)
            
            
            if id_wgrania.idzie=1 {id_wgrania.idzie=3;id_wgrania.moze_isc_po_skuszeniu=1}
            if id_wgrania.idzie=2 {id_wgrania.idzie=4;id_wgrania.moze_isc_po_skuszeniu=1}
            if id_wgrania.idzie=3 {id_wgrania.idzie=1;id_wgrania.moze_isc_po_skuszeniu=1}
            if id_wgrania.idzie=4 {id_wgrania.idzie=2;id_wgrania.moze_isc_po_skuszeniu=1}
            
            //id_wgrania.x=id_wgrania.last_x_point
            //id_wgrania.y=id_wgrania.last_y_point
            
            id_wgrania.dotykal=hex_read(zapis,7+global.hex_save_pos+i*10)
            if id_wgrania<>global.id_of_killed_atacker {id_wgrania.killed=hex_read(zapis,8+global.hex_save_pos+i*10+global.map_number*1000)}
            if id_wgrania=global.id_of_killed_atacker && global.kill_atacker=1 {id_wgrania.killed=1}
            }
        hex_close(zapis)
        global.delayer=1
        }
        
        
    // WGRAJ ZMIENNE PLAYERA
    
    zapis2=hex_open("./data/gfx/beetlee_h.jpg")
    
    iii=0
    global.punkty=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.zycia=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.coins=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.coins_red=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.magic_stars=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_uzyto_budzika=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_uzyto_gwiazdki=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_grzyby=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_kwiatki=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_listek=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_burak=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_boomer=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_hammer=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_duch=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_bomber=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_tanoki=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_latacz=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_gwiazdka=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.map_item_budzik=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.happy_stars=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_2=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_3=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_4=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_5=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    global.unknown_key_6=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    
    global.map_completed[0]=hex_read(zapis2,global.hex_save_pos+1000+41)
    global.map_completed[1]=hex_read(zapis2,global.hex_save_pos+1000+42)
    global.map_completed[2]=hex_read(zapis2,global.hex_save_pos+1000+43)
    global.map_completed[3]=hex_read(zapis2,global.hex_save_pos+1000+44)
    global.map_completed[4]=hex_read(zapis2,global.hex_save_pos+1000+45)
    global.map_completed[5]=hex_read(zapis2,global.hex_save_pos+1000+46)
    global.map_completed[6]=hex_read(zapis2,global.hex_save_pos+1000+47)
    global.map_completed[7]=hex_read(zapis2,global.hex_save_pos+1000+48)
    
    
    o_map_player_1.x=hex_read(zapis2,global.hex_save_pos+40+global.map_number);iii+=1
    o_map_player_1.y=hex_read(zapis2,global.hex_save_pos+60+global.map_number);iii+=1
    
    
    o_map_player_1.idzie=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    o_map_player_1.speeder=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    o_map_player_1.dotykal=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    o_map_player_1.size2=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    if o_map_player_1.size2>99999 {o_map_player_1.size2=-1}
    o_map_player_1.animacja=hex_read(zapis2,global.hex_save_pos+1000+iii);iii+=1
    o_map_player_1.lastmove=hex_read(zapis2,global.hex_save_pos+1000+iii+global.map_number);iii+=1
  
    
    hex_close(zapis2)
        
        
        
        
        
        
        
    zapis3=hex_open("./data/gfx/beetlee_m.jpg")
    ilosc_wgrania_etapow=hex_read(zapis3,0+global.hex_save_pos+global.map_number*1000)
    if ilosc_wgrania_etapow>0
        {
        for (i=0;i<ilosc_wgrania_etapow;i+=1)
            {
            id_wgrania_etapu=hex_read(zapis3,1+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.completed=hex_read(zapis3,2+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.posiada_brame=hex_read(zapis3,3+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.grafika_bramy=hex_read(zapis3,4+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.kierunek_bramy=hex_read(zapis3,5+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.generuj_statek=hex_read(zapis3,6+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.generuj_dialog=hex_read(zapis3,7+global.hex_save_pos+i*10+global.map_number*1000)
            id_wgrania_etapu.ukryta_droga=hex_read(zapis3,8+global.hex_save_pos+i*10+global.map_number*1000)
            }
        hex_close(zapis3)
        global.delayer=1
        }
        
       if place_meeting(x,y,o_button_map_1) && idzie=0
            {
            dodox=instance_place(x,y,o_button_map_1)
            if dodox.generuj_statek=1
                {
                if global.map_number=0 {
                dodox.generuj_statek=2
                (171718).x=o_map_player_1.x;
                (171718).y=o_map_player_1.y;
                dodox.completed=1}

                if global.map_number=1 {
                dodox.generuj_statek=2
                (171465).x=o_map_player_1.x;
                (171465).y=o_map_player_1.y;
                dodox.completed=1}

                if global.map_number=2 {
                dodox.generuj_statek=2
                (172050).x=o_map_player_1.x;
                (172050).y=o_map_player_1.y;
                dodox.completed=1}

                if global.map_number=3 {
                dodox.generuj_statek=2
                (172294).x=o_map_player_1.x;
                (172294).y=o_map_player_1.y;
                dodox.completed=1}

                if global.map_number=4 {
                dodox.generuj_statek=2
                (173042).x=o_map_player_1.x;
                (173042).y=o_map_player_1.y;
                dodox.completed=1}

                if global.map_number=5 {
                dodox.generuj_statek=2
                (172668).x=o_map_player_1.x;
                (172668).y=o_map_player_1.y;
                dodox.completed=1}

                if global.map_number=6 {
                dodox.generuj_statek=2
                (173417).x=o_map_player_1.x;
                (173417).y=o_map_player_1.y;
                dodox.completed=1}
                
                }
                
            }
        
        
        
        
        
        
        
        
        
        
        
        } // DELAYER END

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["zabij przeciwnika atakujacego jak przegral walke"]


// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["DELAYER - ZEBY ALGORYTM MIAL CZAS ODSTAWIC POKONANYCH PRZECIWNIKOW PO ZA MAPE"]
if global.delayer=3 {global.delayer=312121}
if global.delayer=2 {global.delayer=3}
if global.delayer=1 {global.delayer=2}
if global.delayer=0 {global.delayer=1}

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["MARIO PO PRZEGRANEJ WRACA DO POPRZEDNIEGU PUNKTU"]
if global.mario_skusil=2
    {
    if instance_exists(global.zaatakowany_przeciwnik) { with(global.zaatakowany_przeciwnik) {moze_isc_po_skuszeniu=1}}
    x+=20
    global.mario_skusil=3
    kokox=x
    kokoy=y
    podzielnik=0
    dodox=(kokox-dotykal.x)
    dodoy=(kokoy-dotykal.y)
    zabierz_ruch_przeciwnikom=1
    }
if global.mario_skusil=3
    {
    
    rusz_przeciwnikami=0
    dodox=dodox/(1.01+podzielnik)
    dodoy=dodoy/(1.01+podzielnik)
    podzielnik+=0.0008
    idzie=0
    speeder=0
    animacja=4
    x=dotykal.x+dodox
    y=dotykal.y+dodoy
    global.mario_skusil_id=dotykal
    
    if dodox<=1 && dodoy<=1 && dodox>=-1 && dodoy>=-1 && place_meeting(x,y,o_map_atakujacy_przeciwnik) 
        {
        kefir=instance_place(x,y,o_map_atakujacy_przeciwnik) 
        with(kefir) {uciekaj_gdy_mario_skusil=1;moze_isc=1;}
        
        }
    if dodox<=1 && dodoy<=1 && dodox>=-1 && dodoy>=-1 && !place_meeting(x,y,o_map_atakujacy_przeciwnik) 
        {
        dodatkowa_chmurka_po_zdechnieciu=1
        part_system_depth(global.particle_map_sterring,depth+100) 
        part_particles_create(global.particle_map_sterring,x,y,global.part_map_chmurker,3);
        part_system_depth(global.particle_map_przed_mario,depth-100) 
        part_particles_create(global.particle_map_przed_mario,x,y,global.part_map_chmurker,1);
        
        
        x=dotykal.x;y=dotykal.y;global.mario_skusil=0;animacja=0;global.mario_skusil_id=0}
    }
if dodatkowa_chmurka_po_zdechnieciu>=1 && dodatkowa_chmurka_po_zdechnieciu<10
    {
    dodatkowa_chmurka_po_zdechnieciu+=1
    }
if dodatkowa_chmurka_po_zdechnieciu=10
    {
    dodatkowa_chmurka_po_zdechnieciu=11
    part_system_depth(global.particle_map_sterring,depth+10) 
    part_particles_create(global.particle_map_sterring,x,y,global.part_map_chmurker,1);
    }


// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["efekt straty zycia w hudzie"]
if efekt_straty_zycia>0
    {
    efekt_straty_zycia=efekt_straty_zycia/1.05
    efekt_straty_zycia2+=20
    }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["Podskoczenie po gameover // wejsciu do etapu // wyjsciu z etapu"]
if podskocz_po_gameover=1
    {
    globalny_kat=-podskoczenie/4;
    jump=-podskoczenie/4;
    podskoczenie+=podskocznix
    podskocznix+=0.5
    if podskoczenie>0 {podskoczenie=0;podskocznix=0;podskocz_po_gameover=0;       if no_smoke_po_wejsciu=0 {part_system_depth(global.particle_map_sterring,depth+100) 
        part_particles_create(global.particle_map_sterring,x,y,global.part_map_chmurker,3);
        part_system_depth(global.particle_map_przed_mario,depth-100) 
        part_particles_create(global.particle_map_przed_mario,x,y,global.part_map_chmurker,1);animacja=0}}
    }

    
    

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["MODYFIKUJ SCROOLING MARKERAMI"]
if place_meeting(x,y,o_map_przesun_scrool_mapowy)
    {
    zozo=instance_place(x,y,o_map_przesun_scrool_mapowy)
    global.map_baw_sie_scroolem_map_x2=zozo.set_x
    global.map_baw_sie_scroolem_map_y2=zozo.set_y
    }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["USTAW MARIO W INNYM ETAPIE NA MAPIE JAK WYSZEDL DOPIERO Z TAJNEJ RURY PRZENOSZACEJ MARIO W INNY ETAP/LOKACJE"]
if global.change_position_on_map<>0
    {
    x=(global.change_position_on_map).x
    y=(global.change_position_on_map).y
    
    
    
    
    global.change_position_on_map=0
    }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["ZERUJ ANIMACJE PO PRZEJSCIU NA MAPE Z SAVE GAME"]
if global.posavegame_zeruj_animacje_namapie>=1 && global.posavegame_zeruj_animacje_namapie<=5
    {
    global.posavegame_zeruj_animacje_namapie+=1
    if idzie=0 {animacja=0}
    }


#event other:5
// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["NAGRAJ ZAPIS JAK GRACZ IDZIE DO ETAPU"]
if !keyboard_check_pressed(vk_escape) {
    ilosc_przeciwnikow=0
    if global.choosed_save=0 {global.hex_save_pos=0}
    if global.choosed_save=1 {global.hex_save_pos=20000}
    if global.choosed_save=2 {global.hex_save_pos=40000}
    
    // nagraj zmienne przeciwnikow
    zapis=hex_open("./data/gfx/beetlee.jpg")
    if instance_number(o_map_atakujacy_przeciwnik)>0
        {
        for (i=0;i<instance_count;i+=1)
            {
            iii=instance_id[i]
            if iii.object_index=o_map_atakujacy_przeciwnik
                {
                hex_write(zapis,1+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.id)
                hex_write(zapis,2+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.x)
                hex_write(zapis,3+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.y)
                hex_write(zapis,4+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.idzie)
                hex_write(zapis,5+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.last_x_point)
                hex_write(zapis,6+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.last_y_point)
                hex_write(zapis,7+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.dotykal)
                hex_write(zapis,8+global.hex_save_pos+ilosc_przeciwnikow*10+global.map_number*1000,iii.killed)
                ilosc_przeciwnikow+=1};
            hex_write(zapis,0+global.hex_save_pos+global.map_number*1000,ilosc_przeciwnikow)
            }
        }
    hex_close(zapis)
    
    // nagraj pozostale zmienne - pozycja gracza i jego bonusy, itemy itp
    
    zapis2=hex_open("./data/gfx/beetlee_h.jpg")
    

    hex_write(zapis2,global.hex_save_pos+1000+0,global.punkty)
    hex_write(zapis2,global.hex_save_pos+1000+1,global.zycia)
    hex_write(zapis2,global.hex_save_pos+1000+2,global.coins)
    hex_write(zapis2,global.hex_save_pos+1000+3,global.coins_red)
    hex_write(zapis2,global.hex_save_pos+1000+4,global.magic_stars)
    hex_write(zapis2,global.hex_save_pos+1000+5,global.map_uzyto_budzika)
    hex_write(zapis2,global.hex_save_pos+1000+6,global.map_uzyto_gwiazdki)
    hex_write(zapis2,global.hex_save_pos+1000+7,global.map_item_grzyby)
    hex_write(zapis2,global.hex_save_pos+1000+8,global.map_item_kwiatki)
    hex_write(zapis2,global.hex_save_pos+1000+9,global.map_item_listek)
    hex_write(zapis2,global.hex_save_pos+1000+10,global.map_item_burak)
    hex_write(zapis2,global.hex_save_pos+1000+11,global.map_item_boomer)
    hex_write(zapis2,global.hex_save_pos+1000+12,global.map_item_hammer)
    hex_write(zapis2,global.hex_save_pos+1000+13,global.map_item_duch)
    hex_write(zapis2,global.hex_save_pos+1000+14,global.map_item_bomber)
    hex_write(zapis2,global.hex_save_pos+1000+15,global.map_item_tanoki)
    hex_write(zapis2,global.hex_save_pos+1000+16,global.map_item_latacz)
    hex_write(zapis2,global.hex_save_pos+1000+17,global.map_item_gwiazdka)
    hex_write(zapis2,global.hex_save_pos+1000+18,global.map_item_budzik)
    hex_write(zapis2,global.hex_save_pos+1000+19,global.happy_stars)
    hex_write(zapis2,global.hex_save_pos+1000+20,global.unknown_key_2)
    hex_write(zapis2,global.hex_save_pos+1000+21,global.unknown_key_3)
    hex_write(zapis2,global.hex_save_pos+1000+22,global.unknown_key_4)
    hex_write(zapis2,global.hex_save_pos+1000+23,global.unknown_key_5)
    hex_write(zapis2,global.hex_save_pos+1000+24,global.unknown_key_6)
    hex_write(zapis2,global.hex_save_pos+1000+25,global.happy_stars)
    
    
    
    
    hex_write(zapis2,global.hex_save_pos+1000+41,global.map_completed[0])
    hex_write(zapis2,global.hex_save_pos+1000+42,global.map_completed[1])
    hex_write(zapis2,global.hex_save_pos+1000+43,global.map_completed[2])
    hex_write(zapis2,global.hex_save_pos+1000+44,global.map_completed[3])
    hex_write(zapis2,global.hex_save_pos+1000+45,global.map_completed[4])
    hex_write(zapis2,global.hex_save_pos+1000+46,global.map_completed[5])
    hex_write(zapis2,global.hex_save_pos+1000+47,global.map_completed[6])
    hex_write(zapis2,global.hex_save_pos+1000+48,global.map_completed[7])
    
    
    hex_write(zapis2,global.hex_save_pos+40+global.map_number,o_map_player_1.x)
    hex_write(zapis2,global.hex_save_pos+60+global.map_number,o_map_player_1.y)
    
    
    hex_write(zapis2,global.hex_save_pos+1000+27,o_map_player_1.idzie)
    hex_write(zapis2,global.hex_save_pos+1000+28,o_map_player_1.speeder)
    hex_write(zapis2,global.hex_save_pos+1000+29,o_map_player_1.dotykal)
    hex_write(zapis2,global.hex_save_pos+1000+30,o_map_player_1.size2)
    hex_write(zapis2,global.hex_save_pos+1000+31,o_map_player_1.animacja)
    hex_write(zapis2,global.hex_save_pos+1000+32+global.map_number,o_map_player_1.lastmove)
    
    

    hex_close(zapis2)
    
    
    
    // nagraj etapy
    ilosc_etapow=0
     zapis3=hex_open("./data/gfx/beetlee_m.jpg")
    if instance_number(o_map_atakujacy_przeciwnik)>0
        {
        for (i=0;i<instance_count;i+=1)
            {
            iii=instance_id[i]
            if iii.object_index=o_button_map_1
                {
                hex_write(zapis3,1+global.hex_save_pos+ilosc_etapow*10+global.map_number*1000,iii.id)
                hex_write(zapis3,2+global.hex_save_pos+ilosc_etapow*10+global.map_number*1000,iii.completed)
                hex_write(zapis3,3+global.hex_save_pos+ilosc_etapow*10+global.map_number*1000,iii.posiada_brame)
                hex_write(zapis3,4+global.hex_save_pos+ilosc_etapow*10+global.map_number*1000,iii.grafika_bramy)
                hex_write(zapis3,5+global.hex_save_pos+ilosc_etapow*10+global.map_number*1000,iii.kierunek_bramy)
                hex_write(zapis3,6+global.hex_save_pos+ilosc_etapow*10+global.map_number*1000,iii.generuj_statek)
                hex_write(zapis3,7+global.hex_save_pos+ilosc_etapow*10+global.map_number*1000,iii.generuj_dialog)
                hex_write(zapis3,8+global.hex_save_pos+ilosc_etapow*10+global.map_number*1000,iii.ukryta_droga)
                
                
                ilosc_etapow+=1};
            hex_write(zapis3,0+global.hex_save_pos+global.map_number*1000,ilosc_etapow)
            }
        }
    hex_close(zapis3)
    
    
    
    }
    


#event other:3
execute_shell("http://www.softendo.com/site/index/name/New-Super-Mario-Forever-Fanpage",0)


#event draw:0
// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["CHODZENIE I ATAK PRZECIWNIKA"]
depth=-y-50

if global.mapa_sterownosc=0{
if global.pauza=0
    {
// ATAK PRZECIWNIKA
if place_meeting(x,y,o_map_atakujacy_przeciwnik) && global.delayer>=1000 && triggered_by_enemy=0 && global.mario_skusil=0 && global.mario_wszedl_do_etapu=0
    {
    triggered_by_enemy=1
    loloxx=instance_place(x,y,o_map_atakujacy_przeciwnik)
    global.id_of_killed_atacker=loloxx.id
    
    if sampel_ataku=0 && loloxx.rodzaj<>10 {sampel_ataku=1;SXMS_SFX_PlayExt(141,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)}
    if sampel_ataku=0 && loloxx.rodzaj=10 {sampel_ataku=1;SXMS_SFX_PlayExt(150,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)}
    
    
    if global.uzyto_stoppera=0 {global.uzyto_stoppera=1; global.chwilowy_stopper=150}
    loloxx.is_jumping=1
    loloxx.jumping=-3
    }
    
    if global.uzyto_stoppera=1 && global.chwilowy_stopper>0 {global.chwilowy_stopper-=1}
    if global.uzyto_stoppera=1 && global.chwilowy_stopper<=0
        {
        if tick_start_not_using_check_point_enemy=1 {tick_start_not_using_check_point_enemy=2}
        if tick_start_not_using_check_point_enemy=0{
        if global.chpoint_lvl_selected<>loloxx.goto_level {global.mario_ktory_pokonal=loloxx.goto_level;global.chpoint_id=0;global.chpoint_sublevel=0;global.chpoint_lvl_selected=loloxx.goto_level}
        tick_start_not_using_check_point_enemy=1}
        
        if tick_start_not_using_check_point_enemy=2{
        if global.chpoint_id<>0 {
        global.zaatakowany_przeciwnik=loloxx
        room_goto(global.chpoint_sublevel)}
            
        if global.chpoint_id=0 {
        global.zaatakowany_przeciwnik=loloxx
        room_goto(loloxx.goto_level)}}
        
        
        
        
        
        }
    

    
// CHODZENIE PO MAPIE
if idzie=0 && !place_meeting(x,y,o_map_atakujacy_przeciwnik) && global.delayer>=1000 && global.chwilowy_stopper<=0 && global.mario_skusil=0 && global.game_over=0 && global.mario_wszedl_do_etapu=0
    {
    if place_meeting(x,y,o_button_map_1) && global.map_completed_sequence=0
        {
        lolo=instance_place(x,y,o_button_map_1)
        dotykal=lolo.id
        // RYSUJ STRZALKI JAK STOISZ W MIEJSCU
        not_rysuj_strzalki=0
        if strzalki_alphor<1 {strzalki_alphor+=0.05}
        
        if lolo.goto_level=0 || lolo.completed=1 {
        if lolo.prawo=1 {draw_sprite_ext(s_map_napis_8,0,x+52+sin(stream_strzalki)*20,y,1-sin(stream_strzalki)/10,1+sin(stream_strzalki)/10,0,c_white,strzalki_alphor);not_rysuj_strzalki=1}
        if lolo.lewo=1 {draw_sprite_ext(s_map_napis_8,0,x-52-sin(stream_strzalki)*20,y,-1+sin(stream_strzalki)/10,1+sin(stream_strzalki)/10,0,c_white,strzalki_alphor);not_rysuj_strzalki=1}
        if lolo.gora=1 {draw_sprite_ext(s_map_napis_8,0,x,y-52-sin(stream_strzalki)*20,1-sin(stream_strzalki)/10,1+sin(stream_strzalki)/10,90,c_white,strzalki_alphor);not_rysuj_strzalki=1}
        if lolo.dol=1 {draw_sprite_ext(s_map_napis_8,0,x,y+52+sin(stream_strzalki)*20,1-sin(stream_strzalki)/10,1+sin(stream_strzalki)/10,-90,c_white,strzalki_alphor);not_rysuj_strzalki=1}}
        
        if lolo.completed=0 && not_rysuj_strzalki=0 {
        if lastmove=2 {draw_sprite_ext(s_map_napis_8,0,x-52-sin(stream_strzalki)*20,y,-1+sin(stream_strzalki)/10,1+sin(stream_strzalki)/10,0,c_white,strzalki_alphor)}
        if lastmove=1 {draw_sprite_ext(s_map_napis_8,0,x+52+sin(stream_strzalki)*20,y,1-sin(stream_strzalki)/10,1+sin(stream_strzalki)/10,0,c_white,strzalki_alphor)}
        if lastmove=3 {draw_sprite_ext(s_map_napis_8,0,x,y+52+sin(stream_strzalki)*20,1-sin(stream_strzalki)/10,1+sin(stream_strzalki)/10,-90,c_white,strzalki_alphor)}
        if lastmove=4 {draw_sprite_ext(s_map_napis_8,0,x,y-52-sin(stream_strzalki)*20,1-sin(stream_strzalki)/10,1+sin(stream_strzalki)/10,90,c_white,strzalki_alphor)}
        }
        
        
        stream_strzalki+=0.1
        
        
        // PUSTY PUNKT
        if lolo.posiada_brame<>1 && step_into_gate=0 {
        if lolo.goto_level=0 || lolo.completed<>0 {
        if o_map_sterownik.klicknieto=0 && o_map_sterownik.item_selecting=0 {
        if lolo.lewo=1 && keyboard_check(global.ster_left) {idzie=1;size2=-1;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=1;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.prawo=1 && keyboard_check(global.ster_right) {idzie=3;size2=1;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=2;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.gora=1 && keyboard_check(global.ster_up) {idzie=2;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=3;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.dol=1 && keyboard_check(global.ster_down) {idzie=4;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=4;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}}}
        // ETAP KTORY NIE ZOSTAL POKONANY
        if lolo.goto_level<>0 && lolo.completed=0 {
        if o_map_sterownik.klicknieto=0 && o_map_sterownik.item_selecting=0 {
        if lolo.lewo=1 && keyboard_check(global.ster_left) && lastmove=2 {idzie=1;size2=-1;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=1;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.prawo=1 && keyboard_check(global.ster_right) && lastmove=1 {idzie=3;size2=1;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=2;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.gora=1 && keyboard_check(global.ster_up) && lastmove=4 {idzie=2;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=3;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.dol=1 && keyboard_check(global.ster_down) && lastmove=3 {idzie=4;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=4;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}}}}
        
        if lolo.posiada_brame=1 && step_into_gate=0 {
        if lolo.goto_level=0 || lolo.completed<>0 {
        if o_map_sterownik.klicknieto=0 && o_map_sterownik.item_selecting=0 {
        if lolo.lewo=1 && lolo.kierunek_bramy<>0 && keyboard_check(global.ster_left) {idzie=1;size2=-1;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=1;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.prawo=1 && lolo.kierunek_bramy<>1 && keyboard_check(global.ster_right) {idzie=3;size2=1;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=2;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.gora=1 && lolo.kierunek_bramy<>2 && keyboard_check(global.ster_up) {idzie=2;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=3;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.dol=1 && lolo.kierunek_bramy<>3 && keyboard_check(global.ster_down) {idzie=4;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=4;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        
        if lolo.lewo=1 && lolo.kierunek_bramy=0 && keyboard_check(global.ster_left) {step_into_gate=1;SXMS_SFX_PlayExt(43,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0);strzalki_alphor=0}
        if lolo.prawo=1 && lolo.kierunek_bramy=1 && keyboard_check(global.ster_right) {step_into_gate=1;SXMS_SFX_PlayExt(43,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0);strzalki_alphor=0}
        if lolo.gora=1 && lolo.kierunek_bramy=2 && keyboard_check(global.ster_up) {step_into_gate=1;SXMS_SFX_PlayExt(43,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0);strzalki_alphor=0}
        if lolo.dol=1 && lolo.kierunek_bramy=3 && keyboard_check(global.ster_down) {step_into_gate=1;SXMS_SFX_PlayExt(43,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0);strzalki_alphor=0}
        
        }}
        // ETAP KTORY NIE ZOSTAL POKONANY
        if lolo.goto_level<>0 && lolo.completed=0 {
        if o_map_sterownik.klicknieto=0 && o_map_sterownik.item_selecting=0 {
        if lolo.lewo=1 && lolo.kierunek_bramy<>0 && keyboard_check(global.ster_left) && lastmove=2 {idzie=1;size2=-1;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=1;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.prawo=1 && lolo.kierunek_bramy<>1 && keyboard_check(global.ster_right) && lastmove=1 {idzie=3;size2=1;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=2;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.gora=1 && lolo.kierunek_bramy<>2 && keyboard_check(global.ster_up) && lastmove=4 {idzie=2;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=3;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}
        if lolo.dol=1 && lolo.kierunek_bramy<>3 && keyboard_check(global.ster_down) && lastmove=3 {idzie=4;animacja=3;speeder=0;rusz_przeciwnikami=1;lastmove=4;czy_etap_nastepny_ma_brame=0;tested_1=0;strzalki_alphor=0}}}}
    
        
        
        }
    } 
    /*
// wylacz algorytm sprawdzania czy sasiedni etap ma brame jezeli gracz dotyka akurat etapu z brama (bo do tego sa osobne linijki)
if place_meeting(x,y,o_button_map_1)
    {
    a12345=instance_place(x,y,o_button_map_1)
    if a12345.posiada_brame=1 {tested_1=1}
    }*/
    
// jezeli mario wszedl w brame zablokuj ruch mario
if !keyboard_check(global.ster_left) && !keyboard_check(global.ster_right) && !keyboard_check(global.ster_up) && !keyboard_check(global.ster_down) {step_into_gate=0}

koniec_ruchu=0

// sampel chodzenia
if sampel_chodzenie>=10
    {
    SXMS_SFX_PlayExt(0+round(random(1)),(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)
    SXMS_SFX_PlayExt(0+round(random(1)),(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)
    sampel_chodzenie=0
    }
if idzie=1 && global.chwilowy_stopper<=0 && global.mario_skusil=0 
    {
    if czy_etap_nastepny_ma_brame=0 {czy_etap_nastepny_ma_brame=1;
    // sprawdz czy etap ma brame
    tester_father=instance_place(x,y,o_button_map_1)
    for (i=0;i<100;i+=1)
        {
        if place_meeting(x-i*10,y,o_button_map_1) && tested_1=0
            {
            tester=instance_place(x-i*10,y,o_button_map_1)
            if tester.kierunek_bramy=1{
            if tester<>tester_father {if tester.posiada_brame=0 {tested_1=1}}
            if tester<>tester_father {if tester.posiada_brame=1 {koniec_ruchu=1;tested_1=1;rusz_przeciwnikami=0;step_into_gate=1;SXMS_SFX_PlayExt(43,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0);animacja=0;idzie=0;dotykal=tester_father.id;zatrzymuj=0;zatrzymuj_na=0;break;break;break}}
            }}
        
        
        }}
        if koniec_ruchu=0{
    sampel_chodzenie+=1
    if random(100)>90 {part_particles_create(global.particle_sys_1,x+random(20)-random(20),y+random(20)-random(20),global.part_effect_smoker_map,1)}
    speeder+=0.1
    x-=2+speeder
    if place_meeting(x,y,o_button_map_1)
        {
        ruch_delay=0
        lolo=instance_place(x,y,o_button_map_1)
        if lolo.id<>dotykal {zatrzymuj=1;zatrzymuj_na=lolo.id}
        
        if zatrzymuj_na<>0  {if x<zatrzymuj_na.x {animacja=0;x=zatrzymuj_na.x;idzie=0;dotykal=lolo.id;zatrzymuj=0;zatrzymuj_na=0}}
        }
    
    }}
    
    
    
    
if idzie=2 && global.chwilowy_stopper<=0 && global.mario_skusil=0 
    {
    if czy_etap_nastepny_ma_brame=0 {czy_etap_nastepny_ma_brame=1;
    // sprawdz czy etap ma brame
    tester_father=instance_place(x,y,o_button_map_1)
    for (i=0;i<100;i+=1)
        {
        if place_meeting(x,y-i*10,o_button_map_1) && tested_1=0
            {
            tester=instance_place(x,y-i*10,o_button_map_1)
            if tester<>tester_father {if tester.posiada_brame=0 {tested_1=1}}
            if tester<>tester_father && tester.kierunek_bramy=3 {if tester.posiada_brame=1 {koniec_ruchu=1;tested_1=1;rusz_przeciwnikami=0;step_into_gate=1;SXMS_SFX_PlayExt(43,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0);animacja=0;idzie=0;dotykal=tester_father.id;zatrzymuj=0;zatrzymuj_na=0;break;break;break}}
            }
        
        
        }}
        
        if koniec_ruchu=0{
    sampel_chodzenie+=1
    if random(100)>90 {part_particles_create(global.particle_sys_1,x+random(20)-random(20),y+random(20)-random(20),global.part_effect_smoker_map,1)}
    speeder+=0.1
    y-=2+speeder
    if place_meeting(x,y,o_button_map_1)
        {
        ruch_delay=0
        lolo=instance_place(x,y,o_button_map_1)
        if lolo.id<>dotykal {zatrzymuj=1;zatrzymuj_na=lolo.id}
        
        if zatrzymuj_na<>0 {if y<zatrzymuj_na.y {animacja=0;y=zatrzymuj_na.y;idzie=0;dotykal=lolo.id;zatrzymuj=0;zatrzymuj_na=0}}
        }
        

    }  }
    
    
     
    
    
    
     
if idzie=3 && global.chwilowy_stopper<=0 && global.mario_skusil=0 
    {
    if czy_etap_nastepny_ma_brame=0 {czy_etap_nastepny_ma_brame=1;
    // sprawdz czy etap ma brame
    tester_father=instance_place(x,y,o_button_map_1)
    for (i=0;i<100;i+=1)
        {
        if place_meeting(x+i*10,y,o_button_map_1) && tested_1=0
            {
            tester=instance_place(x+i*10,y,o_button_map_1)
            if tester.kierunek_bramy=0{
            if tester<>tester_father {if tester.posiada_brame=0 {tested_1=1}}
            if tester<>tester_father {if tester.posiada_brame=1 {koniec_ruchu=1;tested_1=1;rusz_przeciwnikami=0;step_into_gate=1;SXMS_SFX_PlayExt(43,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0);animacja=0;idzie=0;dotykal=tester_father.id;zatrzymuj=0;zatrzymuj_na=0;koniec_ruchu=0}}
            }}
        
        
        }}
        if koniec_ruchu=0{
    sampel_chodzenie+=1
    if random(100)>90 {part_particles_create(global.particle_sys_1,x+random(20)-random(20),y+random(20)-random(20),global.part_effect_smoker_map,1)}
    speeder+=0.1
    x+=2+speeder
        if place_meeting(x,y,o_button_map_1)
        {
        ruch_delay=0
        lolo=instance_place(x,y,o_button_map_1)
        if lolo.id<>dotykal {zatrzymuj=1;zatrzymuj_na=lolo.id}
        
        if zatrzymuj_na<>0 {if x>zatrzymuj_na.x {animacja=0;x=zatrzymuj_na.x;idzie=0;dotykal=lolo.id;zatrzymuj=0;zatrzymuj_na=0}}
        }
    
    }  }
    
    
    
    
if idzie=4 && global.chwilowy_stopper<=0 && global.mario_skusil=0 
    {
    if czy_etap_nastepny_ma_brame=0 {czy_etap_nastepny_ma_brame=1;
    // sprawdz czy etap ma brame
    tester_father=instance_place(x,y,o_button_map_1)
    for (i=0;i<100;i+=1)
        {
        if place_meeting(x,y+i*10,o_button_map_1) && tested_1=0
            {
            tester=instance_place(x,y+i*10,o_button_map_1)
            if tester<>tester_father {if tester.posiada_brame=0 {tested_1=1}}
            if tester<>tester_father {if tester.posiada_brame=1 && tester.kierunek_bramy=2 {koniec_ruchu=1;tested_1=1;rusz_przeciwnikami=0;step_into_gate=1;SXMS_SFX_PlayExt(43,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0);animacja=0;idzie=0;dotykal=tester_father.id;zatrzymuj=0;zatrzymuj_na=0;;break;break;break}
            }}
        
        
        }}
        
        if koniec_ruchu=0{
    sampel_chodzenie+=1
    if random(100)>90 {part_particles_create(global.particle_sys_1,x+random(20)-random(20),y+random(20)-random(20),global.part_effect_smoker_map,1)}
    speeder+=0.1
    y+=2+speeder
    if place_meeting(x,y,o_button_map_1)
        {
        ruch_delay=0
        lolo=instance_place(x,y,o_button_map_1)
        if lolo.id<>dotykal {zatrzymuj=1;zatrzymuj_na=lolo.id}
        
        if zatrzymuj_na<>0 {if y>zatrzymuj_na.y {animacja=0;y=zatrzymuj_na.y;idzie=0;dotykal=lolo.id;zatrzymuj=0;zatrzymuj_na=0}}
        }
    
    }  }
    
    
         
    
    
    
    
    }}

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["ANIMATION"]

anim=max(0,global.rodzaj_mario-1)



draw_sprite_ext(s_map_shadow_1,0,x,y+10,1,0.5,0,c_white,1)
draw_sprite_ext(s_map_shadow_1,0,x,y+30,1,2,0,c_white,0.5)
if animacja=0{
// stanie w miejscu

if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size)*size2,schylanie/5+podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15-schylanie*2)*strzelanie+strzelanie2)*size2-240*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size)*size2,sin(degtorad(hamowanie/2))*5++podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15)*strzelanie+sin(degtorad(strzelanie2*2))*200-sin(degtorad(hamowanie/2))*10)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(20+kat+globalny_kat))*35/3)*size,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1+sin(degtorad(hamowanie/2))*5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2+60*size2+ogon_uderzak+sin(degtorad(ogon_merda))*20,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(-22+kat+globalny_kat))*30/3)*size,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1-40-sin(degtorad(hamowanie/2))*5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7+sin(degtorad(hamowanie/2))*5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,sin(degtorad(hamowanie/2))*5++podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7+sin(degtorad(hamowanie/2))*5)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(220+kat+globalny_kat))*40/3)*size)*size2,sin(degtorad(hamowanie/2))*5++podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+sin(degtorad(hamowanie/2))*10)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(220+kat+globalny_kat))*40/3)*size)*size2,schylanie/5++podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+strzelanie2/10)*size2-160*size2,c_white,1/alpha_wchodzenie_do_etapu)}

if anim=9 {draw_sprite_ext(global.gfx_mario_head2[9],0,x-10*size2*size,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,(size*size2)*abs(sin(degtorad(hamowanie)))*1.25,size,(kat+run_pochylenie+strzelanie2/7+sin(degtorad(hamowanie/2))*5)*size2,c_white,1)}

run_pochylenie=0
hamowanie+=5
kat=0
//size=1
run_kat=0
run_promien=0
if run_pochylenie>-10 run_pochylenie-=0.3
}



if animacja=1{
// plywanie w wodzie ;)
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15-schylanie*2)*strzelanie+strzelanie2)*size2-240*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size)*size2,sin(degtorad(hamowanie/2))*5++podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,(strzelanie+strzelanie2-sin(degtorad(hamowanie/2))*10+33)*size2+schylak-szybkosc*40,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(20+kat+globalny_kat))*35/3)*size,size*size2,size,(-35+kat+sin(degtorad(run_kat))*run_promien*1+sin(degtorad(swim_nozkowanie2+hamowanie/2))*25)*size2-szybkosc*20,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2+60*size2+ogon_uderzak+sin(degtorad(ogon_merda))*20,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(-22+kat+globalny_kat))*30/3)*size,size*size2,size,(-35+kat-sin(degtorad(run_kat))*run_promien*1-sin(degtorad(swim_nozkowanie2+hamowanie/2))*25)*size2-szybkosc*20,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7+sin(degtorad(hamowanie/2))*5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,sin(degtorad(hamowanie/2))*5++podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7+sin(degtorad(hamowanie/2))*5)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(220+kat+globalny_kat))*40/3)*size)*size2,sin(degtorad(hamowanie/2))*5++podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(15+sin(degtorad(hamowanie/2))*10+88)*size2+schylak+szybkosc*40+40*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(220+kat+globalny_kat))*40/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+strzelanie2/10)*size2-160*size2,c_white,1/alpha_wchodzenie_do_etapu)}
hamowanie+=25+swim_nozkowanie*2
swim_nozkowanie2+=swim_nozkowanie
kat=0
//size=1
run_kat=0
run_promien=0
if run_pochylenie>-10 run_pochylenie-=0.3
}


if animacja=2{
// skok

if size2=1{
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15-schylanie*2)*strzelanie+strzelanie2)*size2-240*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,-size,((kat+sin(degtorad(run_kat))*run_promien/2-15+jump)*strzelanie+strzelanie2)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size),+podskoczenie-20+y+(cos(degtorad(20+kat+globalny_kat))*35/3)*size,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1+jump)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2+60*size2+sin(degtorad(ogon_merda))*20++ogon_uderzak,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,+podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,kat+sin(degtorad(run_kat))+run_pochylenie*size2+strzelanie2/10,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(-22+kat+globalny_kat))*30/3)*size,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1-22-jump)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+jump/5+strzelanie2/10)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+((sin(degtorad(220+kat+globalny_kat))*40/3)*size),+podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+jump)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(220+kat+globalny_kat))*40/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+strzelanie2/10)*size2-160*size2,c_white,1/alpha_wchodzenie_do_etapu)}
}

if size2=-1{
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(-150-kat+globalny_kat))*30/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(-150-kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15-schylanie*2)*strzelanie+strzelanie2)*size2-240*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+((sin(degtorad(-150-kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(-150-kat+globalny_kat))*30/3)*size,size*size2,-size,((kat+sin(degtorad(run_kat))*run_promien/2-15+jump)*strzelanie+strzelanie2)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(+podskoczenie-20-kat+globalny_kat))*35/3)*size),-20+y+(cos(degtorad(-20-kat+globalny_kat))*35/3)*size,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1+jump)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2+60*size2+sin(degtorad(ogon_merda))*20++ogon_uderzak,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,+podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,kat+sin(degtorad(run_kat))+run_pochylenie*size2+strzelanie2/10,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(+22-kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(+22-kat+globalny_kat))*30/3)*size,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1-22-jump)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(-180-kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(-180-kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+jump/5+strzelanie2/10)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(-180-kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(-180-kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+((sin(degtorad(-220-kat+globalny_kat))*40/3)*size),+podskoczenie-20+y+(cos(degtorad(-220-kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+jump)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(-220-kat+globalny_kat))*40/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(-220-kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+strzelanie2/10)*size2-160*size2,c_white,1/alpha_wchodzenie_do_etapu)}
}
}



if animacja=3{
if size2=1{
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/20-15-schylanie*2)*strzelanie+strzelanie2)*size2-240*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+(((sin(degtorad(150+kat+globalny_kat))*30/3)*size)),+podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien*-1-15)*strzelanie+strzelanie2)*size2+schylak+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size),+podskoczenie-20+y+((cos(degtorad(20+kat+globalny_kat))*35/3)*size),size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1)*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2+60*size2+ogon_uderzak+sin(degtorad(ogon_merda))*20,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,+podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5)*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+((cos(degtorad(-22+kat+globalny_kat))*30/3)*size),size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1)*size2+globalny_kat,c_white,1)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7)*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2+globalny_kat,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+(((sin(degtorad(220+kat+globalny_kat))*40/3)*size)),+podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(40+180+kat-sin(degtorad(run_kat))*run_promien*-1+15)*size2+schylak+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(220+kat+globalny_kat))*40/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/20+15+strzelanie2/10)*size2-160*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)}
}
if size2=-1{
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+(((sin(degtorad(-150-kat+globalny_kat))*30/3)*size)),+podskoczenie-20+y+(cos(degtorad(-150-kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien*-1-15)*strzelanie+strzelanie2)*size2+schylak+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/20-15-schylanie*2)*strzelanie+strzelanie2)*size2-240*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(+podskoczenie-20-kat+globalny_kat))*35/3)*size),+podskoczenie-20+y+((cos(degtorad(+podskoczenie-20-kat+globalny_kat))*35/3)*size),size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1)*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,sin(degtorad(hamowanie/2))*3++podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2+60*size2+ogon_uderzak+sin(degtorad(ogon_merda))*20,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,+podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5)*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(+22-kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+((cos(degtorad(+22-kat+globalny_kat))*30/3)*size),size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1)*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7)*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size),+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2+globalny_kat,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+(((sin(degtorad(-220-kat+globalny_kat))*40/3)*size)),+podskoczenie-20+y+(cos(degtorad(-220-kat+globalny_kat))*40/3)*size,size*size2,-size,(40+180+kat-sin(degtorad(run_kat))*run_promien*-1+15)*size2+schylak+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(220+kat+globalny_kat))*40/3)*size),schylanie/5++podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/20+15+strzelanie2/10)*size2-160*size2+globalny_kat,c_white,1/alpha_wchodzenie_do_etapu)}
}


bieg_sampel+=abs(szybkosc_biegu)
if bieg_sampel>=180
    {
    bieg_sampel=0
    kalafior=round(random(1))
    //SXMS_SFX_PlayExt(kalafior,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,0,0)
    }



kat=-10
//size=1
run_kat-=szybkosc_biegu
bieganie_reki-=szybkosc_biegu
run_promien=50
if run_pochylenie>-10 run_pochylenie-=0.3} //


















if animacja=4{
// bieg berserkera
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,(((kat+sin(degtorad(run_kat))*run_promien/2-15)*strzelanie+strzelanie2)*berserk-berserk3)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(20+kat+globalny_kat))*35/3)*size,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,+podskoczenie-20+y+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(-22+kat+globalny_kat))*30/3)*size,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7+sin(degtorad(berserk3))*10)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(220+kat+globalny_kat))*40/3)*size)*size2,+podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,((180+kat-sin(degtorad(run_kat))*run_promien/2+15)*berserk-berserk3)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
berserk2=1
kat=-10
//size=1
run_kat-=20
run_promien=50
if run_pochylenie>-10 run_pochylenie-=0.3


if berserk2=1
    {
    berserk3+=24
    }
}


if animacja=5{
// torpeda
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie+podskoczenie-20+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15)*strzelanie+strzelanie2+torpeda)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size)*size2,+podskoczenie+podskoczenie-20+y+(cos(degtorad(20+kat+globalny_kat))*35/3)*size,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1+torpeda)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,+podskoczenie+podskoczenie-20+y+sin(degtorad(run_kat))/2,size,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie+podskoczenie-20+y+(cos(degtorad(-22+kat+globalny_kat))*30/3)*size,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1+torpeda)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+strzelanie2/7-torpeda)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,+podskoczenie+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(220+kat+globalny_kat))*40/3)*size)*size2,+podskoczenie+podskoczenie-20+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+torpeda*2)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
if torpeda<70 {torpeda+=10}
kat-=8
}


// SCHYLANIE
if animacja=6{
// schylanie
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size)*size2,schylanie/5+y+podskoczenie-20+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15+schylanie/5)*strzelanie+strzelanie2)*size2-240*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size)*size2,schylanie/5+y+podskoczenie-20+(cos(degtorad(150+kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15-schylanie*2)*strzelanie+strzelanie2)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size)*size2,schylanie/5+y+podskoczenie-20+(cos(degtorad(20+kat+globalny_kat))*35/3)*size,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1-schylanie*2+strzelanie2/10)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,schylanie/5+y+podskoczenie-20+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie*3+strzelanie2/5)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,schylanie/5+y+podskoczenie-20+sin(degtorad(run_kat))/2,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5)*size2+60*size2+ogon_uderzak+sin(degtorad(ogon_merda))*20,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size)*size2,schylanie/5+y+podskoczenie-20+(cos(degtorad(-22+kat+globalny_kat))*30/3)*size,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1-22+schylanie)*size2,c_white,1)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,schylanie/5+y+podskoczenie-20+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie*3-strzelanie2/10)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size)*size2,schylanie/5+podskoczenie-20+y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat)),(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie*3)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(220+kat+globalny_kat))*40/3)*size)*size2,schylanie/5+y+podskoczenie-20+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+strzelanie2/10)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(220+kat+globalny_kat))*40/3)*size)*size2,schylanie/5+y+podskoczenie-20+(cos(degtorad(220+kat+globalny_kat))*40/3)*size,size*size2,-size,(schylanie/5+180+kat-sin(degtorad(run_kat))*run_promien/2+15+strzelanie2/10)*size2-160*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if schylanie<40 && mamamija=0 {schylanie+=2;run_pochylenie-=2}
if schylanie>=40 && mamamija=0 {schylanie=40;mamamija=1}
if run_pochylenie<=-50 {run_pochylenie=-50}
if mamamija=1 {schylanie=schylanie+sin(degtorad(mamamija2))/3;run_pochylenie=run_pochylenie+sin(degtorad(mamamija2))/3;mamamija2+=2.5}
run_promien=0

if mamamija=1 {
for(i=0;i<8;i+=1)
    {
    draw_set_blend_mode(bm_add)
    draw_sprite_ext(s_map_gwiazdker,0,x+sin(degtorad(mamamija2+i*45))*(40*min(1,mamamija2/100)),y+cos(degtorad(mamamija2+i*45))*(20*min(1,mamamija2/100))-(50*min(1,mamamija2/100)),0.75+sin(degtorad(mamamija2*2+i*45))/2,0.75+sin(degtorad(mamamija2*2+i*45))/2,0,c_white,mamamija2/150)
    draw_set_blend_mode(bm_normal)
    }
    
for(i=0;i<8;i+=1)
    {
    draw_sprite_ext(s_map_gwiazdker,0,x+sin(degtorad(mamamija2+i*45))*(40*min(1,mamamija2/100)),y+cos(degtorad(mamamija2+i*45))*(20*min(1,mamamija2/100))-(50*min(1,mamamija2/100)),0.75+sin(degtorad(mamamija2*2+i*45))/5,0.75+sin(degtorad(mamamija2*2+i*45))/5,0,c_white,mamamija2/50)
    }}
    
    if mamamija=1 {
}
}







if animacja=7{
// skok


if size2=1{
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size),schylanie/5+y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size+podskoczenie-20,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15-schylanie*2)*strzelanie+strzelanie2)*size2-240*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+((sin(degtorad(150+kat+globalny_kat))*30/3)*size),y+(cos(degtorad(150+kat+globalny_kat))*30/3)*size+podskoczenie-20,size*size2,-size,((kat+sin(degtorad(run_kat))*run_promien/2-15+jump)*strzelanie+strzelanie2)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(20+kat+globalny_kat))*35/3)*size),y+(cos(degtorad(20+kat+globalny_kat))*35/3)*size+podskoczenie-20,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1+jump)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,sin(degtorad(hamowanie/2))*3+y+sin(degtorad(run_kat))/2+podskoczenie-20,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2+60*size2+sin(degtorad(ogon_merda))*20++ogon_uderzak,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,y+sin(degtorad(run_kat))/2+podskoczenie-20,size*size2,size,kat+sin(degtorad(run_kat))+run_pochylenie*size2+strzelanie2/10,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-22+kat+globalny_kat))*30/3)*size),y+(cos(degtorad(-22+kat+globalny_kat))*30/3)*size+podskoczenie-20,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1-22-jump)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size),y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat))+podskoczenie-20,(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+jump/5+strzelanie2/10)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(180+kat+globalny_kat))*30/3)*size),y+(cos(degtorad(180+kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat))+podskoczenie-20,(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+((sin(degtorad(220+kat+globalny_kat))*40/3)*size),y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size+podskoczenie-20,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+jump)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(220+kat+globalny_kat))*40/3)*size),schylanie/5+y+(cos(degtorad(220+kat+globalny_kat))*40/3)*size+podskoczenie-20,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+strzelanie2/10)*size2-160*size2,c_white,1/alpha_wchodzenie_do_etapu)}
}

if size2=-1{
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+((sin(degtorad(-150-kat+globalny_kat))*30/3)*size),schylanie/5+podskoczenie-20+y+(cos(degtorad(-150-kat+globalny_kat))*30/3)*size,size*size2,size,((kat+sin(degtorad(run_kat))*run_promien/2-15-schylanie*2)*strzelanie+strzelanie2)*size2-240*size2,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+((sin(degtorad(-150-kat+globalny_kat))*30/3)*size),podskoczenie-20+y+(cos(degtorad(-150-kat+globalny_kat))*30/3)*size,size*size2,-size,((kat+sin(degtorad(run_kat))*run_promien/2-15+jump)*strzelanie+strzelanie2)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(-20-kat+globalny_kat))*35/3)*size),y+(cos(degtorad(-20-kat+globalny_kat))*35/3)*size+podskoczenie-20,size*size2,size,(kat+sin(degtorad(run_kat))*run_promien*1+jump)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_ogon[anim],0,x,sin(degtorad(hamowanie/2))*3+y+sin(degtorad(run_kat))/2+podskoczenie-20,size*size2,size,(kat+sin(degtorad(run_kat))+run_pochylenie+strzelanie2/5+sin(degtorad(hamowanie/2))*5)*size2+60*size2+sin(degtorad(ogon_merda))*20++ogon_uderzak,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_chest[anim],0,x,y+sin(degtorad(run_kat))/2+podskoczenie-20,size*size2,size,kat+sin(degtorad(run_kat))+run_pochylenie*size2+strzelanie2/10,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_leg[anim],0,x+((sin(degtorad(+22-kat+globalny_kat))*30/3)*size),y+(cos(degtorad(+22-kat+globalny_kat))*30/3)*size+podskoczenie-20,size*size2,size,(kat-sin(degtorad(run_kat))*run_promien*1-22-jump)*size2,c_white,1)
draw_sprite_ext(global.gfx_mario_head[anim],0,x+((sin(degtorad(-180-kat+globalny_kat))*30/3)*size),y+(cos(degtorad(-180-kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat))+podskoczenie-20,(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie+jump/5+strzelanie2/10)*size2,c_white,1/alpha_wchodzenie_do_etapu)
draw_sprite_ext(global.gfx_mario_mrugacz,0,x+((sin(degtorad(-180-kat+globalny_kat))*30/3)*size),y+(cos(degtorad(-180-kat+globalny_kat))*30/3)*size+sin(degtorad(run_kat))+podskoczenie-20,(0.75+size/4)*size2,(0.75+size/4),(kat+run_pochylenie)*size2,c_white,mrugacz[2]/alpha_wchodzenie_do_etapu)
if niesie=0 {draw_sprite_ext(global.gfx_mario_arm[anim],0,-run_pochylenie*size2/10+x+((sin(degtorad(-220-kat+globalny_kat))*40/3)*size),y+(cos(degtorad(-220-kat+globalny_kat))*40/3)*size+podskoczenie-20,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+jump)*size2+schylak,c_white,1/alpha_wchodzenie_do_etapu)}
if niesie=1 {draw_sprite_ext(global.gfx_mario_arm[anim],0,x+(schylanie/5+(sin(degtorad(-220-kat+globalny_kat))*40/3)*size),schylanie/5+y+(cos(degtorad(-220-kat+globalny_kat))*40/3)*size+podskoczenie-20,size*size2,-size,(180+kat-sin(degtorad(run_kat))*run_promien/2+15+strzelanie2/10)*size2-160*size2,c_white,1/alpha_wchodzenie_do_etapu)}
}
}

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["uzyto bonusu na mapie"]
if uzyto_bonusu_1=1
    {
    SXMS_SFX_PlayExt(44,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)
    uzyto_bonusu_1=2
    uzyto_bonusu_3+=1
    }
if uzyto_bonusu_1=2
    {
    if uzyto_bonusu_2<2 {uzyto_bonusu_2+=0.05}
    uzyto_bonusu_3+=1
    if uzyto_bonusu_3>50 {uzyto_bonusu_3=0;uzyto_bonusu_1=3}
    }
if uzyto_bonusu_1=3
    {
    if uzyto_bonusu_2>0 {uzyto_bonusu_2-=0.05}
    if uzyto_bonusu_2<=0 {uzyto_bonusu_1=0}
    }

    
    
draw_sprite_ext(s_map_glowwer_1,0,x,y-32,sin(uzyto_bonusu_4)*uzyto_bonusu_2,sin(uzyto_bonusu_4)*uzyto_bonusu_2,1,c_white,1)
uzyto_bonusu_4+=0.5

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["DAJ PUNKT RUCHU PRZECIWNIKOM PO RUCHU MARIO // ZABIERZ RUCH JAK MARIO SKUSIL"]
if rusz_przeciwnikami=1
    {
    if instance_number(o_map_atakujacy_przeciwnik)>0
        {
        for (i=0;i<instance_count;i+=1)
            {
            iii=instance_id[i]
            if iii.object_index=o_map_atakujacy_przeciwnik {with(iii){moze_isc+=1}};
            rusz_przeciwnikami=0
            }
        
        
        }
    
    
    
    }
    
if zabierz_ruch_przeciwnikom=1
    {
    zabierz_ruch_przeciwnikom=0
        if instance_number(o_map_atakujacy_przeciwnik)>0
        {
        for (i=0;i<instance_count;i+=1)
            {
            iii=instance_id[i]
            if iii.object_index=o_map_atakujacy_przeciwnik {iii.dotykal=0;iii.moze_isc=0;/*iii.idzie=0*/};
            }
        
        
        }
    
    
    
    
    
    
    
    }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["WEJSCIE DO ETAPU"]
if global.game_over=0 && !triggered_by_enemy=1 && global.chwilowy_stopper<=0 && o_map_sterownik.item_selecting=0 && global.mapa_sterownosc=0 && idzie=0 && global.zycia>=0 && podskocz_po_gameover=0
    {
    // wejscie
    if place_meeting(x,y,o_button_map_1) && global.delayer>=1000 && triggered_by_enemy=0 && global.mario_skusil=0 && idzie=0
    {
    lolox=instance_place(x,y,o_button_map_1)
    global.przenies_do_etapu=0
    with(lolox) {if variable_local_exists("przenies_do_etapu") {global.przenies_do_etapu=przenies_do_etapu}}
    
    ruch_delay+=1
    // WEJSCIE DO KAZDEGO ETAPU PROCZ BONUSOWEGO
    if o_map_sterownik.klickersus=0 && lolox.goto_level<>0 && lolox.bonus_level<>1 && lolox.generuj_statek<>2 && global.map_completed_sequence=0
        {
        if keyboard_check(global.ster_jump) || keyboard_check(global.ster_fire) || keyboard_check(vk_enter) && !instance_exists(o_dialog) && ruch_delay>5
            {
            instance_create(x,y,o_BLANKER_MARIO_HEAD_OUT)
            //SXMS_SFX_PlayExt(10+round(random(3)),(x-view_xview[0])/(view_xview[0]+800),255,0,0,0)
            //SXMS_SFX_PlayExt(19,(x-view_xview[0])/(view_xview[0]+800),255,0,0,0)
            SXMS_SFX_PlayExt(19,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)
            SXMS_SFX_PlayExt(131+round(random(2)),(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)

            
            global.id_of_killed_atacker=0
            no_smoke_po_wejsciu=1
            part_system_depth(global.particle_map_overscreen,-99999999) 
            o_map_sterownik.klickersus=1
            animacja_wchodzenia_do_etapu=1
            global.mario_wszedl_do_etapu=1
            podskocz_po_gameover=1
            podskocznix=-10
            animacja=7
            part_particles_create(global.particle_map_overscreen,x,y,global.part_map_chmurker,3);
            }
        
        }
        
        // WEJSCIE DO BONUSOWEGO ETAPU - JAK NIE JEST PRZESZNIETY
    if o_map_sterownik.klickersus=0 && lolox.goto_level<>0 && lolox.bonus_level=1 && lolox.completed=0 && global.map_completed_sequence=0
        {
        if keyboard_check(global.ster_jump) || keyboard_check(global.ster_fire) || keyboard_check(vk_enter) && !instance_exists(o_dialog) && ruch_delay>5
            {
            instance_create(x,y,o_BLANKER_MARIO_HEAD_OUT)
            SXMS_SFX_PlayExt(19,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)
            SXMS_SFX_PlayExt(131+round(random(2)),(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)
        
            global.id_of_killed_atacker=0
            no_smoke_po_wejsciu=1
            part_system_depth(global.particle_map_overscreen,-99999999) 
            o_map_sterownik.klickersus=1
            animacja_wchodzenia_do_etapu=1
            global.mario_wszedl_do_etapu=1
            podskocz_po_gameover=1
            podskocznix=-10
            animacja=7
            part_particles_create(global.particle_map_overscreen,x,y,global.part_map_chmurker,3);
            }
        
        }
    }
    }
    



    
    
    if animacja_wchodzenia_do_etapu=1 && global.mario_wszedl_do_etapu=1
        {
        if size>0 {size-=0.01}
        if size<0.45 {alpha_wchodzenie_do_etapu+=0.1+alpha_wchodzenie_do_etapu}
        wlacz_etap_timer+=1
        }
        // potrzas jakas grafika na mapie jak wchodzi do etapu
    if wlacz_etap_timer=40
        {
        if place_meeting(x,y,o_button_map_1)
            {
            koko=instance_place(x,y,o_button_map_1)
            with(koko) {if variable_local_exists("potrzas1") {if potrzas1>100000 {potrzas1.efekter1=100;SXMS_SFX_PlayExt(58,(x-view_xview[0])/(view_xview[0]+800),global.glosnosc_dzwieku,-1,0,0)}}}
            }
        }


        
    if wlacz_etap_timer>100
        {
        if place_meeting(x,y,o_button_map_1)
            {
            koko=instance_place(x,y,o_button_map_1)
            if global.chpoint_lvl_selected<>koko.goto_level {global.mario_ktory_pokonal=koko.id;global.chpoint_id=0;global.chpoint_sublevel=0;global.chpoint_lvl_selected=koko.goto_level}
            if room=global.mario_ktory_pokonal {global.mario_ktory_pokonal=koko.id}
            
            
            
            if global.chpoint_id=0 {
            if koko.goto_level<>0 {room_goto(koko.goto_level)}}
            
            if global.chpoint_id<>0 {
            if koko.goto_level<>0 {room_goto(global.chpoint_sublevel)}}
            
            
            
            }
        
        
        
        
        }

// DnD lib=1 id=605 fn= applies_to=-1 relative=false not=false params=["MARIO WYRZUCONY Z ETAPU // NAGRAJ ZAPIS"]
if global.mario_wszedl_do_etapu=2 && animacja_wyjscia_z_etapu=0 {animacja_wyjscia_z_etapu=1}
if animacja_wyjscia_z_etapu>=1
    {
    animacja_wyjscia_z_etapu+=1
    if animacja_wyjscia_z_etapu=2 {podskocz_po_gameover=1;podskocznix=-7; }
    if podskocz_po_gameover=1 {animacja=5}
    if podskocz_po_gameover=0
        {
        global.mario_wszedl_do_etapu=0;animacja_wyjscia_z_etapu=0
        //pokonal etap
        if global.mario_completed_stage=1 && global.mario_ktory_pokonal.completed=0 {global.mario_ktory_pokonal.completed=1}
        }
    
    
    }
    
    
    
    
    
    
    /*
    
    
    anim_wyjscia_y=0
anim_wyjscia_add=0


#event keypress:46
//room_goto_next()


