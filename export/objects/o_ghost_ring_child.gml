#event create:0
stream=0
rozdeptywalny=0
energy=19999999
niezjadywalny=1 // zmienna ktora chroni przeciwnika przed zjedzeniem
kierunek=1
gwiazdker=0


#event draw:0
if global.pauza=0{
// gfx
stream+=0.25
}





if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<global.odleglosc_ekranu{
draw_sprite_ext(s_boo_glow,0,x+18,y+18+sin(degtorad(stream*10))*5,1,1,0,c_white,image_alpha)
draw_sprite_ext(s_shy_boo_2,stream,x+18,y+18+sin(degtorad(stream*10))*5,kierunek,1,direction,c_white,image_alpha)


}


