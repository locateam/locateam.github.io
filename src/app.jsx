import React,{useEffect} from 'react';
import {ArrowUpRight,ArrowDown,ArrowLeft} from '@phosphor-icons/react';
import Lenis from 'lenis';
import {Button} from './components/ui/button';
import {blogUrl as baseBlogUrl,postUrl as basePostUrl,routeParams,siteOrigin} from './routes.js';
import {messages,languageFor,localPath} from './i18n.js';
import {articlesFor,articleLanguageUrl} from './articles.js';
import {HeroQuote} from './components/hero-quote';
import {paginate} from './paginate.js';
import {Pagination,PaginationContent,PaginationItem,PaginationLink,PaginationPrevious,PaginationNext,PaginationEllipsis} from './components/ui/pagination';
export const posts=Object.values(import.meta.glob('/public/news/*.json',{eager:true,import:'default'})).sort((a,b)=>b.date.localeCompare(a.date));
const projects=Object.values(import.meta.glob('/public/projects/*.json',{eager:true,import:'default'})).filter(p=>p.visible&&/^https:\/\//.test(p.url)).sort((a,b)=>(a.order??0)-(b.order??0));
function PostRow({post,href}){return <a className="news-row" href={href}><time dateTime={post.date}>{post.date}</time><div><small>{post.category}</small><h3>{post.title}</h3><p>{post.description}</p></div><ArrowUpRight size={24}/></a>}
export default function App({pathname='/'}){
  const language=languageFor(pathname),t=messages[language];
  const home=localPath('/',language),blogUrl=page=>localPath(baseBlogUrl(page),language),postUrl=slug=>localPath(basePostUrl(slug),language);
  const params=routeParams(pathname),isBlog=params.has('blog');
  const languagePosts=articlesFor(posts,language);
  const listing=paginate(languagePosts,params.get('page')??1),article=languagePosts.find(p=>p.slug===params.get('post'))??null;
  const title=article?`${article.title} — locaTeam`:isBlog?`${t.blog} locaTeam${listing.page>1?` — ${t.page} ${listing.page}`:''}`:t.siteTitle;
  const description=article?.description??t.description;
  const canonical=siteOrigin+(article?postUrl(article.slug):isBlog?blogUrl(listing.page):home);
  useEffect(()=>{
    document.documentElement.lang=language;document.title=title;
    document.querySelector('meta[name="description"]').content=description;
    document.querySelector('link[rel="canonical"]').href=canonical;
    for(const [name,value] of [['og:title',title],['og:description',description],['og:url',canonical],['og:type',article?'article':'website'],['og:locale',language==='en'?'en_US':'ru_RU']])document.querySelector(`meta[property="${name}"]`).content=value;
  },[language,title,description,canonical,article]);
  useEffect(()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const lenis=new Lenis({autoRaf:true,anchors:true,duration:1.1});
    const cursor=document.querySelector('.cursor'),dot=document.querySelector('.cursor-dot');
    const move=e=>{if(e.pointerType!=='mouse')return;cursor.style.transform=`translate3d(${e.clientX-18}px,${e.clientY-18}px,0)`;dot.style.transform=`translate3d(${e.clientX-2}px,${e.clientY-2}px,0)`;cursor.style.opacity=1;document.documentElement.classList.add('custom-pointer');cursor.classList.toggle('over-link',Boolean(e.target.closest('a,button')))};
    const hide=()=>{cursor.style.opacity=0;document.documentElement.classList.remove('custom-pointer')};
    window.addEventListener('pointermove',move);document.addEventListener('mouseleave',hide);window.addEventListener('blur',hide);
    return()=>{lenis.destroy();hide();window.removeEventListener('pointermove',move);document.removeEventListener('mouseleave',hide);window.removeEventListener('blur',hide)};
  },[]);
  return <><div className="cursor" aria-hidden="true"/><div className="cursor-dot" aria-hidden="true"/>
    <header><a className="brand" href={home} aria-label={`locaTeam — ${t.home}`}><img src="/assets/loka.png" alt=""/>locaTeam</a>
      <nav aria-label={language==='en'?'Main navigation':'Основная навигация'}><a href={`${home}#projects`}>{t.projects}</a><a href={blogUrl()}>{t.blog}</a></nav>
      <div className="social"><a href="https://github.com/locateam" aria-label="GitHub"><img src="/assets/github.svg" alt="" width="24"/></a><a href="https://huggingface.co/locateam" aria-label="Hugging Face"><img src="/assets/huggingface.svg" alt="" width="24"/></a></div>
      <div className="language-switch" aria-label={language==='en'?'Language':'Язык'}>{['ru','en'].map(lang=><a key={lang} href={articleLanguageUrl(pathname,lang,posts)} lang={lang} hrefLang={lang} aria-current={lang===language?'true':undefined}>{lang.toUpperCase()}</a>)}</div>
    </header>
    <main>{article?<article className="article"><Button asChild variant="outline"><a href={blogUrl(listing.page)}><ArrowLeft/>{t.allArticles}</a></Button><p className="eyebrow">{article.date} / {article.category}</p><h1>{article.title}</h1><p className="lead">{article.description}</p><div className="prose" dangerouslySetInnerHTML={{__html:article.html}}/></article>
    :isBlog?<section className="blog-page"><a href={home} className="back-link"><ArrowLeft size={18}/>{t.home}</a><div className="section-heading"><span className="eyebrow">{t.blog} locaTeam</span><h1>{t.allPosts}</h1><p>{t.notes}</p></div>
      {listing.items.map(p=><PostRow key={p.slug} post={p} href={postUrl(p.slug)}/>)}{languagePosts.length===0&&<p>{t.empty}</p>}
      <Pagination aria-label={t.pages}><PaginationContent><PaginationItem><PaginationPrevious text={t.back} aria-label={t.previous} disabled={listing.page===1} href={listing.page>1?blogUrl(listing.page-1):undefined}/></PaginationItem>
      {Array.from({length:listing.totalPages},(_,i)=>i+1).filter(n=>n===1||n===listing.totalPages||Math.abs(n-listing.page)<=1).map((n,i,a)=><React.Fragment key={n}>{i>0&&n-a[i-1]>1&&<PaginationItem><PaginationEllipsis text={t.more}/></PaginationItem>}<PaginationItem><PaginationLink href={blogUrl(n)} isActive={n===listing.page} aria-label={`${t.page} ${n}`}>{n}</PaginationLink></PaginationItem></React.Fragment>)}
      <PaginationItem><PaginationNext text={t.forward} aria-label={t.next} disabled={listing.page===listing.totalPages} href={listing.page<listing.totalPages?blogUrl(listing.page+1):undefined}/></PaginationItem></PaginationContent></Pagination>
    </section>:<><section className="hero"><HeroQuote language={language}/><div className="hero-bottom"><Button asChild><a href="#projects">{t.explore}<ArrowUpRight size={20}/></a></Button><a className="scroll" href="#projects" aria-label={t.scroll}><ArrowDown size={23}/></a></div></section>
    <section id="projects"><div className="section-heading"><span className="eyebrow">01 / {t.projects}</span><h2>{t.projects}</h2><p>{t.code}</p></div><div className="projects">{projects.map(p=><a key={p.slug} className="project" href={p.url}><ArrowUpRight size={24}/><h3>{p.title}</h3><p>{p.description}</p></a>)}{projects.length===0&&<p>{t.soon}</p>}</div></section>
    <section id="blog"><div className="section-heading"><span className="eyebrow">02 / {t.blog}</span><h2>{t.blog}</h2><p>{t.notes}</p></div>{languagePosts.slice(0,3).map(p=><PostRow key={p.slug} post={p} href={postUrl(p.slug)}/>)}{languagePosts.length===0&&<p>{t.empty}</p>}<Button asChild variant="outline"><a href={blogUrl()}>{t.allPosts}<ArrowUpRight size={20}/></a></Button></section>
    <section className="outro"><img src="/assets/loka.png" alt={language==='en'?'Loka':'Лока'}/><h2>{t.together}</h2><Button asChild variant="outline"><a href="https://github.com/locateam">{t.github}<ArrowUpRight/></a></Button></section></>}</main>
    <footer><a className="brand" href={home}>locaTeam</a><span>© {new Date().getFullYear()} locaTeam</span><span>{t.team}</span><a href="/admin/">{t.editor}<ArrowUpRight/></a></footer></>;
}
