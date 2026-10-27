#event create:0
bujalnik=1
image_xscale=4
image_yscale=3


/*

kat=0
step_x=0
kat2=0
step_y=0
rodzaj=0


#event step:2
if global.pauza=0 {

// platforma ustawiana, ustalanie odgownie ruszania platformy
if rodzaj=1
    {
    rodzaj=2
    }
if rodzaj=2
    {
    kat2+=bujalnik
    x+=sin(degtorad(kat))*step_x
    y+=cos(degtorad(kat2))*step_y
    
    
    if place_meeting(x,y-5,obj_mario)
        {
            obj_mario.y+=cos(degtorad(kat2))*step_y
            with(obj_mario)
                {
                for (i=0;i<20;i+=1)
                    {
                    if place_meeting(x,y,o_desert_moving_rock_parental) {y-=1}
                    }
                
                }
            
            
            }
        }
    }



#event draw:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*1.4
    {
    draw_sprite_ext(global.ruchoma_platforma_2,0,x,y,1,1,0,c_white,1)
    
    
    }


