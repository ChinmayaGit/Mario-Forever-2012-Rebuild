var xx,yy,quality;
xx=(argument1-view_xview)/view_wview
yy=(argument2-view_yview)/view_hview

xx*=2;
yy*=2;
quality=ceil(argument0/argument3);
argument0/=quality;

for(i=argument0;i>=0;i-=1)
{
draw_surface_ext(b,-(i*(quality/2))*xx,-(i*(quality/2))*yy,(view_wview+i*quality)/view_wview,(view_hview+i*quality)/view_hview,0,c_white,1/(argument0/2))
}
