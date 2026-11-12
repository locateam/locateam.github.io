import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
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
  assert.match(html,/<h1/);
  assert.ok(!html.includes('content="noindex'));
  for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)){
    const target=decodeURIComponent(match[1]);
    const info=await stat(resolve('dist','.'+target));assert.ok(info.isFile()||info.isDirectory(),target);
  }
}
const article=await readFile('dist/blog/hello-loka/index.html','utf8');
assert.ok(article.includes('Это Лока'));
assert.ok(article.includes('BlogPosting'));
assert.match(await readFile('dist/admin/index.html','utf8'),/noindex,nofollow/);
assert.match(await readFile('dist/robots.txt','utf8'),/Disallow: \/admin\//);
assert.ok((await readdir('dist')).includes('.nojekyll'));
console.log(`Static HTML and local links verified for ${urls.length} pages`);
