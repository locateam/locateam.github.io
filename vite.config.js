import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {compileArticle} from './scripts/compile-article.mjs';
export default defineConfig({plugins:[{
  name:'article-markdown',enforce:'pre',
  transform(source,id){
    if(!/\/public\/news\/[^/]+\.json$/.test(id.split('?')[0].replaceAll('\\','/')))return;
    const post=JSON.parse(source);
    // Compile and sanitize at the content boundary; browsers receive only safe HTML.
    return JSON.stringify(compileArticle(post));
  }
},react()]});
