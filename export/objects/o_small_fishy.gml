#event create:0
stream=random(360)
szybkosc=0.3+random(0.5)
sekwencja=0
timer=0
dzielnik=1
obrot=1

zmniejszy_rybke=1+random(0.5)

kolorek=round(random(2))
if kolorek=0 {kolorek=c_white}
if kolorek=1 {kolorek=c_yellow}
if kolorek=2 {kolorek=c_orange}


#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1 {
if sekwencja=0
    {
    if obrot<1 {obrot+=0.1}
    x-=szybkosc/dzielnik
    stream+=0.5
    timer+=1
    if timer>=500 {timer=0;sekwencja=1}
    if timer>=400 {dzielnik+=1}
    if timer<=400 && dzielnik>1 {dzielnik-=1}
    }
    
if sekwencja=1
    {
    if obrot>-1 {obrot-=0.1}
    x+=szybkosc/dzielnik
    stream+=0.5
    timer+=1
    if timer>=500 {timer=0;sekwencja=0}
    if timer>=400 {dzielnik+=1}
    if timer<=400 && dzielnik>1 {dzielnik-=1}
    }
        
    draw_sprite_ext(global.small_fishashy,0,x+sin(degtorad(stream))*10,y,obrot/zmniejszy_rybke,1/zmniejszy_rybke,sin(degtorad(stream*20))*10,kolorek,1)}


