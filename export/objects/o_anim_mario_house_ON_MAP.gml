#event create:0
stream=0
ustaw_mario_w_prawo=0


sekwencja=0
wielkosciownik=1


#event step:0
stream+=0.05
image_xscale=1+sin(stream)/100
image_yscale=1-sin(stream)/100
image_angle=sin(stream/4)

    
    
    
    if obj_mario.x>5500 {obj_mario.x=5500}
    if obj_mario.x<200 {obj_mario.x=200}


