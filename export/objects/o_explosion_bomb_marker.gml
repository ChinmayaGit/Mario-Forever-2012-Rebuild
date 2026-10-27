#event create:0
life=0

#event step:0
if global.pauza=0
    {
    if life>0 {instance_destroy()}
    life+=1
    }

