#event create:0
kartofel=-2000
sekwencja=0
timer=0
stream=0
efekter=0


#event draw:0
draw_sprite_ext(global.gfx_check_point,0,view_xview[0]+view_wview[0]/7+kartofel,
view_yview[0]+view_hview[0]/1.2,1.5+sin(stream)/20+sin(stream)/5,1.5-sin(stream)/20+sin(stream)/5,sin(stream)/20-30+sin(stream/2)*10,c_white,1)


if global.pauza=0
    {
    
    
    stream+=0.1
    if sekwencja=0 {kartofel=kartofel/1.3}
    if sekwencja=0 && kartofel>=-1 {sekwencja=1; kartofel=0}
    if sekwencja=1 {timer+=1;if timer>50 {sekwencja=2;timer=0}}
    if sekwencja=2 {kartofel-=10;kartofel=kartofel*1.01}
    if sekwencja=2 && kartofel<=-2500 {instance_destroy()}
    }


