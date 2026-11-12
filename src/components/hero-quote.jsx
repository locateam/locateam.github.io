import React,{useEffect,useRef} from 'react';
import {bendAt} from '../text-bend.js';
const quote='Создаём проекты. Делимся результатами. / ';
export function HeroQuote(){
  const canvas=useRef(null);
  const pointer=useRef(null);
  useEffect(()=>{
    const element=canvas.current,context=element.getContext('2d');
    const source=document.createElement('canvas'),ink=source.getContext('2d');
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    if(media.matches)return;
    let frame=0,disposed=false,width=0,height=0,period=0,offset=0,last=0,strength=0;
    let current={x:0,y:0};
    function resize(){
      const rect=element.getBoundingClientRect();width=rect.width;height=rect.height;
      const dpr=Math.min(devicePixelRatio||1,2);element.width=width*dpr;element.height=height*dpr;context.setTransform(dpr,0,0,dpr,0,0);
      const size=Math.min(88,Math.max(40,width*.075));
      ink.font=`700 ${size}px "Balsamiq Sans"`;period=Math.ceil(ink.measureText(quote).width);
      source.width=period+Math.ceil(size);source.height=height;
      ink.font=`700 ${size}px "Balsamiq Sans"`;ink.fillStyle='#000';ink.textBaseline='middle';ink.fillText(quote,0,height/2);
    }
    function draw(time){
      const dt=Math.min((time-last)/1000||0,.05);last=time;
      offset=media.matches?0:(offset+dt*48)%period;
      const target=pointer.current;
      const ease=1-Math.exp(-dt*12);strength+=((target&&!media.matches?1:0)-strength)*ease;
      if(target){current.x+=(target.x-current.x)*ease;current.y+=(target.y-current.y)*ease;}
      context.clearRect(0,0,width,height);
      for(let x=0;x<width;x+=2){
        const sx=(x+offset)%period;
        const shift=bendAt(x,height/2,current)*strength;
        context.drawImage(source,sx,0,2,height,x,shift,2,height);
      }
      frame=requestAnimationFrame(draw);
    }
    const observer=new ResizeObserver(resize);observer.observe(element);
    document.fonts.load('700 88px "Balsamiq Sans"').then(()=>{if(!disposed){resize();element.parentElement.classList.add('quote-ready');frame=requestAnimationFrame(draw)}});
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect()};
  },[]);
  return <div className="quote-window" onPointerMove={e=>{if(e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.current={x:e.clientX-r.left,y:e.clientY-r.top}}} onPointerLeave={()=>{pointer.current=null}}>
    <h1 className="sr-only">Создаём проекты. Делимся результатами.</h1>
    <div className="quote-fallback" aria-hidden="true">Создаём проекты.<br/>Делимся результатами.</div>
    <canvas ref={canvas} className="quote-canvas" aria-hidden="true"/>
  </div>;
}
