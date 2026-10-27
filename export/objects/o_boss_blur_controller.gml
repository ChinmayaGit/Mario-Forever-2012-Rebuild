#event create:0
/*
set_automatic_draw(false);
b=surface_create(room_width*2,room_height);
if(!surface_exists(b))
instance_destroy();
frames=10;
distance=10
level=0
bg_dir=0

x=0
y=0
image_alpha=0
image_speed=0.15
bg_flash=0
stage=0
amount=1
my_color=c_white
color2=c_white
global.add=0
global.gameover=0
global.easy=0
global.restart=0
global.time=0
global.invincible=0
global.safe=1


global.hitx=1000
global.hity=1000


#event step:0
/*

surface_set_target(b);
screen_redraw();

if(distance>0)
{
draw_radial_blur(distance,global.hitx,global.hity,frames);
}
surface_reset_target();


draw_surface_ext(b,0,0,1,1,0,c_white,1)
if(distance>0)
draw_radial_blur(distance,global.hitx,global.hity,frames)

screen_refresh();


if distance>0 
{
distance-=2
view_wview[0]=800-random(distance)+random(distance)
view_xview[0]=(800-view_wview[0])*0.5
view_hview[0]=600-random(distance)+random(distance)
view_yview[0]=(600-view_hview[0])*0.5
view_angle[0]=random(distance*0.1)-random(distance*0.1)
draw_set_blend_mode(bm_subtract)
draw_circle_color(global.hitx,global.hity,800,c_black,make_color_hsv(0,0,distance),0)
draw_set_blend_mode(bm_normal)
}
else distance=0

global.hitx=mouse_x
global.hity=mouse_y












