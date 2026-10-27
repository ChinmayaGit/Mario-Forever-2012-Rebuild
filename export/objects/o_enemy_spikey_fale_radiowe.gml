#event create:0
leci=0
zywotnosc=40
image_alpha=0.5


#event step:0
if global.pauza=0
    {
    if leci<>0 {x+=leci; leci=leci/1.1}
    if leci>-0.01 && leci<0.01 {leci=0}
    if zywotnosc>0 {zywotnosc-=1}
    if zywotnosc<=0 {instance_destroy()}
    if zywotnosc<20 {image_alpha=image_alpha/1.2}
    }


