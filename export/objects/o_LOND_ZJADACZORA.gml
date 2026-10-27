#event create:0
script_paralax_create()
visible_size=1.5



image_xscale=1
image_yscale=1
image_angle=0
image_alpha=1
dzielnik=1
mnoznik=1
depth=50000
odleglosc_przemijania=4000000
sprite_index=s_blurr
y+=40*4
x-=100


#event draw:0
if ixor<>global.ekran_srodek_x {
    x_przesunieto=0
    if starting=1 {x_przesunieto+=(ixor-view_xview[0]);ixor=view_xview[0]}
    if starting=0 {starting=1;ixor=view_xview[0]}
    x-=x_przesunieto/dzielnik-x_przesunieto*mnoznik
    
    }
if x<view_xview[0]-odleglosc_przemijania*global.ekran_size_act {x=view_xview[0]+view_wview[0]+odleglosc_przemijania*global.ekran_size_act}
if x>view_xview[0]+view_wview[0]+odleglosc_przemijania*global.ekran_size_act {x=view_xview[0]-odleglosc_przemijania*global.ekran_size_act}


if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*visible_size*image_yscale*1.5
    {
    draw_sprite_ext(sprite_index,0,x,y+180,image_xscale,image_yscale,image_angle,c_white,image_alpha)
    draw_sprite_ext(sprite_index,0,x,y,image_xscale,image_yscale,image_angle,c_white,image_alpha)
    }


