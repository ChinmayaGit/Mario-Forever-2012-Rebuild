#event create:0
kreciuj2=0

stopper=0
sampel=0
kreciuj=0
krec=0

kat=0

for (i=0;i<2;i+=1)
    {
    dodo[i]=instance_create(x,y,obj_lift)
    dodo[i].rodzaj=101
    dodo[i].nalezydo=id
    }
    
    
    

odleglosc=100



dodo[0].doceluj_x=x+sin(degtorad(kat+90))*odleglosc
dodo[0].doceluj_y=y+cos(degtorad(kat+90))*odleglosc
            
dodo[1].doceluj_x=x+sin(degtorad(kat+270))*odleglosc
dodo[1].doceluj_y=y+cos(degtorad(kat+270))*odleglosc


#event step:0
    if global.pauza=0
        {
        
            if krec=1{
    if obj_mario.x>x {if kat>-90 {kat-=2;kreciuj2-=5};}
    if obj_mario.x<x {if kat<90 {kat+=2;kreciuj2+=5}};krec=0}
    
    
    
    
    
    
    
    
dodo[0].doceluj_x=x+sin(degtorad(90))*odleglosc
dodo[0].doceluj_y=y+cos(degtorad(kat+90))*odleglosc/1.3
            
dodo[1].doceluj_x=x+sin(degtorad(270))*odleglosc
dodo[1].doceluj_y=y+cos(degtorad(kat+270))*odleglosc/1.3


       
        }


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.4 {
draw_sprite_ext(global.cogweel2,0,x+60-100-60,y-105+30,20,1,0,c_white,1)


draw_sprite_ext(global.cogweel2,0,x+80-180,y-105+20,sin(degtorad(kat))*odleglosc/1.3/10+9,1,-90,c_white,1)
draw_sprite_ext(global.cogweel2,0,x+280-180,y-105+20,sin(degtorad(kat+180))*odleglosc/1.3/10+9,1,-90,c_white,1)


draw_sprite_ext(global.cogweel,0,x-100,y-80,1,1,kreciuj2,c_white,1)
draw_sprite_ext(global.cogweel,0,x+100,y-80,1,1,kreciuj2,c_white,1)



}


