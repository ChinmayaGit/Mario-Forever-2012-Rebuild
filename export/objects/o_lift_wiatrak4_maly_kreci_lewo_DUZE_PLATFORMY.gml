#event create:0
kreciuj=0
sampel=0
kat=0
odleglosc=200
for (i=0;i<4;i+=1)
    {
    dodo[i]=instance_create(x,y,obj_lift_duza)
    dodo[i].rodzaj=100
    }


#event step:0
if global.pauza=0
    {

    kat+=0.25
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
        x+sin(degtorad(kat+i*90))*odleglosc/1.33333,
        y+cos(degtorad(kat+i*90))*odleglosc/1.33333
        ,1,1,0,c_white,1)
        }
        
        
    for(i=0;i<4;i+=1)
        {
        draw_sprite_ext(s_krazek_1,0,
        x+sin(degtorad(kat+i*90))*odleglosc/4,
        y+cos(degtorad(kat+i*90))*odleglosc/4
        ,1,1,0,c_white,1)
        }
        
        
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


