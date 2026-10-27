#event create:0
timer=0
image_alpha=0
wielkosc=0
alll=0


#event draw:0
draw_sprite_ext(s_help_screen,0,x,y,1+wielkosc,1+wielkosc,0,c_white,image_alpha)
wielkosc+=0.001


x=view_xview[0]+view_wview[0]/2
y=view_yview[0]+view_hview[0]/2

timer+=1

if timer<50 && image_alpha<1 {image_alpha+=0.05}
if timer>150 && image_alpha>0 {image_alpha-=0.05}
if timer>200 && image_alpha<=0 {room_goto_next()}

if timer>170
    {
    draw_set_color(c_black)
    draw_set_alpha(alll)
    alll+=0.05
    draw_rectangle(0,0,800,600,0)
    draw_set_alpha(1)
    draw_set_color(c_white)
    
    }




if global.english_or_polish=0 {
    draw_set_font(global.map_fonts_1)
    draw_set_color(c_white)
    draw_set_alpha(image_alpha)
    draw_set_halign(fa_center)
    draw_set_valign(fa_middle)
    draw_text_transformed(x,y+180,"Connect your PC with TV and use Joypad or Joystick",0.5+wielkosc,0.5+wielkosc,0)
    draw_text_transformed(x,y+200,"For real enjoyment!",0.5+wielkosc,0.5+wielkosc,0)
    draw_set_alpha(1)
    }
    
if global.english_or_polish=1 {
    draw_set_font(global.map_fonts_1)
    draw_set_color(c_white)
    draw_set_alpha(image_alpha)
    draw_set_halign(fa_center)
    draw_set_valign(fa_middle)
    draw_text_transformed(x,y+180,"Podłącz komputer do telewizora i joypad!",0.5+wielkosc,0.5+wielkosc,0)
    draw_text_transformed(x,y+200,"Dla naprawdę dobrej zabawy!",0.5+wielkosc,0.5+wielkosc,0)
    draw_set_alpha(1)
    }


