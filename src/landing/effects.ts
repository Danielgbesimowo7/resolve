// @ts-nocheck
// Scroll/animation behaviour for the landing page. Ported from the original single-file build;
// it drives the server-rendered markup in the section components and cleans up after itself.
import { FACES } from '../faces'

export function initLanding(): () => void {
  const DEAD = { v: false }
  const cleanups: Array<() => void> = []
  const OBS: IntersectionObserver[] = []
  const _IO = window.IntersectionObserver
  const IntersectionObserver = class extends _IO { constructor(...a) { super(...a); OBS.push(this) } }
  const addEventListener = (t, f, o?) => { window.addEventListener(t, f, o); cleanups.push(() => window.removeEventListener(t, f, o)) }
  const docListen = (t, f, o?) => { document.addEventListener(t, f, o); cleanups.push(() => document.removeEventListener(t, f, o)) }

const $=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Flexible headline reveal: words rise, un-blur and fade in with a stagger; fade back out when scrolled away */
function wordsReveal(el,lines,thr){let i=0;lines.forEach((parts,li)=>{if(li)el.appendChild(document.createElement('br'));parts.forEach(([txt,cls])=>{txt.split(/(?<= )/).forEach(w=>{const s=document.createElement('span');s.className='wd '+(cls||'');s.style.setProperty('--i',i++);s.textContent=w.replace(/ $/,'\u00a0');el.appendChild(s)})})});
 new IntersectionObserver(([e])=>el.classList.toggle('in',e.isIntersecting),{threshold:thr}).observe(el)}
const hl=$('#hl');wordsReveal(hl,[[['AI support that gets better with every ',''],['conversation','s']]],.45);

/* Body copy fades in */
const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting)),{threshold:.2});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* Dashboard scaling */
const dash=$('#dash'),clip=$('#clip'),DW=1449+45.6;let sc=1;
function fit(){sc=clip.clientWidth/DW;dash.style.transform=`scale(${sc})`;clip.style.height=(817*sc)+'px';place()}

/* Chart */
(function(){const ys=[110,112,72,102,78,72,42,40],xs=[0,1,2,3,4,5,6,7].map(i=>62+i*77);let d=`M${xs[0]} ${ys[0]}`;
 for(let i=1;i<xs.length;i++){const cx=(xs[i-1]+xs[i])/2;d+=` C${cx} ${ys[i-1]} ${cx} ${ys[i]} ${xs[i]} ${ys[i]}`}
 $('#ln').setAttribute('d',d);$('#ar').setAttribute('d',d+` L${xs[7]} 160 L${xs[0]} 160Z`);
 $('#pts').innerHTML=xs.map((x,i)=>`<circle cx="${x}" cy="${ys[i]}" r="3.5"/>`).join('')})();

/* Floating ice squares: identical 100px cubes at the Figma positions, drifting behind the dashboard */
const ices=[],CUBES=[];
function place(){const W=$('#stage').clientWidth,k=W/1494.6;ices.forEach(o=>{o.k=k;o.W=W;const s=100*k;o.el.style.width=o.el.style.height=s+'px';o.el.style.borderWidth=Math.max(2,4*k)+'px';o.el.style.borderRadius=12*k+'px';o.el.style.left=(o.fx*W-s/2)+'px';o.el.style.top=(o.fy*W-s/2)+'px'})}
(function(){const host=$('#ices');CUBES.forEach(([fx,fy,r],i)=>{const el=document.createElement('div');el.className='ice';host.appendChild(el);ices.push({el,fx,fy,r0:r,ax:16+Math.random()*22,ay:16+Math.random()*22,sx:.22+Math.random()*.3,sy:.2+Math.random()*.3,sr:.12+Math.random()*.2,px:Math.random()*6.3,py:Math.random()*6.3,ar:5+Math.random()*9,k:1})})})();
function loop(t){if(!ices.length)return;t/=1000;for(const o of ices){const x=Math.sin(t*o.sx+o.px)*o.ax*o.k,y=Math.cos(t*o.sy+o.py)*o.ay*o.k,r=o.r0+Math.sin(t*o.sr+o.px)*o.ar;o.el.style.transform=`translate(${x}px,${y}px) rotate(${r}deg)`}
 if(!reduce)requestAnimationFrame(loop)}
function fitP(){document.querySelectorAll('.pan2').forEach(q=>q.style.setProperty('--k',((q.clientWidth-4)/+q.dataset.w).toFixed(4)))}
addEventListener('resize',()=>{fit();fitP()});
document.fonts.ready.then(()=>{fit();fitP();requestAnimationFrame(loop)});fit();fitP();

/* Cursor tour: Dashboard → Conversations → Dashboard */
const cur=$('#cur');
function target(el){const r=el.getBoundingClientRect(),d=dash.getBoundingClientRect();return[(r.left-d.left)/sc-22.8+r.width/sc*.35,(r.top-d.top)/sc-22.8+r.height/sc*.5]}
function go(el){const[x,y]=target(el);cur.style.transform=`translate(${x}px,${y}px)`}
async function click(){cur.classList.add('p');await sleep(160);cur.classList.remove('p')}
function show(v){$('#v-dash').classList.toggle('on',v==='dash');$('#v-conv').classList.toggle('on',v==='conv');
 $('#n-dash').classList.toggle('on',v==='dash');$('#n-conv').classList.toggle('on',v==='conv');$('#tt').textContent=v==='dash'?'Dashboard':'Conversations'}
let running=false,visible=false;
async function tour(){if(running)return;running=true;
 cur.style.transition='none';cur.style.transform='translate(1150px,700px)';cur.offsetWidth;cur.style.transition='';
 while(visible&&!DEAD.v){await sleep(1800);go($('#n-conv'));await sleep(1400);if(!visible)break;await click();show('conv');await sleep(3800);
  go($('#n-dash'));await sleep(1400);await click();show('dash');await sleep(3200);go({getBoundingClientRect:()=>({left:dash.getBoundingClientRect().left+sc*1150,top:dash.getBoundingClientRect().top+sc*720,width:0,height:0})});await sleep(1300)}
 running=false}
new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)tour()},{threshold:.25}).observe(clip);

/* Trusted-by infinite marquee */

/* Section headings use the same flexible reveal */
document.querySelectorAll('.tw').forEach(el=>{el.setAttribute('aria-label',el.dataset.t.replace('|',' ').replace(/\*/g,''));wordsReveal(el,el.dataset.t.split('|').map(l=>l.split('*').map((t,i)=>[t,i%2?'gr':'']).filter(p=>p[0])),.5)});
/* Counters, typed text, and scroll-triggered illustration playback */
const fmt=(el,v)=>el.textContent=(el.dataset.comma?Math.round(v).toLocaleString('en-US'):v.toFixed(+el.dataset.dec||0))+(el.dataset.suf||'');
function runCounts(root){root.querySelectorAll('[data-to]').forEach(el=>{const a=+el.dataset.from||0,b=+el.dataset.to,dur=+el.dataset.dur||1400,t0=performance.now()+(+el.dataset.delay||0),id=el._id=(el._id||0)+1;fmt(el,a);
 (function f(n){if(el._id!==id)return;const p=Math.min(1,Math.max(0,(n-t0)/dur));fmt(el,a+(b-a)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0);})}
function runTy(root){root.querySelectorAll('.ty').forEach(el=>{const txt=el.dataset.text,id=el._id=(el._id||0)+1;el.textContent='';setTimeout(async()=>{for(let i=1;i<=txt.length;i++){if(el._id!==id)return;el.textContent=txt.slice(0,i);await sleep(45)}},+el.dataset.delay||0)})}
function resetFx(root){root.querySelectorAll('[data-to]').forEach(el=>{el._id=(el._id||0)+1;fmt(el,+el.dataset.from||0)});root.querySelectorAll('.ty').forEach(el=>{el._id=(el._id||0)+1;el.textContent=''})}
const fxo=new IntersectionObserver(es=>es.forEach(e=>{const el=e.target;if(e.isIntersecting){el.classList.add('go');runCounts(el);runTy(el)}else{el.classList.remove('go');resetFx(el)}}),{threshold:.4});
document.querySelectorAll('.fx').forEach(el=>fxo.observe(el));
/* Ice cubes: drift randomly around their base position inside their card */
const fields=[];
document.querySelectorAll('.icb').forEach(host=>{const o=[...host.querySelectorAll('.ice.b')].map(el=>({el,r:+el.dataset.r,ax:(+host.dataset.amp)*(.6+Math.random()*.8),ay:(+host.dataset.amp)*(.6+Math.random()*.8),sx:.25+Math.random()*.4,sy:.2+Math.random()*.4,sr:.15+Math.random()*.25,px:Math.random()*6.3,py:Math.random()*6.3,ar:6+Math.random()*12}));
 const f={o,vis:false};fields.push(f);new IntersectionObserver(([e])=>f.vis=e.isIntersecting).observe(host.parentElement)});
function fl(t){if(!fields.length)return;t/=1000;for(const f of fields){if(!f.vis)continue;for(const q of f.o)q.el.style.transform=`translate(${Math.sin(t*q.sx+q.px)*q.ax}px,${Math.cos(t*q.sy+q.py)*q.ay}px) rotate(${q.r+Math.sin(t*q.sr+q.px)*q.ar}deg)`}
 if(!reduce)requestAnimationFrame(fl)}
requestAnimationFrame(fl);
/* Pricing toggle: monthly price /month, yearly price (20% off) /yearly */
document.querySelectorAll('#tgl button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#tgl button').forEach(x=>x.classList.toggle('on',x===b));const y=+b.dataset.y;
 document.querySelectorAll('.pv').forEach(el=>{const to=Math.round(+el.dataset.m*(y?12*.8:1)),from=+el.textContent.replace(/[$,]/g,''),t0=performance.now();(function f(n){const p=Math.min(1,(n-t0)/600);el.textContent='$'+Math.round(from+(to-from)*(1-Math.pow(1-p,3))).toLocaleString('en-US');if(p<1)requestAnimationFrame(f)})(t0)});
 document.querySelectorAll('.per').forEach(s=>{s.style.opacity=0;setTimeout(()=>{s.textContent=y?'/yearly':'/month';s.style.opacity=1},200)})}));
/* FAQ accordion: one item open at a time */

const PHOTOS=FACES;
function ph(e,k){const u=PHOTOS[k];if(!u)return;e.style.backgroundImage=`url("${u}")`;e.style.backgroundSize="cover";e.style.backgroundPosition="center";e.textContent=""}
document.querySelectorAll("[data-p]").forEach(e=>ph(e,e.dataset.p));
document.querySelectorAll(".cu").forEach(c=>{const a=c.querySelector(".av"),b=c.querySelector("b");if(a&&b)ph(a,b.textContent.trim().split(" ")[0].toLowerCase())});
/* CTA: the Conversations dashboard, swung in like a hammer, resting at -8.14deg */
(function(){const c=dash.cloneNode(true);c.removeAttribute('id');c.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
 c.querySelector('.cur').remove();c.style.height='1143px';c.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));c.querySelectorAll('.view')[1].classList.add('on');
 c.querySelectorAll('.it').forEach((e,i)=>e.classList.toggle('on',i===1));c.querySelector('.top span').textContent='Conversations';
 const wrap=$('#cclip');wrap.appendChild(c);
 function fitC(){const s=wrap.clientWidth/DW;c.style.transform=`scale(${s})`;wrap.style.height=(1188.6*s)+'px'}
 fitC();addEventListener('resize',fitC);document.fonts.ready.then(fitC)})();


const tt=$('#totop');addEventListener('scroll',()=>tt.classList.toggle('show',scrollY>500),{passive:true});tt.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})});

const tg0=$('#tgl'),tgp=tg0.querySelector('.tg');function moveTg(){const b=tg0.querySelector('button.on');tgp.style.left=b.offsetLeft+'px';tgp.style.width=b.offsetWidth+'px'}
tg0.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(moveTg)));moveTg();document.fonts.ready.then(()=>{tgp.style.transition='none';moveTg();requestAnimationFrame(()=>tgp.style.transition='')});addEventListener('resize',()=>{tgp.style.transition='none';moveTg();requestAnimationFrame(()=>tgp.style.transition='')});

const mb=$('#menu'),mp=$('#mpanel');function setMenu(o){mb.classList.toggle('open',o);mp.classList.toggle('show',o);$('#mov').classList.toggle('show',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')}
mb.addEventListener('click',e=>{e.stopPropagation();setMenu(!mp.classList.contains('show'))});mp.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
docListen('click',e=>{if(!e.target.closest('nav'))setMenu(false)});addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

  return () => { DEAD.v = true; OBS.forEach(o => o.disconnect()); cleanups.forEach(f => f()) }
}
