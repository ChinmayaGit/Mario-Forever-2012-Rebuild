#event create:0
size=0.1
uszybszacz=0

alphar=1


#event draw:0
draw_set_color(c_black)
draw_set_alpha(1)

x=view_xview[0]+view_wview[0]/2
y=view_yview[0]+view_hview[0]/2



draw_sprite_ext(global.blanker_1,0,x,y,size,size,0,c_white,1)


draw_rectangle(x-size*100,view_yview[0],x+size*100,y-size*100,0)
draw_rectangle(x+size*100-1,view_yview[0],view_xview[0]+view_wview[0],view_yview[0]+view_hview[0],0)
draw_rectangle(view_xview[0],view_yview[0],x-size*100,view_yview[0]+view_hview[0],0)
draw_rectangle(x-size*100,y+size*100-2,x+size*100,view_yview[0]+view_hview[0],0)



draw_sprite_ext(global.blanker_2,0,x,y,size,size,0,c_white,alphar)
if size>1 {alphar=alphar/1.3}



if size<20 {size+=0.01+size*(1.55+uszybszacz)/(50+uszybszacz*30)}
if size>=20 {instance_destroy()}
uszybszacz+=0.55



