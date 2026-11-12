import {blogUrl,postUrl,routeParams} from './routes.js';
import {localPath} from './i18n.js';
import {paginate} from './paginate.js';
export function articleIn(post,language){
  if(language==='ru')return post;
  if(post.en?.enabled!==true)return null;
  return {...post,title:post.en.title,description:post.en.description,body:post.en.body,html:post.en.html,category:post.en.category||'Team'};
}
export const articlesFor=(posts,language)=>posts.map(post=>articleIn(post,language)).filter(Boolean);
export function articleLanguageUrl(pathname,language,posts){
  const params=routeParams(pathname);
  if(params.has('post')){
    const original=posts.find(post=>post.slug===params.get('post'));
    return localPath(original&&articleIn(original,language)?postUrl(original.slug):blogUrl(),language);
  }
  if(params.has('blog'))return localPath(blogUrl(paginate(articlesFor(posts,language),params.get('page')??1).page),language);
  return localPath('/',language);
}
