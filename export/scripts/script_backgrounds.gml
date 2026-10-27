


// USTAW OGNISTY GROUND

if global.background_kind=75
    {
    background_visible[0]=1
    background_index[0]=global.background_lavas_ground
    global.background_kind=76
    }
if global.background_kind=76
    {
    if random(100)>90 {part_particles_create(global.particle_sys_1,view_xview[0]+random(1000)*global.ekran_size_act,room_height-random(100),global.lavar2,1)}
    background_x[0]=view_xview[0]
    background_y[0]=view_yview[0]
    background_xscale[0]=1*global.ekran_size_act
    background_yscale[0]=1*global.ekran_size_act
    }


// USTAW PODWODE
if global.background_kind=19
    {
    background_visible[0]=1
    background_index[0]=global.background_grassland
    
    background_index[6]=global.background_underwater
    background_visible[6]=1
    background_x[6]=0
    background_y[6]=5925+490
    background_htiled[6]=1
    background_vtiled[6]=0
    background_alpha[6]=0.85
    background_yscale[6]=2.4
    
    background_index[3]=global.background_underwater3
    background_visible[3]=1
    background_x[3]=0
    background_y[3]=5925
    background_htiled[3]=1
    background_vtiled[3]=0
    background_yscale[3]=8
    background_alpha[3]=0.85
    
    
    background_index[7]=global.background_underwater2
    background_visible[7]=1
    background_x[7]=0
    background_y[7]=view_yview[0]
    background_htiled[7]=1
    background_vtiled[7]=0
    
    background_htiled[0]=1
    background_vtiled[0]=0

    
    global.background_kind=20
    }
if global.background_kind=20
    {    
    ruszanie_podwodna_woda-=0.5
    background_y[0]=view_yview[0]
    background_alpha[7]=0.85+sin(ruszanie_podwodna_woda/50)/5
    background_yscale[7]=2
    background_xscale[7]=2

    background_x[7]=ruszanie_podwodna_woda*2+sin(degtorad(ruszanie_podwodna_woda))*50
    background_y[7]=room_height-280*2
    
    background_y[3]=5925-70
    background_x[3]=ruszanie_podwodna_woda
    background_x[6]=ruszanie_podwodna_woda
    background_x[0]=view_xview[0]
    
    background_xscale[0]=1*global.ekran_size_act
    background_yscale[0]=1*global.ekran_size_act
    
    }
    
    
    


// USTAW PUSTYNIE
if global.background_kind=16
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    background_visible[1]=1
    background_visible[2]=1
    background_visible[3]=1
    background_visible[4]=1
    background_visible[5]=1


    background_alpha[1]=0.8
    background_alpha[2]=0.9
    background_alpha[3]=1
    background_alpha[4]=0.45
    background_alpha[5]=1
    background_foreground[4]=1
    
    global.background_kind=17
    background_htiled[0]=1
    background_vtiled[0]=0
    background_htiled[1]=1
    background_vtiled[1]=0
    background_htiled[2]=1
    background_vtiled[2]=0
    background_htiled[3]=1
    background_vtiled[3]=0
    background_htiled[4]=1
    background_vtiled[4]=0
    background_htiled[5]=1
    background_vtiled[5]=0
    
    background_index[0]=global.background_ship_space
    background_index[1]=back_desert_paralax
    background_index[2]=back_desert_paralax
    background_index[3]=back_desert_paralax
    background_index[4]=back_desert_paralax
    background_index[5]=global.background_ship_space_2
    }
if global.background_kind=17
    {
    background_y[0]=view_yview[0]
    background_y[1]=view_yview[0]+300*global.ekran_size_act
    background_y[2]=view_yview[0]+350*global.ekran_size_act
    background_y[3]=view_yview[0]+450*global.ekran_size_act
    
    background_x[0]=view_xview[0]
    background_x[1]=view_xview[0]/1.111//background_x[0]*1.8
    background_x[2]=view_xview[0]/1.505//background_x[0]*1.5
    background_x[3]=view_xview[0]/1.901//background_x[0]*1.1
    
    // PUSTYNNY WIATR
    background_x[4]-=1
    background_y[4]=room_height-250
    background_yscale[4]=2
    
    // CHMURY
    background_xscale[5]=1*global.ekran_size_act
    background_yscale[5]=1*global.ekran_size_act
    background_x[5]=view_xview[0]
    background_y[5]=view_yview[0]
    }
    
    
    
    
    
    
      // USTAW chmury wysoko - POWOLNE - DUCHOSTAN
if global.background_kind=80
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    background_visible[1]=1
    background_visible[2]=1
    background_visible[3]=1
    global.background_kind=81
    background_htiled[0]=1
    background_vtiled[0]=0
    background_htiled[1]=1
    background_vtiled[1]=0
    background_htiled[2]=1
    background_vtiled[2]=0
    background_htiled[3]=1
    background_vtiled[3]=0
    background_index[0]=global.background_ship_space_3
    background_index[1]=global.background_ship_space_2
    background_index[2]=global.background_ship_space_2
    background_index[3]=global.background_ship_space_2
    }
if global.background_kind=81
    {
    background_x[0]=view_xview[0]
    background_y[0]=view_yview[0]
    background_yscale[0]=1*global.ekran_size_act
    
    
    background_y[1]=view_yview[0]+200*global.ekran_size_act
    background_x[1]+=0.2*5
    background_y[2]=view_yview[0]+300*global.ekran_size_act
    background_x[2]+=1*5
    background_y[3]=view_yview[0]+400*global.ekran_size_act
    background_x[3]+=2*5
    background_foreground[3]=1
    
    }
    
    
     
    
   // USTAW chmury wysoko - POWOLNE
if global.background_kind=30
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    background_visible[1]=1
    background_visible[2]=1
    background_visible[3]=1
    global.background_kind=31
    background_htiled[0]=1
    background_vtiled[0]=0
    background_htiled[1]=1
    background_vtiled[1]=0
    background_htiled[2]=1
    background_vtiled[2]=0
    background_htiled[3]=1
    background_vtiled[3]=0
    background_index[0]=global.background_ship_space
    background_index[1]=global.background_ship_space_2
    background_index[2]=global.background_ship_space_2
    background_index[3]=global.background_ship_space_2
    }
if global.background_kind=31
    {
    background_x[0]=view_xview[0]
    background_y[0]=view_yview[0]
    background_yscale[0]=1*global.ekran_size_act
    
    
    background_y[1]=view_yview[0]+200*global.ekran_size_act
    background_x[1]+=0.2
    background_y[2]=view_yview[0]+300*global.ekran_size_act
    background_x[2]+=1
    background_y[3]=view_yview[0]+400*global.ekran_size_act
    background_x[3]+=2
    background_foreground[3]=1
    
    }
    
    
   // USTAW chmury wysoko DLA MEGA ODDALAJACEGO SIE SCROLLA
if global.background_kind=140
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    background_visible[1]=1
    background_visible[2]=1
    background_visible[3]=1
    global.background_kind=141
    background_htiled[0]=1
    background_vtiled[0]=0
    background_htiled[1]=1
    background_vtiled[1]=0
    background_htiled[2]=1
    background_vtiled[2]=0
    background_htiled[3]=1
    background_vtiled[3]=0
    background_index[0]=global.background_ship_space
    background_index[1]=global.background_ship_space_2
    background_index[2]=global.background_ship_space_2
    background_index[3]=global.background_ship_space_2
    }
if global.background_kind=141
    {
    background_xscale[0]=1*global.ekran_size_act
    background_yscale[0]=1*global.ekran_size_act
    background_x[0]=view_xview[0]
    background_y[0]=view_yview[0]
    background_y[1]=view_yview[0]+200*global.ekran_size_act
    background_x[1]+=1
    background_y[2]=view_yview[0]+300*global.ekran_size_act
    background_x[2]+=5
    background_y[3]=view_yview[0]+400*global.ekran_size_act
    background_x[3]+=10
    background_foreground[3]=1
    
    }
    
    
    
      
// USTAW chmury wysoko
if global.background_kind=14
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    background_visible[1]=1
    background_visible[2]=1
    background_visible[3]=1
    global.background_kind=15
    background_htiled[0]=1
    background_vtiled[0]=0
    background_htiled[1]=1
    background_vtiled[1]=0
    background_htiled[2]=1
    background_vtiled[2]=0
    background_htiled[3]=1
    background_vtiled[3]=0
    background_index[0]=global.background_ship_space
    background_index[1]=global.background_ship_space_2
    background_index[2]=global.background_ship_space_2
    background_index[3]=global.background_ship_space_2
    }
if global.background_kind=15
    {
        background_xscale[0]=1*global.ekran_size_act
    background_yscale[0]=1*global.ekran_size_act
    background_x[0]=view_xview[0]
    background_y[0]=view_yview[0]
    background_y[1]=view_yview[0]+200
    background_x[1]+=1
    background_y[2]=view_yview[0]+300
    background_x[2]+=5
    background_y[3]=view_yview[0]+400*global.ekran_size_act
    background_x[3]+=10
    background_foreground[3]=1
    
    }
    
    
    
// USTAW PALACE
if global.background_kind=12
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    global.background_kind=13
    background_htiled[0]=1
    background_vtiled[0]=0
    }
if global.background_kind=13
    {
    background_index[0]=global.background_palace
    background_x[0]=view_xview[0]-view_xview[0]/10
    }
    
    
    
// USTAW GHOSTLAND GRASSLAND
if global.background_kind=10
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    global.background_kind=11
    background_htiled[0]=1
    background_vtiled[0]=0
    }
if global.background_kind=11
    {
    background_index[0]=global.background_evil_forest
    background_x[0]=view_xview[0]-view_xview[0]/100
    background_y[0]=view_yview[0]
    background_xscale[0]=1*global.ekran_size_act
    background_yscale[0]=1*global.ekran_size_act
    }
    
    
// USTAW GHOSTLAND
if global.background_kind=8
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    global.background_kind=9
    background_htiled[0]=1
    background_vtiled[0]=0
    }
if global.background_kind=9
    {
    background_xscale[0]=1*global.ekran_size_act
    background_yscale[0]=1*global.ekran_size_act
    background_index[0]=global.background_ghosts
    background_x[0]=view_xview[0]-view_xview[0]/10
    background_y[0]=view_yview[0]
    }
    
    

// USTAW POZIOMY GRASSLAND
if global.background_kind=0
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    global.background_kind=1
    background_htiled[0]=1
    background_vtiled[0]=0
    }
if global.background_kind=1
    {
    background_index[0]=global.background_grassland
    background_x[0]=view_xview[0]-view_xview[0]/10
    background_y[0]=view_yview[0]
    
    background_xscale[0]=1*global.ekran_size_act
    background_yscale[0]=1*global.ekran_size_act
    
    }


// USTAW UNDERGROUNDS NIERUCHOMY
if global.background_kind=2
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    global.background_kind=3
    background_htiled[0]=1
    background_vtiled[0]=1
    }
if global.background_kind=3
    {
    background_index[0]=global.background_undegrounds
    //background_x[0]=0
    }
    
// USTAW UNDERGROUNDS RUCHOMY WZGLEDEM GRACZA
if global.background_kind=4
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    global.background_kind=5
    background_htiled[0]=1
    background_vtiled[0]=1
    }
if global.background_kind=5
    {
    background_index[0]=global.background_undegrounds
    
    //background_x[0]+=-(obj_mario.x-background_obliczator1)/10
    if background_obliczator1<>obj_mario.x {background_obliczator1=obj_mario.x}
    }
    
    
    // USTAW UNDERGROUNDS RUCHOMY WZGLEDEM SCROOLINGU
if global.background_kind=6
    {
    for (i=0;i<8;i+=1) {background_visible[i]=0}
    background_visible[0]=1
    global.background_kind=7
    background_htiled[0]=1
    background_vtiled[0]=1
    }
if global.background_kind=7
    {
    background_index[0]=global.background_castle
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

