#event create:0
image_xscale=0.25
grawitacja=0
sekwencja=0
kierunek=-1
stream=0
rozdeptywalny=0
kill=0
seened=0

energy=1
niezjadywalny=1

timer=0
przyciemniaj=1
powiekszator=0.1
efekter=10

dziala=0


#event draw:0
draw_sprite_ext(s_small_thromb_marker,0,x,y,image_xscale,1,0,c_white,0.1)

if global.pauza=0
    {
    
    if efekter>=10 {efekter=0;part_particles_create(global.particle_map_sterring,x,y+30,global.part_BOOMBOOM_smoke2,1)}
    if efekter=9 {part_particles_create(global.particle_map_sterring,x,y+30,global.part_BOOMBOOM_smoke5,1)}
    
    efekter+=1
    timer+=1
    if timer>50 {przyciemniaj+=0.5}
    if kierunek=-1 {x-=5-powiekszator*kierunek}
    if kierunek=1 {x+=5+powiekszator*kierunek}
    if przyciemniaj>20 {instance_destroy()}  
    powiekszator+=0.1
      
    draw_sprite_ext(s_boom_boom_6,0,x,y,image_xscale*kierunek*2+powiekszator*kierunek/20,1,0,c_white,0.5/przyciemniaj)
    draw_sprite_ext(s_boom_boom_6,0,x,y,image_xscale*kierunek/2+powiekszator*kierunek/20,1,0,c_white,0.5/przyciemniaj)
    draw_sprite_ext(s_boom_boom_6,0,x,y,image_xscale*kierunek/3+powiekszator*kierunek/20,1,0,c_white,0.5/przyciemniaj)
    draw_sprite_ext(s_boom_boom_6,0,x,y,image_xscale*kierunek+powiekszator*kierunek/20,random(1),0,c_white,0.5/przyciemniaj)
    draw_sprite_ext(s_boom_boom_6,0,x,y,image_xscale*kierunek+powiekszator*kierunek/20,random(2),0,c_white,0.5/przyciemniaj)
    draw_sprite_ext(s_spikey_10,0,x,y,image_xscale*kierunek*3+powiekszator*kierunek/20,1,0,c_white,0.5/przyciemniaj)
        
    }


