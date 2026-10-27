#event create:0
stopper=0
sampel=0
kreciuj=0
krec=0

kat=0

for (i=0;i<4;i+=1)
    {
    dodo[i]=instance_create(x,y,obj_lift)
    dodo[i].rodzaj=101
    dodo[i].nalezydo=id
    }
    
    
    

odleglosc=100


#event step:0
if global.pauza=0
    {
    sampel+=abs(kreciuj)
    if sampel>20{
    sampel=0
    SXMS_SFX_PlayExt(115,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)}
    kreciuj=kreciuj/1.01
    

    if krec=1{
    if obj_mario.x>x {kreciuj+=(x-obj_mario.x)/2000}
    if obj_mario.x<x {kreciuj+=(x-obj_mario.x)/3000};krec=0}
    
    if kreciuj<0 && place_meeting(x-kreciuj*2,y,o_lift_blocker_odbijacz) {kreciuj=0}
    if kreciuj>0 && place_meeting(x-kreciuj*2,y,o_lift_blocker_odbijacz) {kreciuj=0}
    
    if kreciuj<0 && !place_meeting(x-kreciuj*2,y,o_lift_blocker_odbijacz) {x-=kreciuj/2;kat+=kreciuj}
    if kreciuj>0 && !place_meeting(x-kreciuj*2,y,o_lift_blocker_odbijacz) {x-=kreciuj/2;kat+=kreciuj}
    
    
    
    for(i=0;i<4;i+=1)
        {
        dodo[i].doceluj_x=x+sin(degtorad(kat+i*90))*odleglosc
        dodo[i].doceluj_y=y+cos(degtorad(kat+i*90))*odleglosc
        }
    
    
    
    
    
    }
    
    
    






/*kat=0
odleglosc=0
for (i=0;i<4;i+=1)
    {
    dodo[i]=instance_create(x,y,obj_lift)
    dodo[i].rodzaj=100
    }


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.5 {



        draw_sprite_ext(s_krazek_1,0,x,y,1,1,0,c_white,1)

    for(i=0;i<4;i+=1)
        {
        draw_sprite_ext(s_krazek_1,0,
        x+sin(degtorad(kat+i*90))*odleglosc/2,
        y+cos(degtorad(kat+i*90))*odleglosc/2
        ,1,1,0,c_white,1)
        }
        
    for(i=0;i<4;i+=1)
        {
        draw_sprite_ext(s_krazek_1,0,
        x+sin(degtorad(kat+i*90))*odleglosc,
        y+cos(degtorad(kat+i*90))*odleglosc
        ,1,1,0,c_white,1)
        }
        
        
}


