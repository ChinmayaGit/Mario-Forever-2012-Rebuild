#event create:0
stream=random(360)


sekwencja=0
szybkosc=4
ruch_testowy=0



anim=random(360)

image_xscale=1
image_yscale=1




sekwencja=0
ruch_testowy=0
anim=random(360)

grawitacja=0
sekwencja=0
kierunek=1
rozdeptywalny=0
kill=0
seened=0

energy=999999999
gwiazdker=0
niezjadywalny=1



/*
szybkosc=4


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.1 {
draw_sprite_ext(global.nippler_plant_1,0,x+20,y+30,1,1,sin(degtorad(stream*6))*5,c_white,1)

draw_sprite_ext(global.nippler_plant_2,0,x+23,y+20,1,1,sin(degtorad(stream*3))*20,c_white,1)
draw_sprite_ext(global.nippler_plant_3,0,x+17,y+20,1,1,-sin(degtorad(stream*3))*20,c_white,1)

stream+=5
}


