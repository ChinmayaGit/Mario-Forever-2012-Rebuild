#event create:0
promien=random(999)
downed=0
kicked=0
destroy=1
bump=0
bump2=0
bump3=0
bymp4=0
killed=0

depth=-y-x

#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.1 {


draw_sprite_ext(global.gfx_point_block_e,0,x+20,y+20,1,1,bump2,c_white,1)


if global.graphics>=1{
promien+=0.2
}

if global.pauza=0{
}




} // end of deactivator




