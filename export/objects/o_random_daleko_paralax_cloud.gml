#event create:0
kind=round(random(4))
chmurka=0
stream=random(400)


if kind=0 {chmurka=s_cloud_1}
if kind=1 {chmurka=s_cloud_2}
if kind=2 {chmurka=s_cloud_3;image_xscale=0.75}
if kind=3 {chmurka=s_cloud_5;image_xscale=0.75}
if kind=4 {chmurka=s_cloud_4}




script_paralax_create()
visible_size=1.5

wielkosc=random(0.5)

image_xscale=0.2+wielkosc
image_yscale=0.2+wielkosc
image_angle=0
image_alpha=0.5
dzielnik=1.4+y/5000+wielkosc/100
mnoznik=0
depth=60000000-y
odleglosc_przemijania=40000000+wielkosc*1000


kafel=round(random(4))

if kafel=0 {sprite_index=s_hill_2}
if kafel=1 {sprite_index=s_hill_3}
if kafel=2 {sprite_index=s_hill_4}
if kafel=3 {sprite_index=s_hill_5}
if kafel=4 {sprite_index=s_hill_6}



#event draw:0
if ixor<>global.ekran_srodek_x {
    x_przesunieto=0
    if starting=1 {x_przesunieto+=(ixor-view_xview[0]);ixor=view_xview[0]}
    if starting=0 {starting=1;ixor=view_xview[0]}
    x-=x_przesunieto/dzielnik-x_przesunieto*mnoznik
    
    }
if x<view_xview[0]-odleglosc_przemijania*global.ekran_size_act {x=view_xview[0]+view_wview[0]+odleglosc_przemijania*global.ekran_size_act}
if x>view_xview[0]+view_wview[0]+odleglosc_przemijania*global.ekran_size_act {x=view_xview[0]-odleglosc_przemijania*global.ekran_size_act}


if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.2
    {
    stream+=3
    draw_sprite_ext(s_boo_glow,0,x,y+sin(degtorad(stream/2))*10,image_xscale,image_yscale,image_angle,c_white,image_alpha)
    draw_sprite_ext(chmurka,0,x,y+sin(degtorad(stream/2))*10,image_xscale+sin(degtorad(stream))/20,image_yscale-sin(degtorad(stream))/20,image_angle,c_white,image_alpha)
    }
    
    
    
    
    

/*if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.2 {

stream+=4
draw_sprite_ext(s_boo_glow,0,x,y,2+sin(degtorad(stream))/20,2+sin(degtorad(stream))/20,0,c_white,1+sin(degtorad(stream))/5)
draw_sprite_ext(chmurka,0,x,y+sin(degtorad(stream/2))*20,image_xscale+sin(degtorad(stream))/10,image_xscale-sin(degtorad(stream))/20,0,c_white,image_alpha)
image_alpha=point_distance(x,y,obj_mario.x,obj_mario.y)/200
}





