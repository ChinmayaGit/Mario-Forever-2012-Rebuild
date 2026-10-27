#event create:0
animowanie=0
wylatuje=0

iyor=15

obrotnis=0
animer=0


sounder=0


#event draw:0
draw_set_blend_mode(bm_add)
draw_sprite_ext(s_bonus_efekter,1,x+15,y+15,1.2,1.2,animowanie/10,c_white,0.4)
draw_set_blend_mode(bm_normal)

draw_sprite_ext(s_bonus_listek,1,x+15,y+15,1,1,-obrotnis+cos(degtorad(animer))*40,c_white,1)

if global.pauza=0
    {
    if sounder<20 {sounder+=1}
    if sounder=15 {sounder=100;SXMS_SFX_PlayExt(40,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)}
    
    
    animowanie+=5
    if obrotnis<90 {obrotnis+=2}
    
    if wylatuje=0 {y-=iyor;iyor=iyor/1.1}
    if iyor<=0.1 && wylatuje=0 {wylatuje=1;instance_create(x,y,o_bonus_ring_effect)}
    if wylatuje=1
        {
        x+=sin(degtorad(animowanie/2.5))*2
        y+=1
        animer+=2.5
        }
        
    
    if x>view_xview[0]+1040 || x<view_xview[0]-240 || y>view_yview[0]+1040 || y<view_yview[0]-240 {instance_destroy()}
    
    
    }


    
    


