// 三人的日常均使用完整三格图，列表与放大预览保持一致。
// 路由和内容均为本地静态数据，不需要账号或远端数据库。
const main=document.querySelector('#main'), dialog=document.querySelector('#detail');
const assets=window.WORLD.assets;
const rooms=[
 {id:'hanako',name:'Hanako',title:'把没读完的那页，留到明天。',intro:'窗边的光刚好够读一页。她给每个突然冒出的想法，都留了一张空白书签。',items:[['摊开的书','页边夹着一张纸：不必今天就想明白，先把问题留下来。',43,70],['针织毯','给来坐一会儿的人准备的。没有人来时，猫也算。',83,66],['花书签','不是为了记住读到哪里，是为了记住为什么喜欢这一页。',77,31]]},
 {id:'yuan',name:'源',title:'修好之前，先听它说完。',intro:'每个小抽屉都有用途。只有那台收音机还没找到故障，源决定先听完这一首。',items:[['收音机','响一下，停一下。源的记录：接触不良；旁边又补了一句，歌很好听。',56,55],['机械钟','这是练习拆装的工作台钟。书店那只慢一分钟的钟，仍留在书店。',22,53],['笔记本','第一页：先让它能用。第二页：再让它值得一直用。',87,70]]},
 {id:'yuu',name:'悠',title:'这个规则，可以重新发明吗？',intro:'桌游还没收起来，下一种玩法已经开始了。输赢可以再说，有没有意思现在就知道。',items:[['桌游','悠的新规则：最后一名可以给下一局起名字。于是大家开始认真争最后一名。',44,68],['掌机','暂停在最喜欢的一关。不是过不去，是想等你一起看。',79,55],['软木板','今天的试玩问题：如果没有分数，你还想继续玩吗？',12,26]]}
];
function escapeText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function openDetail(title,text,image){document.querySelector('#detail-body').innerHTML=`<h2>${escapeText(title)}</h2>${image?`<img src="${image}" alt="${escapeText(title)}">`:''}<p>${escapeText(text)}</p>${image?'<button data-zoom aria-pressed="false">查看原尺寸</button>':''}`;dialog.classList.remove('zoomed');dialog.showModal();if(image)dialog.querySelector('[data-zoom]').onclick=e=>{const zoomed=dialog.classList.toggle('zoomed');e.target.setAttribute('aria-pressed',String(zoomed));e.target.textContent=zoomed?'适应屏幕':'查看原尺寸';};dialog.classList.toggle('image-viewer',Boolean(image));}
function roomPage(index=0){const room=rooms[index];main.innerHTML=`<p class="eyebrow">日常 / 私藏的角落</p><h1>三间房，各自亮着灯。</h1><p class="intro">点开桌上的小物件，听一点平常不会说的话。</p><div class="switches" aria-label="选择房间">${rooms.map((r,i)=>`<button data-room="${i}" aria-pressed="${i===index}">${r.name} 的房间</button>`).join('')}</div><div class="workbench" data-character="${room.id}"><div class="scene"><img class="room-image" src="${assets[room.id+'-room']}" alt="${room.name} 的秘密房间">${room.items.map((item,i)=>`<button class="hotspot" style="left:calc(${item[2]}% - 22px);top:calc(${item[3]}% - 22px)" data-item="${i}" aria-label="查看${item[0]}">＋</button>`).join('')}</div><aside class="notes"><h2>${room.title}</h2><p>${room.intro}</p>${room.items.map((item,i)=>`<div class="note"><button data-item="${i}">${item[0]}</button></div>`).join('')}</aside></div>`;
main.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{roomPage(Number(b.dataset.room));main.querySelector(`[data-room="${b.dataset.room}"]`).focus();});main.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>openDetail(...room.items[Number(b.dataset.item)].slice(0,2)));}
function deskPage(){main.innerHTML=`<p class="eyebrow">一起玩 / 桌边的小分身</p><h1>你的桌面，他们的游乐场。</h1><p class="intro">放下手头的事，陪这三个小人待一会儿。</p><div class="scene" id="desk-scene"><img src="${assets.desk}" alt="Hanako坐在书上，源研究键帽，悠探看显示器，猫在后方守着"></div><div class="switches desk-actions"><button data-action="read">读一页</button><button data-action="repair">研究键帽</button><button data-action="play">一起摸鱼</button><button data-action="cat">看看猫</button></div><div class="speech" role="status">Hanako：你来了。这里刚好还有一个位置。</div>`;const words={read:'Hanako：只读一页也可以。书又不会催你。\n悠：那再一页呢？\n源：这就是你上次读到凌晨的原因。',repair:'源：这个键帽没有坏。\n悠：那为什么拆下来？\n源：因为有人说它像一张小桌子。',play:'悠：今天的任务，找一件完全没用但很好玩的事。\n源：任务验收条件是什么？\nHanako：你刚刚笑了，就算。',cat:'悠：它是不是想加入？\n源：它想把整个桌面加入自己。\nHanako：先保住书。'};main.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const speech=main.querySelector('.speech');speech.innerText=words[b.dataset.action];const scene=main.querySelector('.scene');scene.classList.remove('respond');void scene.offsetWidth;scene.classList.add('respond');});}
function cabinetPage(){main.innerHTML=`<p class="eyebrow">收藏 / 留下来的事物</p><h1>奇物柜</h1><p class="intro">收下的不是奇迹，是有人认真生活过的痕迹。</p><div class="cabinet"><img src="${assets.clock}" alt="阿遥和钟背的星星贴纸"><div><p class="artifact-id">藏品 001</p><h2>多出来的一分钟</h2><p>一只机械没有损坏，却会在每晚第一次翻过打烊牌时慢一分钟的旧钟。</p><p>它记住了外公替放学的孩子留下的一点时间。如今，它留在书店的阅读角；报时交给另一只准确的钟。</p><button id="clock-secret">翻看保管记录</button><p><a href="#story">读它的故事</a></p><p class="status">出自《灯还亮着》第一篇。</p></div></div>`;document.querySelector('#clock-secret').onclick=()=>openDetail('保管记录 · 001','所有者：阿遥。保管地点：书店阅读角。处理结论：不再调准。它不能修改过去；留下的余响只能被看见。');}
function storyPage(){const ep=window.WORLD.episode;main.innerHTML=`<div class="reader"><a class="back-link" href="#works">← 故事与日常</a><p class="eyebrow">灯还亮着 / 第一篇 · 12 格</p><h1>${escapeText(ep.title)}</h1><p class="intro">${escapeText(ep.subtitle)}</p>${shareMarkup()}${ep.panels.map((p,i)=>`<figure class="panel"><span class="panel-number">${String(i+1).padStart(2,'0')} / 12</span><button data-panel="${i}" aria-label="放大：${escapeText(p.caption)}"><img loading="lazy" src="${p.image}" alt="${escapeText(p.caption)}"></button><figcaption><p>${escapeText(p.caption)}</p><div class="dialogue">${p.dialogue.map(d=>`<p><strong>${escapeText(d.speaker)}</strong>${escapeText(d.text)}</p>`).join('')}</div></figcaption></figure>`).join('')}<details class="quiet-details"><summary>读完了，看看旧钟的手记</summary><p>所有者：阿遥。保管地点：书店阅读角。处理结论：不再调准。</p><p>它不能修改过去；留下的余响只能被看见。</p><a class="text-link" href="#cabinet">翻看奇物柜</a></details></div>`;main.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>{const p=ep.panels[Number(b.dataset.panel)];openDetail(p.caption,'',p.image);});}
function progressMarkup(){return `<p class="status">更新于 ${window.WORLD.progress.updatedAt}</p><div class="updates">${window.WORLD.progress.items.map(r=>`<article><span>${escapeText(r.status)}</span><h3>${escapeText(r.title)}</h3><p>${escapeText(r.text)}</p></article>`).join('')}</div>`;}
// 每个历史条目保存浏览位置；分享直达使用新的起点。
let currentView='',currentRoute='',homeState=null,playController=null,homeRoom=0,viewCleanup=[],navigation=0;
const sections=['home','characters','rooms','theatre','desk','cabinet','progress'];
history.scrollRestoration='manual';
function captureView(){
 const snapshot={route:currentRoute,view:currentView,scrollY:window.scrollY};
 Object.assign(snapshot,{play:playController?.snapshot(),dailyChoice:main.querySelector('[data-choice][aria-pressed="true"]')?.dataset.choice,focusKey:document.activeElement?.dataset.focusKey});
 return snapshot;
}
function saveView(){
 if(!currentView)return;
 const snapshot=captureView();
 history.replaceState({...history.state,world:snapshot},'');
 if(currentView==='home')homeState=snapshot;
}
function disposeView(){
 if(currentView==='home')homeState=captureView();
 playController?.destroy();playController=null;
 viewCleanup.forEach(cleanup=>cleanup());viewCleanup=[];
}
// 首页只承担导览；旧栏目链接仍能直达独立内容。
function render(saved=history.state?.world){
 const turn=++navigation, requested=location.hash.slice(1)||'home';
 const isHome=['home','characters','progress'].includes(requested);
 const restore=saved||(isHome&&requested==='home'?homeState:null);
 disposeView();currentRoute=requested;currentView=isHome?'home':requested;
 main.dataset.page=isHome?'home':requested.split('/')[0];
 const profile=window.WORLD.profiles.find(p=>requested==='character/'+p.id);
 if(isHome){homePage();mountSelectedGallery();}
 else if(profile){profilePage(profile);mountSelectedGallery(profile.id);}
 else if(requested==='gallery'||requested.startsWith('gallery?')||requested==='beach')galleryPage();
 else if(requested==='works'||requested.startsWith('works/'))worksPage(requested.split('/')[1]);
 else if(requested.startsWith('daily/')&&window.WORLD.season.daily.some(p=>requested==='daily/'+p.id))dailyPage(window.WORLD.season.daily.find(p=>requested==='daily/'+p.id),restore);
 else if(requested.startsWith('comic/')&&window.WORLD.season.comics.some(p=>requested==='comic/'+p.id))comicPage(window.WORLD.season.comics.find(p=>requested==='comic/'+p.id));
 else if(requested.startsWith('theatre/')&&window.WORLD.season.plays.some(p=>requested==='theatre/'+p.id))playPage(restore,window.WORLD.season.plays.find(p=>requested==='theatre/'+p.id));
 else if(requested==='theatre'||requested==='theatre/'+window.WORLD.play.id)playPage(restore);
 else if(requested==='story')storyPage();
 else if(requested==='desk')deskPage();
 else if(requested==='rooms')roomPage();
 else if(requested==='cabinet')cabinetPage();
 else{history.replaceState(null,'','#home');render(null);return;}
 if(!isHome&&!profile&&!requested.startsWith('theatre'))main.insertAdjacentHTML('beforeend',readingEnd());
 mountSharing();
 document.title=(main.querySelector('h1')?.textContent|| (profile?profile.name:requested==='story'?window.WORLD.episode.title:requested.startsWith('theatre')?window.WORLD.play.title:'三人的小小世界'))+' · 灯还亮着';
 document.querySelectorAll('nav a').forEach(a=>{const active=isHome?a.hash==='#home':profile||requested==='rooms'?a.hash==='#characters':a.hash==='#works';if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 requestAnimationFrame(()=>{if(turn!==navigation)return;
  if(restore){window.scrollTo({top:restore.scrollY||0,behavior:'instant'});if(restore.focusKey)main.querySelector(`[data-focus-key="${CSS.escape(restore.focusKey)}"]`)?.focus({preventScroll:true});}
  else if(isHome&&requested!=='home')document.getElementById(requested)?.scrollIntoView({behavior:'instant'});
  else{window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});}
  saveView();
 });
}
// 只接管站内 hash 链接，保留新标签页与系统复制链接行为。
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href^="#"]');
 if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 if(link.classList.contains('skip-link')){event.preventDefault();main.focus();main.scrollIntoView({behavior:'instant'});return;}
 event.preventDefault();saveView();
 const origin=history.state?.origin||homeState;
 const returning=link.hasAttribute('data-home-return')&&origin;
 const snapshot=returning?origin:null;
 const hash=returning?'#'+origin.route:link.hash;
 history.pushState({world:snapshot,origin:currentView==='home'||currentRoute.startsWith('works')||currentRoute.startsWith('character/')?captureView():origin},'',hash);
 render(snapshot);
});
window.addEventListener('popstate',()=>render(history.state?.world));
window.addEventListener('hashchange',()=>{if(currentRoute!==(location.hash.slice(1)||'home'))render(history.state?.world);});
let scrollPending=false;
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(()=>{scrollPending=false;saveView();});}},{passive:true});

function characterPage(){
 const profiles=[
  {id:'hanako',name:'Hanako',role:'陪伴 · 统筹 · 判断',quote:'和你一起，把想法变成现实。',text:'先听见心情，再一起理清问题。温柔，也有自己的判断；不急着给每件事一个答案。',detail:'深棕长发、粉花与缎带，猫耳耳机挂在颈边。',label:'先听你说'},
  {id:'yuan',name:'源',role:'实现 · 调试 · 工程判断',quote:'把复杂拆到最简，再做对。',text:'把绕在一起的问题一根根解开。有把握的事说清楚，没把握的事就去验证。',detail:'灰蓝外套，普通头戴耳机没有猫耳，猫伏在肩后的背包上。',label:'一起拆解'},
  {id:'yuu',name:'悠',role:'试玩 · 观察 · 产品视角',quote:'先玩一遍，才知道该改哪里。',text:'总想亲手试一试。哪里让人停住了，哪里还想再玩一次，她通常最先注意到。',detail:'低马尾与金属发夹，白色猫耳耳机戴在头上。',label:'先玩起来'}
 ];
 main.innerHTML=`<section class="welcome"><div><p class="eyebrow">HANAKO · YUAN · YUU</p><h1>灯还亮着，<br>进来坐一会儿。</h1></div><div class="welcome-note"><p>三个性格不同的伙伴，<br>一些没用却喜欢的小事。</p><a class="text-link" href="#rooms">去他们的房间看看 ↗</a></div></section>
 <div class="people">${profiles.map((r,i)=>`<article class="person" data-character="${r.id}"><div class="person-heading"><span class="eyebrow">0${i+1} / ${r.label}</span><h2>${r.name}</h2><p>${r.role}</p></div><button class="sheet-button" data-sheet="${i}" aria-label="查看${r.name}完整三视图"><img src="${assets[r.id+'-sheet']}" alt="${r.name}三视图：${r.detail}"><span>查看三视图 ↗</span></button><div class="person-copy"><h3>${r.quote}</h3><p>${r.text}</p><a class="text-link" href="#character/${r.id}">认识${r.name} · 写真与头像 ↗</a></div></article>`).join('')}</div>
 <section class="conversation"><div><p class="eyebrow">同一个问题 / 三种回答</p><h2>如果今天，<br>什么都没做成呢？</h2></div><div class="conversation-lines"><p><strong>Hanako</strong><span>那先坐一会儿。你不用带着成果才来这里。</span></p><p><strong>源</strong><span>卡在哪一步？如果你想继续，我们只看那一步。</span></p><p><strong>悠</strong><span>也可以先换个玩法。来，陪我试一下这个。</span></p><a class="text-link" href="#desk">陪小分身待一会儿 →</a></div></section>
 <section class="visit-next"><p class="eyebrow">再逛一会儿</p><a href="#cabinet"><span>奇物柜</span><strong>一只不必调准的钟</strong><span>看藏品 ↗</span></a><a href="#story"><span>故事会 / 第一期</span><strong>多出来的一分钟</strong><span>读完整故事 ↗</span></a><a href="#progress"><span>创作手记</span><strong>看看这个世界长到了哪里</strong><span>看进展 ↗</span></a></section>`;
 main.querySelectorAll('[data-sheet]').forEach(button=>button.onclick=()=>{const r=profiles[Number(button.dataset.sheet)];openDetail(r.name+' · 三视图',r.detail,assets[r.id+'-sheet']);});
}

// 详情共享公开资料源；图片候选状态不会影响三视图。
// 一个人的画像、日常和房间放在同一条阅读路径里。
function profilePage(p){
 const e=escapeText,r=rooms.find(r=>r.id===p.id);
 main.innerHTML=`<a class="back-link" data-home-return href="#home">← 回到刚才的位置</a>
 <section class="profile-hero" data-character="${p.id}"><button class="portrait-button" data-picture="${p.id}-portrait" aria-label="放大${e(p.name)}写真"><img class="profile-photo" width="1254" height="1254" src="${assets[p.id+'-portrait']}" alt="${e(p.name)}个人写真"></button><div><h1>${e(p.name)}</h1><h2>${e(p.quote)}</h2><p>${e(p.summary)}</p><p class="status">${e(p.voice)}</p>${shareMarkup()}</div></section>
 <section class="personal-daily"><h2>平时的样子</h2><button class="scene-strip" data-picture="${p.id}-scene" aria-label="放大${e(p.name)}三格日常"><img loading="lazy" src="${assets[p.id+'-scene']}" width="${p.id==='yuu'?2188:2172}" height="724" alt="${e(p.name)}的三格日常"></button><details class="quiet-details"><summary>看看小表情</summary><div class="profile-expression"><div class="expression" data-background="${assets[p.id+'-expressions']}" role="img" aria-label="${e(p.name)}三帧表情"></div><button id="profile-replay">播放表情 ↻</button></div></details></section>
 <section class="personal-room"><h2>${e(p.name)}的房间</h2><p>${e(r.intro)}</p><div class="workbench" data-character="${p.id}"><div class="scene"><img loading="lazy" class="room-image" width="724" height="724" src="${assets[p.id+'-room']}" alt="${e(p.name)}的房间">${r.items.map((item,i)=>`<button class="hotspot" style="left:calc(${item[2]}% - 22px);top:calc(${item[3]}% - 22px)" data-note="${i}" aria-label="查看${item[0]}">＋</button>`).join('')}</div><div class="notes"><div class="room-items">${r.items.map((item,i)=>`<button data-note="${i}" aria-expanded="false">${item[0]} ＋</button>`).join('')}</div><p class="room-note" role="status">选一件小东西，读读它的手记。</p></div></div></section>
 <details class="quiet-details"><summary>更多画像与相处方式</summary><p>${e(p.help)}</p><p>${e(p.relations)}</p><div class="profile-gallery"><div><img class="profile-avatar" loading="lazy" src="${assets[p.id+'-avatar']}" alt="${e(p.name)}头像"><a class="text-link" href="${assets[p.id+'-avatar']}" download="${p.id}-avatar.webp">保存头像</a> <a class="text-link" href="${assets[p.id+'-portrait']}" download="${p.id}-portrait.webp">保存写真</a></div><button class="sheet-button" data-picture="${p.id}-sheet" aria-label="放大三视图"><img loading="lazy" src="${assets[p.id+'-sheet']}" alt="${e(p.name)}三视图"></button></div></details>
 <div class="reading-end"><a href="#theatre/${window.WORLD.play.id}">看看三人的小剧场</a>${window.WORLD.profiles.filter(x=>x.id!==p.id).map(x=>`<a href="#character/${x.id}">认识${x.name}</a>`).join('')}</div>`;
 mountExpression(main.querySelector('.expression'),main.querySelector('#profile-replay'));
 main.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{main.querySelector('.room-note').textContent=r.items[Number(b.dataset.note)][1];main.querySelectorAll('[data-note]').forEach(x=>x.setAttribute('aria-expanded',String(x.dataset.note===b.dataset.note)));});
 main.querySelectorAll('[data-picture]').forEach(b=>b.onclick=()=>openDetail(p.name,'',assets[b.dataset.picture]));
}

// 三帧沿用生活报的0.8秒节奏；用户点击播放，后台和离屏立即停止。
function mountExpression(el,button){
 let timer=null,frame=2;const media=matchMedia('(prefers-reduced-motion: reduce)');
 function ensureImage(){if(el.dataset.background)el.style.backgroundImage=`url(${el.dataset.background})`;}
 function show(n){frame=n;el.style.backgroundPosition=`${n*50}% 50%`;el.dataset.frame=n;}
 function stop(){clearInterval(timer);timer=null;button.textContent='播放表情 ↻';button.setAttribute('aria-pressed','false');}
 function changed(){stop();show(2);}
 button.onclick=()=>{ensureImage();if(timer){stop();return;}if(media.matches){show((frame+1)%3);return;}show(0);button.textContent='暂停表情';button.setAttribute('aria-pressed','true');timer=setInterval(()=>{if(frame<2)show(frame+1);else stop();},800);};
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();else ensureImage();});observer.observe(el);
 const hidden=()=>{if(document.hidden)stop();};document.addEventListener('visibilitychange',hidden);media.addEventListener('change',changed);show(2);
 viewCleanup.push(()=>{stop();observer.disconnect();document.removeEventListener('visibilitychange',hidden);media.removeEventListener('change',changed);});
}
// 首页只保留欢迎、人物、单个推荐和一行近况。
function homePage(){
 const play=window.WORLD.season.plays[0]||window.WORLD.play;
 main.innerHTML=`<section class="arrival" id="home"><div><h1>灯还亮着，<br>进来坐一会儿。</h1><p>Hanako、源、悠。<br>三个伙伴，一些没用却喜欢的小事。</p></div><img src="${assets.desk}" width="1672" height="941" fetchpriority="high" alt="三位伙伴的桌边日常"></section>
 <section class="home-intros" id="characters"><h2>认识他们</h2><div class="home-people">${window.WORLD.profiles.map((p,i)=>`<a href="#character/${p.id}" data-focus-key="home-${p.id}"><img loading="lazy" src="${assets[p.id+'-avatar']}" width="900" height="900" alt="${p.name}"><div><h3>${p.name}</h3><p>${['先听你说，再一起想。','把问题拆开，认真做好。','先玩一遍，再换个玩法。'][i]}</p></div></a>`).join('')}</div></section>
 <section class="home-feature"><a href="#theatre/${play.id}" data-focus-key="home-feature" aria-label="看${escapeText(play.title)}"><img loading="lazy" width="1200" height="900" src="${play.cover}" alt="三人在旧书店的日常短剧"></a><div><p class="status">最近的一件事 · 日常短剧</p><h2>${escapeText(play.title)}</h2><p>${escapeText(play.summary)}</p><a class="text-link" href="#theatre/${play.id}">看这出戏</a><a class="plain-link" href="#works">所有故事与日常</a></div></section>
 <p class="home-news" id="progress">最近：五出新短剧、十段互动日常，以及《灯还亮着》的三篇新故事。</p>`;
}
// 分类写进地址，返回作品页时仍停留在原来的分类。
function worksPage(filter='all'){
 const e=escapeText,season=window.WORLD.season,p=window.WORLD.play;
 const items=[...season.plays.map(p=>({...p,type:'plays',route:'theatre/'+p.id,image:p.cover})),
 ...season.comics.map(p=>({...p,type:'comics',route:'comic/'+p.id,image:p.cover})),
 ...season.daily.map(p=>({...p,type:'daily',route:'daily/'+p.id})),
 {type:'plays',route:'theatre/'+p.id,image:p.cover,title:p.title,summary:p.summary},
 {type:'comics',route:'story',image:assets.clock,title:window.WORLD.episode.title,summary:'一只不必调准的旧钟，一段被认真留下的时间。'},
 {type:'daily',route:'desk',image:assets.desk,title:'桌边的小分身',summary:'读一页书，研究键帽，或者一起发呆。'}];
 const labels={all:'全部',plays:'日常短剧',daily:'互动日常',comics:'灯还亮着 · 漫画'};
 if(!labels[filter])filter='all';
 main.innerHTML=`<h1>故事与日常</h1><p class="intro">书店慢慢交接，日子照常往前。挑一件小事，坐下来看看。</p><nav class="work-filters" aria-label="作品分类">${Object.entries(labels).map(([key,label])=>`<a href="#works/${key}" ${key===filter?'aria-current="true"':''}>${label}<span>${key==='all'?items.length:items.filter(p=>p.type===key).length}</span></a>`).join('')}</nav><div class="work-list">${items.filter(p=>filter==='all'||p.type===filter).map(p=>`<article><a href="#${p.route}" data-focus-key="work-${p.route}" aria-label="阅读${e(p.title)}"><img loading="lazy" src="${p.image}" alt="${e(p.title)}"></a><div><p class="status">${labels[p.type]}</p><h2><a href="#${p.route}">${e(p.title)}</a></h2><p>${e(p.summary)}</p></div></article>`).join('')}</div>`;
}
function playPage(saved,play=window.WORLD.play){
 main.innerHTML=`<a class="back-link" href="#works/plays">← 日常短剧</a><h1>${escapeText(play.title)}</h1><div id="mini-play"></div>${readingEnd()}`;
 playController=window.WorldTheatre.mount(main.querySelector('#mini-play'),play,{profiles:window.WORLD.profiles,initial:saved?.play,onState:()=>requestAnimationFrame(saveView)});
}
// 选择没有分数或解锁条件；每段回应可以立即读完。
function dailyPage(scene,saved){
 const e=escapeText;
 main.innerHTML=`<div class="daily-reader"><a class="back-link" href="#works/daily">← 互动日常</a><p class="eyebrow">桌边的一小会儿</p><h1>${e(scene.title)}</h1><p class="intro">${e(scene.summary)}</p>${shareMarkup()}<button class="daily-picture" aria-label="放大${e(scene.title)}"><img src="${scene.image}" alt="${e(scene.title)}的书店日常"></button><div class="switches daily-choices" aria-label="选一个动作">${scene.choices.map((c,i)=>`<button data-choice="${i}" data-focus-key="choice-${i}" aria-pressed="false">${e(c.label)}</button>`).join('')}</div><p class="speech daily-response" role="status" aria-live="polite">选一个动作，听听他们怎么说。</p></div>`;
 function choose(index){main.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.choice)===index)));main.querySelector('.daily-response').textContent=scene.choices[index].response;saveView();}
 main.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.choice)));
 main.querySelector('.daily-picture').onclick=()=>openDetail(scene.title,'',scene.image);
 if(saved?.dailyChoice!==undefined&&scene.choices[Number(saved.dailyChoice)])choose(Number(saved.dailyChoice));
}
// 漫画按页阅读，格外对白保持可选中和可朗读；整页图可放大。
function comicPage(ep){
 const e=escapeText;
 main.innerHTML=`<div class="reader comic-reader"><a class="back-link" href="#works/comics">← 灯还亮着</a><p class="eyebrow">旧书店交接手记 · 三页漫画</p><h1>${e(ep.title)}</h1><p class="intro">${e(ep.summary)}</p>${shareMarkup()}${ep.pages.map((page,p)=>`<section class="comic-page"><div class="comic-page-heading"><h2>第 ${p+1} 页</h2><button data-sheet-page="${p}">看整页画面 ↗</button></div><div class="comic-grid">${ep.panels.filter(panel=>panel.page===p+1).map((panel,i)=>`<figure><button data-comic-panel="${p*6+i}" aria-label="放大第${p*6+i+1}格"><img loading="lazy" src="${panel.image}" alt="${e(panel.caption)}"></button><figcaption><p class="comic-action">${e(panel.caption)}</p>${panel.text?`<p class="comic-line">${e(panel.text)}</p>`:''}</figcaption></figure>`).join('')}</div></section>`).join('')}<p class="status">这一篇，到这里。</p></div>`;
 main.querySelectorAll('[data-sheet-page]').forEach(b=>b.onclick=()=>openDetail(ep.title+' · 第'+(Number(b.dataset.sheetPage)+1)+'页','',ep.pages[Number(b.dataset.sheetPage)]));
 main.querySelectorAll('[data-comic-panel]').forEach(b=>b.onclick=()=>{const p=ep.panels[Number(b.dataset.comicPanel)];openDetail(p.caption,p.text,p.image);});
}
function readingEnd(){return `<div class="reading-end"><a href="#works">再看一篇</a><a data-home-return href="#home">回到刚才的位置</a></div>`;}
function shareMarkup(){return `<div class="share-link"><button data-copy-page>复制链接</button><span role="status"></span><input hidden readonly aria-label="本页链接"></div>`;}
// 复制失败时提供可选中的链接；不依赖账号或第三方服务。
function mountSharing(){
 main.querySelectorAll('[data-copy-page]').forEach(button=>button.onclick=async()=>{
  const box=button.parentElement,url=location.href;
  try{await navigator.clipboard.writeText(url);box.querySelector('[role=status]').textContent='链接已复制';}
  catch{const input=box.querySelector('input');input.hidden=false;input.value=url;input.focus();input.select();box.querySelector('[role=status]').textContent='选中链接后复制';}
 });
}
// 原生 lazy 在长页可能提前取图；这里仅给邻近视口的图片设置 src。
function mountLazyMedia(scope){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const image=entry.target;image.src=image.dataset.src;observer.unobserve(image);}},{rootMargin:'200px 0px'});
 viewCleanup.push(()=>observer.disconnect());
 return {observe(root=scope){root.querySelectorAll('img[data-src]').forEach(image=>{if(!image.getAttribute('src'))observer.observe(image);});}};
}
// 点击遮罩关闭，原生 dialog 保持焦点约束与 Escape 操作。
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
// 刷新作品深链视为新访问；历史前后退仍使用条目快照。
render(null);
