import {createServer} from 'vite';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {blogUrl,postUrl,siteOrigin} from '../src/routes.js';
import {articlesFor} from '../src/articles.js';
import {messages,localPath,withoutLanguage} from '../src/i18n.js';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const server=await createServer({server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
  const {default:App,posts}=await server.ssrLoadModule('/src/app.jsx');
  const template=await readFile('dist/index.html','utf8');
  const slugs=new Set();
  for(const post of posts){
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)||['page','index'].includes(post.slug)||slugs.has(post.slug))throw Error(`Invalid or duplicate post slug: ${post.slug}`);
    slugs.add(post.slug);
    for(const field of ['title','description','body','date'])if(typeof post[field]!=='string')throw Error(`Missing ${field}: ${post.slug}`);
  }
  const pages=[];
  for(const language of ['ru','en']){
    const t=messages[language],localizedPosts=articlesFor(posts,language);
    pages.push({path:localPath('/',language),language,title:t.siteTitle,description:t.description});
    for(let page=1;page<=Math.max(1,Math.ceil(localizedPosts.length/10));page++)pages.push({path:localPath(blogUrl(page),language),language,title:`${t.blog} locaTeam${page>1?` — ${t.page} ${page}`:''}`,description:t.description});
    for(const post of localizedPosts)pages.push({path:localPath(postUrl(post.slug),language),language,title:`${post.title} — locaTeam`,description:post.description,post});
  }
  const paths=new Set(pages.map(page=>page.path));
  for(const page of pages){
    const canonical=siteOrigin+page.path;
    let html=template.replace('<html lang="ru">',`<html lang="${page.language}">`)
      .replace(/<title>.*?<\/title>/,`<title>${escape(page.title)}</title>`)
      .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escape(page.description)}"/>`)
      .replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${canonical}"/>`);
    for(const [property,value] of [['og:title',page.title],['og:description',page.description],['og:url',canonical],['og:type',page.post?'article':'website'],['og:locale',page.language==='en'?'en_US':'ru_RU']])html=html.replace(new RegExp(`<meta property="${property}"[^>]*>`),`<meta property="${property}" content="${escape(value)}"/>`);
    for(const lang of ['ru','en']){const alternate=localPath(withoutLanguage(page.path),lang);if(paths.has(alternate))html=html.replace('</head>',`<link rel="alternate" hreflang="${lang}" href="${siteOrigin+alternate}"/></head>`);}
    const schema=page.post?{'@context':'https://schema.org','@type':'BlogPosting',inLanguage:page.language,headline:page.post.title,description:page.description,datePublished:page.post.date,mainEntityOfPage:canonical,author:{'@type':'Organization',name:'locaTeam'},publisher:{'@type':'Organization',name:'locaTeam'}}:{'@context':'https://schema.org','@type':'WebSite',name:'locaTeam',url:siteOrigin};
    html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head>`);
    html=html.replace('<div id="root"></div>',`<div id="root">${renderToString(React.createElement(App,{pathname:page.path}))}</div>`);
    const target=resolve('dist','.'+page.path,'index.html');await mkdir(dirname(target),{recursive:true});await writeFile(target,html);
  }
  await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${escape(siteOrigin+p.path)}</loc></url>`).join('')}</urlset>`);
  await writeFile('dist/.nojekyll','');
  await writeFile('dist/404.html','<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Страница не найдена — locaTeam</title><body><h1>Страница не найдена / Page not found</h1><a href="/">На главную</a> · <a href="/en/">Home</a></body></html>');
  console.log(`Prerendered ${pages.length} pages with canonical metadata and sitemap`);
}finally{await server.close()}
