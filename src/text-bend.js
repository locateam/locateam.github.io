export function bendAt(x,y,pointer){
  if(!pointer)return 0;
  const dx=(x-pointer.x)/110,dy=(y-pointer.y)/100;
  return 30*Math.exp(-(dx*dx+dy*dy)*1.5);
}
