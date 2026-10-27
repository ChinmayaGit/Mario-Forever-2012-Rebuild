#event create:0
stream=0


#event draw:0
if x>view_xview[0]-80*global.ekran_size_act && x<view_xview[0]+view_wview[0]+80*global.ekran_size_act {

for(i=0;i<ceil(room_height/151)+1;i+=1)
    {
    draw_sprite_ext(global.lava_falling,0,x,151*i-151+stream,1,1,0,c_white,1)
    
    }    
    stream+=151/50
    if stream>151 {stream-=151}
    
    }


