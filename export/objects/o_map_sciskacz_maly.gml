#event create:0
stream=random(256)
randomer=random(10)+0.05
randomex=random(0.5)
kierunek=1
depth=-y

mrugacz=0
mrugacz2=0
wielkosc_x=0


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.1 {
stream+=randomer/100
y+=sin(stream)/10





    draw_sprite_ext(s_map_minisciskacz,0,x,y,-randomex+1.00+wielkosc_x/2-sin(stream/2)/30,-randomex+1.00-wielkosc_x/2+sin(stream/2)/30,-hspeed*5-vspeed*5,c_white,1/1.5)

}


