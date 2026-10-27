#event create:0
collected=0
ciurp=0
timer=0


#event step:0
if global.pauza=0 && instance_number(o_magic_chest_duel_spawn)=0
    {

    timer+=1000
    ciurp+=1
    o_koniec_etapu.local_global=9999999
    if timer>=500 && global.time>0 {global.time-=1;global.punkty+=100;if ciurp>5 {ciurp=0;SXMS_SFX_PlayExt(108,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)}}
    if timer>=500 && global.time>20 {global.time-=10;global.punkty+=1000
    }
    
    
    
    
    
    
    }


