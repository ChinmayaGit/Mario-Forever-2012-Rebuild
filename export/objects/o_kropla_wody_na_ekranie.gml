#event create:0
wielkosc_kropli=0.2+random(0.8)
wielkosc_aktual=0
xore=random(800)
yore=random(600)
sekwencja=0
szybkosc=0
przezroczystosc=0


timer=0
timer_losowy=random(300)
szybkosc_kropli=random(1.5)
szybkosc_y=0


y_losowy_promien=random(1)+1
y_losowy_adder=random(360)


#event draw:0
draw_set_blend_mode(bm_add)
draw_sprite_ext(global.water_drop,0,view_xview[0]+xore*global.ekran_size_act,view_yview[0]+yore*global.ekran_size_act+szybkosc_y*global.ekran_size_act,wielkosc_aktual,wielkosc_aktual,0,c_white,przezroczystosc)
draw_set_blend_mode(bm_normal)
if obj_mario.watered<>1 {sekwencja=2;}
if sekwencja=0
    {
    if przezroczystosc<1 {przezroczystosc+=0.2}
    if przezroczystosc>=1 {sekwencja=1}
    }
if sekwencja=1
    {
    timer+=1
    if timer>timer_losowy {sekwencja=2}
    
    szybkosc_y+=szybkosc_kropli+abs(sin(degtorad(y_losowy_adder))*y_losowy_promien)
    y_losowy_adder+=5
    
    }
if sekwencja=2
    {
    przezroczystosc=przezroczystosc/1.03
    if przezroczystosc<=0.01 {instance_destroy()}
    
    szybkosc_y+=szybkosc_kropli+abs(sin(degtorad(y_losowy_adder))*y_losowy_promien)
    y_losowy_adder+=5
    }
    
    
    
if wielkosc_aktual<wielkosc_kropli {wielkosc_aktual+=0.1}
if wielkosc_aktual>wielkosc_kropli {wielkosc_aktual=wielkosc_kropli}


/*

y_losowy_promien=random(1)+1
y_losowy_adder=random(360)


sekwencja=0
szybkosc=0
przezroczystosc=0


wielkosc_kropli=0.2+random(0.8)
wielkosc_aktual=0

timer=0
timer_losowy=random(300)


