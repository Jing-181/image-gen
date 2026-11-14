// 筛选写进地址；相册作品复用人物页浏览图，不额外发布副本。
function galleryImageMarkup(row){
 const photo=window.WORLD.profiles.flatMap(p=>p.photos||[]).find(p=>p.image===row.images[0]);
 if(!photo)return `<img loading="lazy" src="${row.images[0]}" alt="${escapeText(row.title)}">`;
 return `<img loading="lazy" decoding="async" width="${photo.width}" height="${photo.height}" sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 112px) / 2), 380px" data-src="${escapeText(photo.sources[0].image)}" data-srcset="${escapeText(photo.sources.map(s=>s.image+' '+s.width+'w').join(', '))}" alt="${escapeText(photo.alt)}">`;
}
function galleryCards(rows){
 return `<div class="gallery-grid">${rows.map(r=>`<article><button class="gallery-picture" data-work="${r.id}" data-focus-key="gallery-${r.id}" aria-label="放大：${escapeText(r.title)}">${galleryImageMarkup(r)}</button><h2>${escapeText(r.title)}</h2><p>${r.date} · ${escapeText(r.theme)}${r.images.length>1?` · ${r.images.length}幅`:''}</p>${r.route?`<a class="text-link" href="#${r.route}" data-focus-key="gallery-read-${r.id}">读完整作品</a>`:''}</article>`).join('')}</div>`;
}
function mountGalleryPictures(){
 main.querySelectorAll('.gallery-grid').forEach(grid=>mountLazyMedia(grid).observe());
 main.querySelectorAll('[data-work]').forEach(button=>button.onclick=()=>{
  const row=window.WORLD.gallery.works.find(r=>r.id===button.dataset.work);let index=0;
  function show(delta){
   openDetail(row.title+(row.images.length>1?` · ${index+1}/${row.images.length}`:''),'',row.images[index]);
   if(row.images.length<2)return;
   const controls=document.createElement('div');controls.className='switches';
   for(const step of [-1,1]){
    const next=document.createElement('button');next.textContent=step<0?'上一幅':'下一幅';next.dataset.galleryStep=step;
    next.disabled=index+step<0||index+step>=row.images.length;
    next.onclick=()=>{index+=step;show(step);};controls.append(next);
   }
   dialog.querySelector('#detail-body').append(controls);
   // 翻页后焦点留在可用操作；关闭仍返回最初的图集卡片。
   if(delta) (controls.querySelector(`[data-gallery-step="${delta}"]:not(:disabled)`)||controls.querySelector('button:not(:disabled)')).focus({preventScroll:true});
  }
  show();
 });
}
function galleryPage(){
 const q=new URLSearchParams(location.hash.split('?')[1]||'');if(location.hash==='#beach')q.set('theme','海边');
 const actor=q.get('person')||'',theme=q.get('theme')||'',ascending=q.get('sort')==='oldest',works=window.WORLD.gallery.works;
 const rows=works.filter(r=>(!actor||r.characters.includes(actor))&&(!theme||r.theme===theme)).sort((a,b)=>(ascending?1:-1)*a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
 main.innerHTML=`<h1>全部图集</h1><p class="intro">把喜欢的画慢慢收在这里，闲下来再一张张看。</p><form class="gallery-filters"><label>人物<select name="person" data-focus-key="gallery-filter-person"><option value="">所有人物</option>${window.WORLD.profiles.map(p=>`<option value="${p.id}" ${actor===p.id?'selected':''}>${p.name}</option>`).join('')}</select></label><label>主题<select name="theme" data-focus-key="gallery-filter-theme"><option value="">所有主题</option>${[...new Set(works.map(r=>r.theme))].map(t=>`<option ${theme===t?'selected':''}>${escapeText(t)}</option>`).join('')}</select></label><label>时间<select name="sort" data-focus-key="gallery-filter-sort"><option value="newest">从新到旧</option><option value="oldest" ${ascending?'selected':''}>从旧到新</option></select></label></form><p role="status">${rows.length} 件作品</p>${rows.length?galleryCards(rows):'<p>这里暂时没有作品，换个条件看看。</p>'}`;
 main.querySelector('form').onchange=e=>{saveView();const params=new URLSearchParams(new FormData(e.currentTarget));location.hash='gallery?'+params.toString();};
 main.querySelector('form').onsubmit=e=>e.preventDefault();mountGalleryPictures();
}
function mountSelectedGallery(person){
 const ids=person?window.WORLD.gallery.selections.characters[person]||[]:window.WORLD.gallery.selections.home;
 const existing=person?[person+'-portrait',person+'-scene',person+'-room']:['desk','play-02'];
 const selectors=person?['.profile-hero .portrait-button','.personal-daily','.personal-room']:['.arrival>img','.home-feature'];
 existing.forEach((id,i)=>{const el=main.querySelector(selectors[i]);if(el)el.hidden=!ids.includes(id);});
 const rows=ids.filter(id=>!existing.includes(id)).map(id=>window.WORLD.gallery.works.find(r=>r.id===id));
 if(rows.length){main.insertAdjacentHTML('beforeend',`<section><h2>精选画作</h2>${galleryCards(rows)}</section>`);mountGalleryPictures();}
}
