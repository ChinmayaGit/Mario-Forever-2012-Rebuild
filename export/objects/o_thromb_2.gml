#event create:0
grawitacja=0
sekwencja=0
poczatek_x=x
poczatek_y=y
buzin=0

kierunek=1
stream=0
rozdeptywalny=0
kill=0
seened=0

//kierunek_jebniecia=0
energy=1


niezjadywalny=1 // zmienna ktora chroni przeciwnika przed zjedzeniem
gwiazdker=0

plusknie=1


#event draw:0
script_enemy_thromb_2()

if !place_meeting(x,y+30,o_pink_plasma_define) && plusknie=0 {SXMS_SFX_PlayExt(93+round(random(1)),((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0);plusknie=1; part_particles_create(global.particle_sys_1,x,y-image_xscale*72,global.part_water_splash[0],3);part_particles_create(global.particle_sys_1,x,y,global.part_water_splash[1],ceil(image_xscale)*3)}
    if place_meeting(x,y+30,o_pink_plasma_define) && plusknie=1 {SXMS_SFX_PlayExt(93+round(random(1)),((x-view_xview[0])/800)*255,global.glosnosc_dzwieku,-1,0,0);plusknie=0; part_particles_create(global.particle_sys_1,x,y-image_xscale*72,global.part_water_splash[0],3);part_particles_create(global.particle_sys_1,x,y,global.part_water_splash[1],ceil(image_xscale)*3)}


