#event create:0
// zmienne od goomby (czyli od zwyklych pzeciwnikow)

rozdeptywalny=0
kill=0
energy=10000000
dlugosc=2
stream=0
niezjadywalny=1
gwiazdker=0


image_xscale=0.25
image_yscale=0.25


#event draw:0
script_wiatrak_fireball_child()
if random(100)>90 {part_particles_create(global.particle_map_sterring,x+random(10)-random(10),y+random(10)-random(10),global.part_fireball_tail_fire2,1)}


