#event create:0
image_alpha=0
instance_create(x-1231,y-1231,o_facebook_cursor)
klik=0
wielkosc=1


#event draw:0
x=view_xview[0]+150*global.ekran_size_act
y=view_yview[0]+540*global.ekran_size_act

background_foreground[3]=0
draw_sprite_ext(global.title_facebook,0,view_xview[0]+150*global.ekran_size_act,view_yview[0]+560*global.ekran_size_act,wielkosc*global.ekran_size_act,wielkosc*global.ekran_size_act,0,c_white,image_alpha)

draw_set_blend_mode(bm_add)
draw_sprite_ext(global.title_facebook,0,view_xview[0]+150*global.ekran_size_act,view_yview[0]+560*global.ekran_size_act,wielkosc*global.ekran_size_act,wielkosc*global.ekran_size_act,0,c_white,-1+wielkosc)
draw_set_blend_mode(bm_normal)

if !mouse_check_button_pressed(mb_left) {klik=0}



if image_alpha<1 {image_alpha+=0.01}



if place_meeting(x,y,o_facebook_cursor)
    {
    if wielkosc<1.2 {wielkosc+=0.025}
    if mouse_check_button_pressed(mb_left) && klik=0 {klik=1;execute_shell("http://www.facebook.com/pages/Super-Mario/174360892584288",0)}
    }
    
if !place_meeting(x,y,o_facebook_cursor)
    {
    if wielkosc>1 {wielkosc-=0.025}
    }


