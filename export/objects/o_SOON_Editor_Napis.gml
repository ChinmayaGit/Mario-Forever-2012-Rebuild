#event create:0
    
    alphar=0
    dodawacz1=0
    dodawacz_promien1=0
    napis=""
    timer=0


#event draw:0
    if global.english_or_polish=0 {
    napis="SOON IN NEW VERSION!"

    }
    
    if global.english_or_polish=1 {
    napis="JUŻ NIEDŁUGO W NOWEJ WERSJI!"}
 dodawacz_promien1=0.2
    dodawacz1+=5
    
    if timer<60 {if alphar<1 {alphar+=0.1}}
    if timer>=60 {alphar=alphar/1.1;if alphar<=0.01 {instance_destroy()}}
    timer+=1
    
    draw_set_color(c_black)
    draw_set_alpha(alphar/4)
    draw_rectangle(view_xview[0]+view_wview[0]/2-250*global.ekran_size_act,view_yview[0]+view_hview/2-50*global.ekran_size_act+sin(degtorad(dodawacz1))*dodawacz_promien1*global.ekran_size_act*60,view_xview[0]+view_wview[0]/2+250*global.ekran_size_act,view_yview[0]+view_hview/2+50*global.ekran_size_act-sin(degtorad(dodawacz1))*dodawacz_promien1*global.ekran_size_act*60,0)
    draw_rectangle(view_xview[0]+view_wview[0]/2-250*global.ekran_size_act+sin(degtorad(dodawacz1))*dodawacz_promien1*global.ekran_size_act*60,view_yview[0]+view_hview/2-50*global.ekran_size_act,view_xview[0]+view_wview[0]/2+250*global.ekran_size_act-sin(degtorad(dodawacz1))*dodawacz_promien1*global.ekran_size_act*60,view_yview[0]+view_hview/2+50*global.ekran_size_act,0)
    draw_set_alpha(1)
    
    draw_set_font(global.map_fonts_1)
    draw_set_color(c_white)
    draw_set_alpha(alphar)
    draw_set_halign(fa_center)
    draw_set_valign(fa_middle)
    draw_text_transformed(view_xview[0]+view_wview[0]/2,view_yview[0]+view_hview/2,napis,1*global.ekran_size_act+sin(degtorad(dodawacz1))*dodawacz_promien1*global.ekran_size_act,1*global.ekran_size_act+sin(degtorad(dodawacz1))*dodawacz_promien1*global.ekran_size_act,0)
    draw_set_alpha(1)


