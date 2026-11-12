import {Marked} from 'marked';
import sanitizeHtml from 'sanitize-html';
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const markdown=new Marked({gfm:true,breaks:true,renderer:{
  html({text}){return escape(text);},
  heading({tokens,depth}){const level=Math.min(depth+1,6);return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;}
}});
export function renderMarkdown(source){
  return sanitizeHtml(markdown.parse(source),{
    allowedTags:[...sanitizeHtml.defaults.allowedTags,'img'],
    allowedAttributes:{...sanitizeHtml.defaults.allowedAttributes,img:['src','alt','title'],code:['class']},
    allowedSchemes:['http','https','mailto'],allowProtocolRelative:false
  });
}
