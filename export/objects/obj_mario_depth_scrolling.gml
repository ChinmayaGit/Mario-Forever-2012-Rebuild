#event create:0
xscrooling_ixor=0


#event draw:0
xscrooling_ixor-=10

for(i=0;i<5;i+=1) {
if xscrooling_ixor<-200 {xscrooling_ixor+=200};draw_sprite_ext(s_back_clouds,0,view_xview[0]+i*200+xscrooling_ixor,view_yview[0]+360,1,1,0,c_white,1)}



