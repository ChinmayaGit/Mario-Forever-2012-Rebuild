#event create:0
wielkosc=0.6
dodawator=0

o_plansza_autora.timer+=1
timer=0


#event draw:0
obj_mario_anim.animacja=6

if global.english_or_polish=1 {
    i=0
    timer+=1
    kuku=20+dodawator*10
    draw_set_font(global.map_fonts_1)
    draw_set_color(c_white)
    draw_set_alpha(1)
    draw_set_halign(fa_center)
    draw_set_valign(fa_middle)
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"Witam Cię serdecznie drogi graczu!",wielkosc,wielkosc,0)i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"Grę New Super Mario Forever 2012",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"stworzyłem dla wszystkich fanów",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"gry Super Mario Bros!",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"Gra jest darmowa i nieodpłatna.",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"Pozdrawiam Polaków, Michał Gdaniec!",wielkosc,wielkosc,0);i+=1
    wielkosc+=0.001
    dodawator+=0.0005
    
    if timer>400 {room_goto_next()}
    }
    
    
    obj_mario_anim.animacja=6

if global.english_or_polish=0 {
    i=0
    timer+=1
    kuku=20+dodawator*10
    draw_set_font(global.map_fonts_1)
    draw_set_color(c_white)
    draw_set_alpha(1)
    draw_set_halign(fa_center)
    draw_set_valign(fa_middle)
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"Hello there!",wielkosc,wielkosc,0)i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"You are about to play ",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"New Super Mario Forever 2012!",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"Game have been made by one person",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"by Michal Gdaniec. This is a fanmade",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"created for free and everybody!!!",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"Have a nice playing time!!",wielkosc,wielkosc,0);i+=1
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"I would like to greet everyone on earth!",wielkosc,wielkosc,0);i+=2
    draw_text_transformed(view_xview[0]+400,view_yview[0]+(200+kuku*i)*(global.ekran_size_act+dodawator),"Michal Gdaniec",wielkosc,wielkosc,0);i+=1
    wielkosc+=0.001
    dodawator+=0.0005
    
    if timer>400 {room_goto_next()}
    }


