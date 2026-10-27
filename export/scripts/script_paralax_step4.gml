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
    draw_sprite_ext(global.gfx_castle_collumn,0,x,y,image_xscale,image_yscale,image_angle+sin(degtorad(stream))*promien_bujania,c_white,image_alpha)
    draw_sprite_ext(global.gfx_castle_collumn,0,x+sin(   degtorad(sin(degtorad(stream)))*promien_bujania +180  )*120,y+cos(degtorad(   degtorad(sin(degtorad(stream)))*promien_bujania +180  ))*230,image_xscale,image_yscale,image_angle+sin(degtorad(stream))*promien_bujania,c_white,image_alpha)
    stream+=szybkosc_bujania
    }
