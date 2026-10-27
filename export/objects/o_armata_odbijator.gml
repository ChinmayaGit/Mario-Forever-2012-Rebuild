#event create:0
klik=0
pompon=0
stream=0
image_xscale=0.8
image_yscale=0.8


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.2 {

draw_sprite_ext(global.armata_3,0,x,y,1+sin(degtorad(stream))/20*(pompon+1),1-sin(degtorad(stream))/20*(pompon+1),0,c_white,1)



}

if global.pauza=0
    {
    stream+=2+pompon*5
    if pompon>0 {pompon=pompon/1.05}
    
    
    }


