#event step:0
if point_distance(x,y,global.ekran_srodek_x,global.ekran_srodek_y)<=global.odleglosc_ekranu*2 {
if random(100)>50 {


part_particles_create(global.particle_sys_przed_morkami,view_xview[0]+random(view_wview[0]),view_yview[0]+random(view_hview[0]),global.part_efekt_lotu,1)}}


