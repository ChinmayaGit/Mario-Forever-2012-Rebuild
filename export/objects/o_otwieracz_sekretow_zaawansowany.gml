#event create:0
aktywuj=0
przyciemniacz=1
sekwencja=0

nagraj_x_gracza=0
nagraj_y_gracza=0



/*


for (i=0;i<18;i+=1){
set_tile_secret[0]=10005175+i
tilesy=i
}

lewo=0
prawo=0
gora=0
dol=0

zamknij_jak_przekroczy_o_x=0
zamknij_jak_przekroczy_o_y=0


#event step:0
if global.pauza=0
    {
    // otwieranie na dotyk i otwieranie na "dotkniecie" pozycji x+zamknij_jak_przekroczy_o_x
    if place_meeting(x,y,obj_mario) && sekwencja=0
        {
        sekwencja=1
        nagraj_x_gracza=obj_mario.x
        nagraj_y_gracza=obj_mario.y
        SXMS_SFX_PlayExt(24,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)
        }
    if zamknij_jak_przekroczy_o_x<>0
        {
        if place_meeting(x+zamknij_jak_przekroczy_o_x-40,y,obj_mario) && sekwencja=0
            {
            sekwencja=1
            nagraj_x_gracza=obj_mario.x
            nagraj_y_gracza=obj_mario.y
            SXMS_SFX_PlayExt(24,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0)
            }
        
        
        }
        
        
        
        
        
        
    if sekwencja=1
        {
        if przyciemniacz>0 {przyciemniacz-=0.05}
        if przyciemniacz<=0 {sekwencja=2}
        for(i=0;i<tilesy;i+=1)
            {
            tile_set_alpha(set_tile_secret[i],przyciemniacz)
            }
        }
    if sekwencja=2
        {
        if x<obj_mario.x && !place_meeting(x,y,obj_mario) && lewo=1 {SXMS_SFX_PlayExt(24,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0);sekwencja=3}
        if x>obj_mario.x && !place_meeting(x,y,obj_mario) && prawo=1 {SXMS_SFX_PlayExt(24,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0);sekwencja=3}
        
        
        if zamknij_jak_przekroczy_o_x<>0
            {
            if zamknij_jak_przekroczy_o_x>0 && obj_mario.x>x+zamknij_jak_przekroczy_o_x {SXMS_SFX_PlayExt(24,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0);sekwencja=3}
            if zamknij_jak_przekroczy_o_x<0 && obj_mario.x<x+zamknij_jak_przekroczy_o_x {SXMS_SFX_PlayExt(24,((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0);sekwencja=3}
            }
        }
    if sekwencja=3
        {
        if przyciemniacz<1 {przyciemniacz+=0.05}
        if przyciemniacz>=1 {sekwencja=0}
        for(i=0;i<tilesy;i+=1)
            {
            tile_set_alpha(set_tile_secret[i],przyciemniacz)
            }
        }
    }


