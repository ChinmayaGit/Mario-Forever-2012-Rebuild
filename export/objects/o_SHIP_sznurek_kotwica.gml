#event create:0
kat=0
kat2=0
dzielnik=1
mario=0
wisi_na=0
jest_bujane=0
odbujanie=0
odejmowacz=0
dlugosc_sznurka=0


for(i=0;i<15;i+=1)
    {
    lolo=instance_create(x,y,o_sznurek_child)
    lolo.nalezy=id
    lolo.mask_index=global.gfx_sznurek
    lolo.numer=i
    if i=0 {lolo.image_alpha=0.2}
    if i=1 {lolo.image_alpha=0.5}
    if i=2 {lolo.image_alpha=0.75}
    if i=5 {global.sekwencja_statku=lolo}
    
    
    if i=14 {lolo.kotwica=1}
    sznurek[i]=lolo.id
    dlugosc_sznurka=i
    }


#event step:2
for(i=0;i<15;i+=1)
    {
    (sznurek[i]).x=x+sin(degtorad(kat+3*i*sin(degtorad(kat))))*(22*i)
    (sznurek[i]).y=y+cos(degtorad(kat+3*i*sin(degtorad(kat))))*(22*i)
    (sznurek[i]).image_angle=sin(degtorad(kat2))*50/dzielnik+6*i*sin(degtorad(kat))
    }


#event draw:0

if x<view_xview+1400 && x>view_xview-640 && y>view_yview[0]-640 && y<view_yview[0]+1200 {


if mario=1
    {
    if dzielnik<1 {dzielnik=1}
    obj_mario.x=x+sin(degtorad(kat+3*(wisi_na+odejmowacz/22)*sin(degtorad(kat))))*(22*wisi_na+odejmowacz)-20
    obj_mario.y=y+cos(degtorad(kat+3*(wisi_na+odejmowacz/22)*sin(degtorad(kat))))*(22*wisi_na+odejmowacz)
    obj_mario_anim.globalny_kat=sin(degtorad(kat2))*50/dzielnik+6*(wisi_na+odejmowacz/22)*sin(degtorad(kat))
    obj_mario_anim.bujanie_nogami=sin(degtorad(kat2))*50/dzielnik+6*(wisi_na+odejmowacz/22)*sin(degtorad(kat))

    if keyboard_check(global.ster_up) && odejmowacz>-wisi_na*22 && mario=1 {odejmowacz-=1;obj_mario_anim.animacja=12}
    if keyboard_check(global.ster_down) && odejmowacz<dlugosc_sznurka*22-wisi_na*22 && mario=1 {odejmowacz+=1;obj_mario_anim.animacja=12}
    if odejmowacz<=-wisi_na*22 {obj_mario_anim.animacja=11}
    if odejmowacz>=dlugosc_sznurka*22-wisi_na*22 {obj_mario_anim.animacja=11}

    }


kat=sin(degtorad(kat2))*50/dzielnik
kat2+=1+jest_bujane/10
if jest_bujane>10 {jest_bujane=0}
if dzielnik<5 && jest_bujane=0 && !keyboard_check(vk_right) && !keyboard_check(vk_left) {dzielnik+=0.005}
if jest_bujane>0 {jest_bujane=jest_bujane/1.03}
if jest_bujane<=0.05 {jest_bujane=0}
if kat2>360 {kat2=0}


}
/*
draw_sprite_ext(global.gfx_sznurek_start,0,x,y,1,1,0,c_white,1)








