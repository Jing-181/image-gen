// 路由和内容均为本地静态数据，不需要账号或远端数据库。
const main=document.querySelector('#main'), dialog=document.querySelector('#detail');
const assets=window.WORLD.assets;
const rooms=[
 {id:'hanako',name:'Hanako',title:'把没读完的那页，留到明天。',intro:'窗边的光刚好够读一页。她给每个突然冒出的想法，都留了一张空白书签。',items:[['摊开的书','页边夹着一张纸：不必今天就想明白，先把问题留下来。',43,70],['针织毯','给来坐一会儿的人准备的。没有人来时，猫也算。',83,66],['花书签','不是为了记住读到哪里，是为了记住为什么喜欢这一页。',77,31]]},
 {id:'yuan',name:'源',title:'修好之前，先听它说完。',intro:'每个小抽屉都有用途。只有那台收音机还没找到故障，源决定先听完这一首。',items:[['收音机','响一下，停一下。源的记录：接触不良；旁边又补了一句，歌很好听。',56,55],['机械钟','这是练习拆装的工作台钟。书店那只慢一分钟的钟，仍留在书店。',22,53],['笔记本','第一页：先让它能用。第二页：再让它值得一直用。',87,70]]},
 {id:'yuu',name:'悠',title:'这个规则，可以重新发明吗？',intro:'桌游还没收起来，下一种玩法已经开始了。输赢可以再说，有没有意思现在就知道。',items:[['桌游','悠的新规则：最后一名可以给下一局起名字。于是大家开始认真争最后一名。',44,68],['掌机','暂停在最喜欢的一关。不是过不去，是想等你一起看。',79,55],['软木板','今天的试玩问题：如果没有分数，你还想继续玩吗？',12,26]]}
];
function escapeText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function openDetail(title,text,image){document.querySelector('#detail-body').innerHTML=`<h2>${escapeText(title)}</h2>${image?`<img src="${image}" alt="${escapeText(title)}">`:''}<p>${escapeText(text)}</p>`;dialog.showModal();dialog.classList.toggle('image-viewer',Boolean(image));}
function roomPage(index=0){const room=rooms[index];main.innerHTML=`<p class="eyebrow">日常 / 私藏的角落</p><h1>三间房，各自亮着灯。</h1><p class="intro">点开桌上的小物件，听一点平常不会说的话。</p><div class="switches" aria-label="选择房间">${rooms.map((r,i)=>`<button data-room="${i}" aria-pressed="${i===index}">${r.name} 的房间</button>`).join('')}</div><div class="workbench" data-character="${room.id}"><div class="scene"><img class="room-image" src="${assets[room.id+'-room']}" alt="${room.name} 的秘密房间">${room.items.map((item,i)=>`<button class="hotspot" style="left:calc(${item[2]}% - 22px);top:calc(${item[3]}% - 22px)" data-item="${i}" aria-label="查看${item[0]}">＋</button>`).join('')}</div><aside class="notes"><h2>${room.title}</h2><p>${room.intro}</p>${room.items.map((item,i)=>`<div class="note"><button data-item="${i}">${item[0]}</button></div>`).join('')}<p class="status">房间与手记 · 初稿待确认</p></aside></div>`;
main.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{roomPage(Number(b.dataset.room));main.querySelector(`[data-room="${b.dataset.room}"]`).focus();});main.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>openDetail(...room.items[Number(b.dataset.item)].slice(0,2)));}
function deskPage(){main.innerHTML=`<p class="eyebrow">一起玩 / 桌边的小分身</p><h1>你的桌面，他们的游乐场。</h1><p class="intro">放下手头的事，陪这三个小人待一会儿。</p><div class="scene" id="desk-scene"><img src="${assets.desk}" alt="Hanako坐在书上，源研究键帽，悠探看显示器，猫在后方守着"></div><div class="switches desk-actions"><button data-action="read">读一页</button><button data-action="repair">研究键帽</button><button data-action="play">一起摸鱼</button><button data-action="cat">看看猫</button></div><div class="speech" role="status">Hanako：你来了。这里刚好还有一个位置。</div><p class="status">互动插画初版 · 点击触发台词和轻微动效，尚非逐帧角色动画。</p>`;const words={read:'Hanako：只读一页也可以。书又不会催你。\n悠：那再一页呢？\n源：这就是你上次读到凌晨的原因。',repair:'源：这个键帽没有坏。\n悠：那为什么拆下来？\n源：因为有人说它像一张小桌子。',play:'悠：今天的任务，找一件完全没用但很好玩的事。\n源：任务验收条件是什么？\nHanako：你刚刚笑了，就算。',cat:'悠：它是不是想加入？\n源：它想把整个桌面加入自己。\nHanako：先保住书。'};main.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const speech=main.querySelector('.speech');speech.innerText=words[b.dataset.action];const scene=main.querySelector('.scene');scene.classList.remove('respond');void scene.offsetWidth;scene.classList.add('respond');});}
function cabinetPage(){main.innerHTML=`<p class="eyebrow">收藏 / 留下来的事物</p><h1>奇物柜</h1><p class="intro">收下的不是奇迹，是有人认真生活过的痕迹。</p><div class="cabinet"><img src="${assets.clock}" alt="阿遥和钟背的星星贴纸"><div><p class="artifact-id">藏品 001</p><h2>多出来的一分钟</h2><p>一只机械没有损坏，却会在每晚第一次翻过打烊牌时慢一分钟的旧钟。</p><p>它记住了外公替放学的孩子留下的一点时间。如今，它留在书店的阅读角；报时交给另一只准确的钟。</p><button id="clock-secret">翻看保管记录</button><p><a href="#story">读它的故事</a></p><p class="status">出处：《灯还亮着》第一篇。藏品图沿用故事画面。</p></div></div>`;document.querySelector('#clock-secret').onclick=()=>openDetail('保管记录 · 001','所有者：阿遥。保管地点：书店阅读角。处理结论：不再调准。它不能修改过去；留下的余响只能被看见。');}
function storyPage(){const ep=window.WORLD.episode;main.innerHTML=`<div class="reader"><a class="back-link" href="#cabinet">← 回到奇物柜</a><p class="eyebrow">灯还亮着 / 第一篇 · 12 格</p><h1>${escapeText(ep.title)}</h1><p class="intro">${escapeText(ep.subtitle)} · 第一期样刊，后续暂缓</p>${ep.panels.map((p,i)=>`<figure class="panel"><span class="panel-number">${String(i+1).padStart(2,'0')} / 12</span><button data-panel="${i}" aria-label="放大：${escapeText(p.caption)}"><img loading="lazy" src="${p.image}" alt="${escapeText(p.caption)}"></button><figcaption><p>${escapeText(p.caption)}</p><div class="dialogue">${p.dialogue.map(d=>`<p><strong>${escapeText(d.speaker)}</strong>${escapeText(d.text)}</p>`).join('')}</div></figcaption></figure>`).join('')}</div>`;main.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>{const p=ep.panels[Number(b.dataset.panel)];openDetail(p.caption,'',p.image);});}
function progressMarkup(){return `<p class="status">更新于 ${window.WORLD.progress.updatedAt}</p><div class="updates">${window.WORLD.progress.items.map(r=>`<article><span>${escapeText(r.status)}</span><h3>${escapeText(r.title)}</h3><p>${escapeText(r.text)}</p></article>`).join('')}</div>`;}
// 首页保留连续阅读；栏目锚点不会重建 DOM 或重置播放状态。
let currentView='',homeScroll=0;
function render(){
 const requested=location.hash.slice(1)||'home';
 const sections=['home','characters','rooms','theatre','desk','cabinet','progress'];
 if(sections.includes(requested)){
  if(currentView!=='home'){window.stopTheatre?.();homePage();currentView='home';}
  document.title='灯还亮着 · 三人的小小世界';
  requestAnimationFrame(()=>{if(requested==='home')window.scrollTo({top:homeScroll,behavior:'instant'});else document.getElementById(requested)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
 }else{
  if(currentView==='home')homeScroll=window.scrollY;
  window.stopTheatre?.();currentView=requested;
  const profile=window.WORLD.profiles.find(p=>requested==='character/'+p.id);
  if(profile){profilePage(profile);main.dataset.page='profile';document.title=profile.name+' · 灯还亮着';}
  else if(requested==='story'){storyPage();main.dataset.page='story';document.title='多出来的一分钟 · 灯还亮着';}
  else{location.replace('#home');return;}
  window.scrollTo({top:0,behavior:'instant'});
 }
}
window.addEventListener('hashchange',render);
document.querySelector('header').addEventListener('click',e=>{const a=e.target.closest('a');if(a&&a.hash===location.hash){e.preventDefault();render();}});

function characterPage(){
 const profiles=[
  {id:'hanako',name:'Hanako',role:'陪伴 · 统筹 · 判断',quote:'和你一起，把想法变成现实。',text:'先听见心情，再一起理清问题。温柔，也有自己的判断；不急着给每件事一个答案。',detail:'深棕长发、粉花与缎带，猫耳耳机挂在颈边。',label:'先听你说'},
  {id:'yuan',name:'源',role:'实现 · 调试 · 工程判断',quote:'把复杂拆到最简，再做对。',text:'把绕在一起的问题一根根解开。有把握的事说清楚，没把握的事就去验证。',detail:'灰蓝外套，普通头戴耳机没有猫耳，猫伏在肩后的背包上。',label:'一起拆解'},
  {id:'yuu',name:'悠',role:'试玩 · 观察 · 产品视角',quote:'先玩一遍，才知道该改哪里。',text:'总想亲手试一试。哪里让人停住了，哪里还想再玩一次，她通常最先注意到。',detail:'低马尾与金属发夹，白色猫耳耳机戴在头上。',label:'先玩起来'}
 ];
 main.innerHTML=`<section class="welcome"><div><p class="eyebrow">HANAKO · YUAN · YUU</p><h1>灯还亮着，<br>进来坐一会儿。</h1></div><div class="welcome-note"><p>三个性格不同的伙伴，<br>一些没用却喜欢的小事。</p><a class="text-link" href="#rooms">去他们的房间看看 ↗</a></div></section>
 <div class="people">${profiles.map((r,i)=>`<article class="person" data-character="${r.id}"><div class="person-heading"><span class="eyebrow">0${i+1} / ${r.label}</span><h2>${r.name}</h2><p>${r.role}</p></div><button class="sheet-button" data-sheet="${i}" aria-label="查看${r.name}完整三视图"><img src="${assets[r.id+'-sheet']}" alt="${r.name}已采用三视图：${r.detail}"><span>查看三视图 ↗</span></button><div class="person-copy"><h3>${r.quote}</h3><p>${r.text}</p><a class="text-link" href="#character/${r.id}">认识${r.name} · 写真与头像 ↗</a></div></article>`).join('')}</div>
 <section class="conversation"><div><p class="eyebrow">同一个问题 / 三种回答</p><h2>如果今天，<br>什么都没做成呢？</h2><p class="status">日常对话 · 创作初稿</p></div><div class="conversation-lines"><p><strong>Hanako</strong><span>那先坐一会儿。你不用带着成果才来这里。</span></p><p><strong>源</strong><span>卡在哪一步？如果你想继续，我们只看那一步。</span></p><p><strong>悠</strong><span>也可以先换个玩法。来，陪我试一下这个。</span></p><a class="text-link" href="#desk">陪小分身待一会儿 →</a></div></section>
 <section class="visit-next"><p class="eyebrow">再逛一会儿</p><a href="#cabinet"><span>奇物柜</span><strong>一只不必调准的钟</strong><span>看藏品 ↗</span></a><a href="#story"><span>故事会 / 第一期</span><strong>多出来的一分钟</strong><span>读完整故事 ↗</span></a><a href="#progress"><span>创作手记</span><strong>看看这个世界长到了哪里</strong><span>看进展 ↗</span></a></section>`;
 main.querySelectorAll('[data-sheet]').forEach(button=>button.onclick=()=>{const r=profiles[Number(button.dataset.sheet)];openDetail(r.name+' · 已采用三视图',r.detail,assets[r.id+'-sheet']);});
}

// 详情共享公开资料源；图片候选状态不会影响已采用三视图。
function profilePage(p){
 const e=escapeText;
 main.innerHTML=`<a class="back-link" href="#home">← 回到三人总览</a><section class="profile-hero" data-character="${p.id}"><div><img class="profile-photo" src="${assets[p.id+'-portrait']}" alt="${e(p.name)}个人写真候选"><p class="status">日常写真 · 候选待确认</p></div><div class="profile-intro"><p class="eyebrow">${p.id.toUpperCase()} / ${p.mbti}</p><h1>${e(p.name)}</h1><p class="profile-role">${e(p.role)}</p><h2>${e(p.quote)}</h2><p>${e(p.summary)}</p><ul class="profile-traits">${p.traits.map(t=>`<li>${e(t)}</li>`).join('')}</ul></div></section><section class="profile-expression"><div class="expression" style="background-image:url(${assets[p.id+'-expressions']})" role="img" aria-label="${e(p.name)}三帧表情"></div><div><h2>小小的我，也有小情绪。</h2><button id="profile-replay">播放表情 ↻</button><p class="status">三帧切换 · 候选素材</p><a class="text-link" href="#theatre">去看日常小剧场 →</a></div></section><section class="profile-details"><article><p class="eyebrow">01 / 相处方式</p><h2>听见${e(p.name)}的声音</h2><p>${e(p.voice)}</p></article><article><p class="eyebrow">02 / 一起做点什么</p><h2>什么时候找${e(p.name)}</h2><p>${e(p.help)}</p></article><article><p class="eyebrow">03 / 三个人的时候</p><h2>各有自己的位置</h2><p>${e(p.relations)}</p></article></section><section class="profile-gallery"><div><p class="eyebrow">小小的我 / 头像候选</p><img class="profile-avatar" src="${assets[p.id+'-avatar']}" alt="${e(p.name)}头像"><p>同一张写真裁切，保留同一张脸。</p><a class="text-link" href="${assets[p.id+'-avatar']}" download="${p.id}-avatar.webp">保存头像 ↓</a> · <a class="text-link" href="${assets[p.id+'-portrait']}" download="${p.id}-portrait.webp">保存写真 ↓</a></div><div><p class="eyebrow">已采用 / 三视图</p><button class="sheet-button" id="profile-sheet"><img src="${assets[p.id+'-sheet']}" alt="${e(p.name)}完整三视图"><span>放大查看 ↗</span></button></div></section><div class="switches">${window.WORLD.profiles.filter(r=>r.id!==p.id).map(r=>`<a href="#character/${r.id}">去认识${e(r.name)} →</a>`).join('')}<a href="#rooms">去房间坐坐 →</a></div>`;
 mountExpression(document.querySelector('.expression'),document.querySelector('#profile-replay'));
 document.querySelector('#profile-sheet').onclick=()=>openDetail(p.name+' · 已采用三视图','人物视觉基准',assets[p.id+'-sheet']);
}

// 三帧沿用生活报的0.8秒节奏；用户点击播放，后台和离屏立即停止。
function mountExpression(el,button){
 let timer=null,frame=2;const media=matchMedia('(prefers-reduced-motion: reduce)');
 function show(n){frame=n;el.style.backgroundPosition=`${n*50}% 50%`;el.dataset.frame=n;}
 function stop(){clearInterval(timer);timer=null;button.textContent='播放表情 ↻';button.setAttribute('aria-pressed','false');}
 function changed(){stop();show(2);}
 button.onclick=()=>{if(timer){stop();return;}if(media.matches){show((frame+1)%3);return;}show(0);button.textContent='暂停表情';button.setAttribute('aria-pressed','true');timer=setInterval(()=>{if(frame<2)show(frame+1);else stop();},800);};
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();});observer.observe(el);
 const hidden=()=>{if(document.hidden)stop();};document.addEventListener('visibilitychange',hidden);media.addEventListener('change',changed);show(2);
 const previous=window.stopTheatre;window.stopTheatre=()=>{stop();observer.disconnect();document.removeEventListener('visibilitychange',hidden);media.removeEventListener('change',changed);previous?.();window.stopTheatre=null;};
}
function theatrePage(){
 const rows=[['hanako','Hanako','读到有趣的地方','自己读一页，忽然发现一句好话，然后想把它分享给你。','书本下沿仍待修订。'],['yuan','源','把问题一点点解开','发现问题、沿着线索排查，最后确认它真的可以正常工作。','技术审图通过，待采用。'],['yuu','悠','这里怎么点不动？','先试玩，疑惑地再点一次，然后把具体卡点记下来。','前两帧笔记本内页仍待修订。']];
 main.innerHTML=`<p class="eyebrow">三个人 / 三种小日常</p><h1>性格，藏在小动作里。</h1><p class="intro">先看看他们的小表情，再读一段三格日常。都是已归档候选，保留创作中的小瑕疵。</p><div class="expression-roster">${rows.map(r=>`<article><div class="expression" data-expression="${r[0]}" style="background-image:url(${assets[r[0]+'-expressions']})" role="img" aria-label="${r[1]}三帧表情"></div><h2>${r[1]}</h2><button data-play="${r[0]}">播放表情 ↻</button><a class="text-link" href="#character/${r[0]}">认识${r[1]} →</a></article>`).join('')}</div><p class="status">每次播放2.4秒，不自动循环；减少动态模式下按次切换单帧。这是抽帧表情，不是视频。</p>${rows.map(r=>`<section class="daily-scene"><p class="eyebrow">${r[1]}的日常</p><h2>${r[2]}</h2><p>${r[3]}</p>${r[0]==='yuu'?`<div class="scene-frames">${[1,2,3].map((n)=>`<button data-scene="yuu-scene-${n}" aria-label="放大悠第${n}帧"><img loading="lazy" src="${assets['yuu-scene-'+n]}" alt="悠：${['试玩','再点一次','记录卡点'][n-1]}"></button>`).join('')}</div>`:`<button class="scene-strip" data-scene="${r[0]}-scene" aria-label="放大${r[1]}三格日常"><img loading="lazy" src="${assets[r[0]+'-scene']}" alt="${r[1]}：${r[3]}"></button>`}<p class="status">概念候选 · ${r[4]}</p></section>`).join('')}`;
 rows.forEach(r=>mountExpression(main.querySelector(`[data-expression="${r[0]}"]`),main.querySelector(`[data-play="${r[0]}"]`)));
 main.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>openDetail('日常小剧场 · 概念候选','',assets[b.dataset.scene]));
}

// 连续游览的章节使用原图与公开资料，深入阅读仍保留独立链接。
function homePage(){
 main.dataset.page='home';
 main.innerHTML=`<section class="arrival" id="home"><div><p class="status">Hanako、源、悠的日常</p><h1>灯还亮着，<br>进来坐一会儿。</h1><p>有人在读书，有人在研究一个小问题。<br>还有人，已经想好了今天的新玩法。</p><a class="text-link" href="#characters">往里走走 ↓</a></div><img src="${assets.desk}" alt="三位小伙伴在桌边等你"></section>
 <section class="chapter" id="characters"><div class="chapter-heading"><h2>先认识一下，<br>住在这里的三个人。</h2><p>同一个问题，他们总能给出三种不同的回答。</p></div><div class="home-people">${window.WORLD.profiles.map(p=>`<a href="#character/${p.id}" data-character="${p.id}"><img loading="lazy" src="${assets[p.id+'-portrait']}" alt="${p.name}的日常写真候选"><h3>${p.name}</h3><p>${p.summary}</p><span>听听${p.name}的故事 ↗</span></a>`).join('')}</div></section>
 <section class="chapter" id="rooms"><div class="chapter-heading"><h2>再往里，是各自的房间。</h2><p>点点桌上的小东西。每一件，都有一句想说的话。</p></div><div class="switches" aria-label="选择房间">${rooms.map((r,i)=>`<button data-home-room="${i}" aria-pressed="${i===0}">${r.name} 的房间</button>`).join('')}</div><div id="home-room"></div></section>
 <section class="chapter" id="theatre"><div class="chapter-heading"><h2>听，他们又聊起来了。</h2><p>抽帧小剧场 · 第一出</p></div><div id="mini-play"></div><details class="archive-scenes"><summary>翻翻三人的表情与分镜手稿</summary><div class="expression-roster">${window.WORLD.profiles.map(p=>`<article><div class="expression" data-expression="${p.id}" style="background-image:url(${assets[p.id+'-expressions']})" role="img" aria-label="${p.name}三帧表情"></div><h3>${p.name}</h3><button data-play="${p.id}">播放表情 ↻</button></article>`).join('')}</div><div class="scene-frames">${['hanako-scene','yuan-scene','yuu-scene-1','yuu-scene-2','yuu-scene-3'].map(key=>`<button data-scene="${key}" aria-label="放大${key.startsWith('hanako')?'Hanako':key.startsWith('yuan')?'源':'悠'}的分镜"><img loading="lazy" src="${assets[key]}" alt="日常分镜候选"></button>`).join('')}</div><p class="status">分镜候选：Hanako书本下沿、悠前两帧笔记本内页待修；源待采用。</p></details></section>
 <section class="chapter desk-chapter" id="desk"><div><h2>给忙碌的今天，<br>留一点发呆的时间。</h2><p>他们把桌边当作游乐场。你也可以暂时放下手里的事。</p><div class="switches"><button data-chat="0">读一页</button><button data-chat="1">一起摸鱼</button><button data-chat="2">研究键帽</button><button data-chat="3">看看猫</button></div><p class="speech" role="status">Hanako：这里刚好还有一个位置。</p></div><img loading="lazy" src="${assets.desk}" alt="桌边的小分身"></section>
 <section class="chapter cabinet" id="cabinet"><img loading="lazy" src="${assets.clock}" alt="书店里留下的旧钟"><div><p class="status">奇物柜 · 001</p><h2>有些时间，<br>可以不用调准。</h2><p>书店的旧钟，会在打烊时慢一分钟。那是一个人，曾经替另一个人留下的时间。</p><a class="text-link" href="#story">读《多出来的一分钟》 ↗</a><button id="home-clock">翻看保管记录</button><p class="status">第一篇十二格样刊，续篇暂缓。</p></div></section>
 <section class="chapter" id="progress"><div class="chapter-heading"><h2>这个世界，慢慢长大。</h2><p>做到了哪里，还有哪些想法在等着发芽。</p></div>${progressMarkup()}</section>`;
 function selectRoom(index){const r=rooms[index];main.querySelector('#home-room').innerHTML=`<div class="workbench" data-character="${r.id}"><div class="scene"><img class="room-image" src="${assets[r.id+'-room']}" alt="${r.name}的房间">${r.items.map((item,i)=>`<button class="hotspot" style="left:calc(${item[2]}% - 22px);top:calc(${item[3]}% - 22px)" data-room-note="${i}" aria-label="查看${item[0]}">＋</button>`).join('')}</div><aside class="notes"><h3>${r.title}</h3><p>${r.intro}</p><div class="room-items">${r.items.map((item,i)=>`<button data-room-note="${i}" aria-expanded="false">${item[0]} <span>＋</span></button>`).join('')}</div><div class="room-note" role="status">选一件小东西，读读它的手记。</div><p class="status">房间与手记 · 初稿</p></aside></div>`;main.querySelectorAll('[data-room-note]').forEach(b=>b.onclick=()=>{const item=r.items[Number(b.dataset.roomNote)];main.querySelector('.room-note').textContent=item[1];main.querySelectorAll('[data-room-note]').forEach(x=>x.setAttribute('aria-expanded',String(x.dataset.roomNote===b.dataset.roomNote)));});main.querySelectorAll('[data-home-room]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.homeRoom)===index)));}
 selectRoom(0);main.querySelectorAll('[data-home-room]').forEach(b=>b.onclick=()=>selectRoom(Number(b.dataset.homeRoom)));
 window.WORLD.profiles.forEach(p=>mountExpression(main.querySelector(`[data-expression="${p.id}"]`),main.querySelector(`[data-play="${p.id}"]`)));
 main.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>openDetail('日常分镜 · 候选','',assets[b.dataset.scene]));
 const chats=['Hanako：只读一页也可以。书又不会催你。\n悠：那再一页呢？','悠：找一件完全没用但很好玩的事。\n源：验收条件是什么？\nHanako：你刚刚笑了，就算。','源：这个键帽没有坏。\n悠：那为什么拆下来？\n源：因为有人说它像小桌子。','悠：它是不是想加入？\n源：它想把整个桌面加入自己。\nHanako：先保住书。'];main.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>{main.querySelector('.speech').textContent=chats[Number(b.dataset.chat)];});
 main.querySelector('#home-clock').onclick=()=>openDetail('旧钟的保管记录','所有者：阿遥。地点：书店阅读角。处理结论：不再调准。它不能修改过去；留下的余响只能被看见。');
 mountPlay();
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-15% 0px -55% 0px'});main.querySelectorAll('section[id]').forEach(el=>observer.observe(el));const previous=window.stopTheatre;window.stopTheatre=()=>{observer.disconnect();previous?.();window.stopTheatre=null;};
}
// 剧本与渲染分离；离屏、切页和后台都清理计时器。
function mountPlay(){
 const script=window.WORLD.play,host=main.querySelector('#mini-play');let step=0,timer=null;
 host.innerHTML=`<div class="play-heading"><h3>${escapeText(script.title)}</h3><span>约 ${script.beats.length*3} 秒 · 试演</span></div><div class="play-stage"><div class="play-cast">${window.WORLD.profiles.map(p=>`<div class="actor" data-actor="${p.id}"><div class="expression" style="background-image:url(${assets[p.id+'-expressions']})" role="img" aria-label="${p.name}"></div><span>${p.name}</span></div>`).join('')}</div><div class="play-dialogue" aria-live="off"><strong></strong><p></p></div></div><div class="play-controls"><button data-run>开始小剧场</button><button data-next>下一幕</button><span data-step></span></div><p class="status">沿用三帧表情演出，对白与节奏为创作初稿；减少动态模式可逐幕阅读。</p>`;
 const run=host.querySelector('[data-run]'),media=matchMedia('(prefers-reduced-motion: reduce)');
 function show(){const beat=script.beats[step];host.querySelector('.play-dialogue strong').textContent=beat.speaker;host.querySelector('.play-dialogue p').textContent=beat.text;host.querySelector('[data-step]').textContent=`${step+1} / ${script.beats.length}`;host.querySelectorAll('[data-actor]').forEach(el=>{el.classList.toggle('speaking',el.dataset.actor===beat.actor);el.querySelector('.expression').style.backgroundPosition=`${beat.frames[el.dataset.actor]*50}% 50%`;});}
 function stop(){clearInterval(timer);timer=null;run.textContent=step===script.beats.length-1?'再看一遍':'继续播放';run.setAttribute('aria-pressed','false');}
 function next(){step=(step+1)%script.beats.length;show();}
 run.onclick=()=>{if(timer){stop();return;}if(media.matches){next();return;}if(step===script.beats.length-1)step=0;show();run.textContent='暂停';run.setAttribute('aria-pressed','true');timer=setInterval(()=>{next();if(step===script.beats.length-1)stop();},3000);};host.querySelector('[data-next]').onclick=()=>{stop();next();};
 const hidden=()=>{if(document.hidden)stop();};const observer=new IntersectionObserver(e=>{if(!e[0].isIntersecting&&timer)stop();});observer.observe(host);document.addEventListener('visibilitychange',hidden);media.addEventListener('change',stop);show();const previous=window.stopTheatre;window.stopTheatre=()=>{stop();observer.disconnect();document.removeEventListener('visibilitychange',hidden);media.removeEventListener('change',stop);previous?.();window.stopTheatre=null;};
}
// 点击遮罩关闭，原生 dialog 保持焦点约束与 Escape 操作。
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
render();
