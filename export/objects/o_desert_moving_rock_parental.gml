#event create:0
bujalnik=1
grafika=round(random(2))
if grafika=0 {sprite_index=s_desert_rock_1}
if grafika=1 {sprite_index=s_desert_rock_2}
if grafika=2 {sprite_index=s_desert_rock_3}

cien=instance_create(x,y,o_desert_rock_cien)
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
        
        
        cien.x=x
        cien.y=y
        cien.depth=depth+10
    }



