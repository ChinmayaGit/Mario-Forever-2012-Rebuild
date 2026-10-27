#event create:0
sekwencja=0
ixor=0
iyor=0
efekt=0
efekt2=0


#event draw:0
script_mario_fireball()
if random(100)>50 {part_particles_create(global.particle_sys_zanurkami,x+random(10)-random(10),y+random(10)-random(10),global.part_effect_torch_star,1)}


