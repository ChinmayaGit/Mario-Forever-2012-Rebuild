#event create:0
tworz=0


#event step:0
{
if tworz=0
{tworz=1;repeat(5) {instance_create(view_xview[0]+random(800),view_yview[0]+random(600),o_small_cloud)}}

if random(10000)>9890 {instance_create(view_xview[0]+890,view_yview[0]+random(1000)-random(300),o_small_cloud)}

}


