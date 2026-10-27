if ixor<>global.ekran_srodek_x {
    x_przesunieto=0
    if starting=1 {x_przesunieto+=(ixor-view_xview[0]);ixor=view_xview[0]}
    if starting=0 {starting=1;ixor=view_xview[0]}
    x-=x_przesunieto/dzielnik-x_przesunieto*mnoznik
    
    }
if x<view_xview[0]-odleglosc_przemijania*global.ekran_size_act {x=view_xview[0]+view_wview[0]+odleglosc_przemijania*global.ekran_size_act}
if x>view_xview[0]+view_wview[0]+odleglosc_przemijania*global.ekran_size_act {x=view_xview[0]-odleglosc_przemijania*global.ekran_size_act}


if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*visible_size
    {
    draw_sprite_ext(sprite_index,0,x,y,image_xscale+sin(stream)/8,image_yscale-sin(stream)/8,sin(stream)*2,c_red,0.5+abs(sin(stream))/4)
    stream+=0.005
    }
