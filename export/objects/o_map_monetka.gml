#event create:0
koko=random(99)


#event draw:0
koko+=0.1

draw_sprite_ext(global.gfx_coin,0,x,y,abs(sin(koko))/2,0.5,0,c_white,1)


