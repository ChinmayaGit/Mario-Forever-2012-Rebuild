#event create:0
script_paralax_create()
visible_size=2
stream=random(10)



image_xscale=3
image_yscale=3
image_angle=0
image_alpha=0.75
dzielnik=1
mnoznik=1
depth=-1000
odleglosc_przemijania=4000001


#event draw:0
    draw_sprite_ext(sprite_index,0,view_xview[0]+400*global.ekran_size_act,view_yview[0]+200*global.ekran_size_act,3+sin(stream)/8,3-sin(stream)/8,sin(stream)*2,c_white,abs(sin(stream)))
    stream+=0.005


