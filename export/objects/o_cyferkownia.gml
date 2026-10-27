#event create:0
wartosc=0
life=40
iyor=10
image_alpha=1
napis=""
koloruj=0
stream=0


#event draw:0
if global.pauza<=100
    {
    y-=iyor
    iyor=iyor/1.3
    life-=1
    if life<=0 {image_alpha-=0.1}
    if image_alpha<=0 {instance_destroy()}
    }

if koloruj=0{
draw_set_font(global.font)
draw_set_alpha(image_alpha)
draw_set_color(c_white)
draw_set_halign(fa_center)
draw_set_valign(fa_middle)
if napis="" {draw_text_ext_transformed(x,y,string(wartosc),0,0,0.75+life/200,0.75+life/200,0)}
if napis<>"" {draw_text_ext_transformed(x,y,napis,0,0,0.75+life/200,0.75+life/200,0)}}


if koloruj=1{
draw_set_font(global.font)
draw_set_alpha(image_alpha)
draw_set_color(c_white)
draw_set_halign(fa_center)
draw_set_valign(fa_middle)
if napis=""
    {
    stream+=0.1
    draw_text_ext_transformed(x,y,string(wartosc),0,0,1+life/200,1+life/200,sin(stream)*10)
    
    draw_set_color(c_red)
    draw_set_blend_mode(bm_add)
    draw_text_ext_transformed(x,y,string(wartosc),0,0,1+life/200+0.5,1+life/200+0.5,sin(stream)*10)
    draw_set_blend_mode(bm_normal)
    }
if napis<>"" {draw_text_ext_transformed(x,y,napis,0,0,0.75+life/200,1+life/200,0)}}


