#event create:0
kefir=0
kefir2=0

efe=0
efe2=0

stream=random(360)


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.2 {
draw_sprite_ext(global.fx_water_1,0,x+sin(degtorad(stream/5))*40,y,1+sin(degtorad(stream))/10,1-sin(degtorad(stream))/10,sin(degtorad(stream/5))*10,c_white,sin(degtorad(stream/4))/5+0.2)
stream+=1
}




