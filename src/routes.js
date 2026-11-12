export const siteOrigin='https://locateam.github.io';
export const blogUrl=page=>page>1?`/blog/page/${page}/`:'/blog/';
export const postUrl=slug=>`/blog/${encodeURIComponent(slug)}/`;
export function routeParams(pathname){
  const parts=pathname.replace(/^\/en(?=\/|$)/,'').split('/').filter(Boolean);
  const params=new URLSearchParams();
  if(parts[0]==='blog'){
    params.set('blog','');
    if(parts[1]==='page')params.set('page',parts[2]??'1');
    else if(parts[1])params.set('post',decodeURIComponent(parts[1]));
  }
  return params;
}
export function legacyUrl(search){
  const params=new URLSearchParams(search);
  if(params.has('post'))return postUrl(params.get('post'));
  if(params.has('blog'))return blogUrl(Math.max(1,Number(params.get('page'))||1));
  return null;
}
