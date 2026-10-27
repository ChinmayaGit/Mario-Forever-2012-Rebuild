#event create:0
kind=round(random(4))
chmurka=0
stream=random(400)


if kind=0 {chmurka=s_cloud_1}
if kind=1 {chmurka=s_cloud_2}
if kind=2 {chmurka=s_cloud_3;image_xscale=0.75}
if kind=3 {chmurka=s_cloud_5;image_xscale=0.75}
if kind=4 {chmurka=s_cloud_4}


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.2 {

stream+=1
draw_sprite_ext(s_boo_glow,0,x,y,2+sin(degtorad(stream))/20,2+sin(degtorad(stream))/20,0,c_white,1+sin(degtorad(stream))/5)
draw_sprite_ext(chmurka,0,x,y+sin(degtorad(stream/2))*20,image_xscale+sin(degtorad(stream))/10,image_xscale-sin(degtorad(stream))/20,0,c_white,image_alpha)
image_alpha=point_distance(x,y,obj_mario.x,obj_mario.y)/200
}





