#event create:0
script_paralax_create()
visible_size=2
sprite_index=global.lava_rock_paralax

stream=random(360)
stream_range=random(20)






script_paralax_create()
visible_size=1.5

nagraj=0

wyrownaj_x=0



setter_y=0
adejmowacz_y=view_yview[0]
modyfiker_y=0


#event draw:0
script_paralax_step()

stream+=0.1
image_angle=sin(degtorad(stream))*stream_range
y+=sin(degtorad(stream*10))


