if ixor<>global.ekran_srodek_x {
    x_przesunieto=0
    if starting=1 {x_przesunieto+=(ixor-view_xview[0]);ixor=view_xview[0]}
    if starting=0 {starting=1;ixor=view_xview[0]}
    x-=x_przesunieto/dzielnik-x_przesunieto*mnoznik
    
    }
if x<view_xview[0]-odleglosc_przemijania*global.ekran_size_act {x=view_xview[0]+view_wview[0]+odleglosc_przemijania*global.ekran_size_act}
if x>view_xview[0]+view_wview[0]+odleglosc_przemijania*global.ekran_size_act {x=view_xview[0]-odleglosc_przemijania*global.ekran_size_act}
    
    
    
if x>view_xview[0]-80*global.ekran_size_act && x<view_xview[0]+view_wview[0]+80*global.ekran_size_act {
x=xstart+view_xview[0]
for(i=0;i<ceil(room_height/151)+1;i+=1)
    {
    draw_sprite_ext(global.lava_falling,0,x+global.ekran_size_act*(x-view_xview[0])-(x-view_xview[0]),151*i-151+stream,image_xscale,1,0,c_white,image_alpha)
    
    }    
    stream+=151/50
    if stream>151 {stream-=151}
    
    }
