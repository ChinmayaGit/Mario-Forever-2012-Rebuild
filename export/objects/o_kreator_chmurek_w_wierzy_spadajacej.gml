#event step:0
if global.pauza=0
    {
    if obj_mario.y>1000 && obj_mario.sekwencja=1 && obj_mario.y<room_height-1000 && obj_mario.grawitacja>10
        {
        if random(100)>75 {instance_create(x+random(view_wview[0]),view_yview[0]+view_hview[0]+100,o_random_static_cloud)}
        
        
        }
    
    
    
    
    }


