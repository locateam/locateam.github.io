import assert from 'node:assert/strict';
import {readFile,readdir,stat,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {contentFiles} from './content-files.mjs';
import {renderMarkdown} from '../src/markdown.js';
const origin='https://locateam.github.io';
const sitemap=await readFile('dist/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size,urls.length);
for(const url of urls){
  assert.ok(url.startsWith(origin+'/'));
  const path=new URL(url).pathname;
  const html=await readFile(resolve('dist','.'+path,'index.html'),'utf8');
  assert.ok(html.includes(`<link rel="canonical" href="${url}"`));
  assert.match(html,/<div id="root">[\s\S]+<header/);
  assert.equal((html.match(/<h1(?: |>)/g)||[]).length,1,`Expected one h1: ${url}`);
  assert.match(html,path.startsWith('/en/')?/<html lang="en">/:/<html lang="ru">/);
  assert.ok(!html.includes('content="noindex'));
  for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)){
    const target=decodeURIComponent(match[1]);
    const info=await stat(resolve('dist','.'+target));assert.ok(info.isFile()||info.isDirectory(),target);
  }
}
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
for(const file of await contentFiles('public/news')){
  const post=JSON.parse(await readFile(`public/news/${file}`,'utf8'));
  const article=await readFile(`dist/blog/${post.slug}/index.html`,'utf8');
  assert.ok(article.includes(escape(post.title)),`Missing title for ${post.slug}`);
  assert.ok(article.includes(renderMarkdown(post.body)),`Missing Markdown content for ${post.slug}`);
  const englishPath=`dist/en/blog/${post.slug}/index.html`;
  if(post.en?.enabled===true){
    const english=await readFile(englishPath,'utf8');
    assert.ok(english.includes(renderMarkdown(post.en.body)),`Missing English translation for ${post.slug}`);
    assert.ok(english.includes(escape(post.en.title)));
    assert.ok(english.includes(`<link rel="canonical" href="${origin}/en/blog/${post.slug}/"`));
    assert.ok(article.includes(`hreflang="en" href="${origin}/en/blog/${post.slug}/"`));
    assert.ok(english.includes(`hreflang="ru" href="${origin}/blog/${post.slug}/"`));
  }else{
    await assert.rejects(access(englishPath),{code:'ENOENT'});
    assert.ok(!article.includes('hreflang="en"'));
  }
  assert.ok(article.includes('BlogPosting'));
}
assert.match(await readFile('dist/en/index.html','utf8'),/<html lang="en">/);
assert.match(await readFile('dist/en/blog/index.html','utf8'),/All posts/);
assert.match(await readFile('dist/admin/index.html','utf8'),/noindex,nofollow/);
assert.match(await readFile('dist/robots.txt','utf8'),/Disallow: \/admin\//);
assert.ok((await readdir('dist')).includes('.nojekyll'));
console.log(`Static HTML and local links verified for ${urls.length} pages`);
