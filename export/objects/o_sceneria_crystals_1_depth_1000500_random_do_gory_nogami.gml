#event create:0
stream=random(360)
kolor=round(random(2))
if kolor=1 {kolor2=c_lime}
if kolor=2 {kolor2=c_yellow}
if kolor=0 {kolor2=c_white}


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.2
    {
    draw_sprite_ext(s_crystals_caveniung,0,x+20,y,1,1,sin(degtorad(stream+10))*20-180,kolor2,1)
    
    stream+=0.175
    }


