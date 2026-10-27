#event create:0
life=0


#event draw:0
draw_set_color(c_black)
draw_set_alpha(life)
draw_rectangle(view_xview[0],view_yview[0],view_xview[0]+view_wview[0],view_yview[0]+view_hview[0],0)
draw_set_alpha(1)
life+=0.02
if life>=5 {instance_destroy()}


