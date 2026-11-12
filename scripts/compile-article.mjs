import {renderMarkdown} from '../src/markdown.js';
export function compileArticle(post){
  if(typeof post.body!=='string')throw Error(`Missing article body: ${post.slug}`);
  let en={enabled:false};
  if(post.en?.enabled===true){
    for(const field of ['title','description','body'])if(typeof post.en[field]!=='string'||!post.en[field].trim())throw Error(`English translation of ${post.slug}: fill ${field} before enabling publication`);
    en={...post.en,html:renderMarkdown(post.en.body)};
  }
  return {...post,html:renderMarkdown(post.body),en};
}
