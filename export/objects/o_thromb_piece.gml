#event create:0
grawitacja=0
lifetime=20+random(100)
obracacz=random(10)-random(10)
wielkosc=0.4+random(0.6)
image_xscale=wielkosc
image_yscale=wielkosc


#event step:0
if global.pauza=0
    {
    
    grawitacja+=0.5
    lifetime-=1
    y+=grawitacja
    image_angle+=obracacz
    
    if lifetime<=10 {image_alpha-=0.1}
    if image_alpha<=0 {instance_destroy()}
    
    
    
    
    }


