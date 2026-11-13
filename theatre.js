/* 计时与 DOM 分开；同一状态机也能在 Node 中验证。 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WorldTheatre = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  function createPlayer(episode, options = {}) {
    const frames = episode.beats.flatMap((beat, beatIndex) => beat.frames.map((frame, frameIndex) => ({ ...frame, beatIndex, frameIndex })));
    const now = options.now || (() => performance.now());
    const schedule = options.setTimer || setTimeout;
    const unschedule = options.clearTimer || clearTimeout;
    const loadImage = options.loadImage;
    let timer = null, deadline = 0, generation = 0, destroyed = false;
    const saved = options.initial || {};
    const index = Number.isInteger(saved.index) ? Math.max(0, Math.min(frames.length - 1, saved.index)) : 0;
    const state = {
      index, displayedIndex: null, status: 'idle', started: Boolean(saved.started),
      remainingMs: Number.isFinite(saved.remainingMs) ? Math.max(0, Math.min(frames[index].durationMs, saved.remainingMs)) : frames[index].durationMs,
      error: null,
    };

    function snapshot() {
      return { ...state, remainingMs: state.status === 'playing' ? Math.max(0, deadline - now()) : state.remainingMs };
    }
    function emit() { if (!destroyed) options.onChange?.(snapshot()); }
    function cancel() { generation += 1; if (timer !== null) unschedule(timer); timer = null; }
    function prefetch() {
      if (frames[state.index + 1]) Promise.resolve().then(() => loadImage(frames[state.index + 1].image)).catch(() => {});
    }
    function tick() {
      timer = null;
      state.remainingMs = 0;
      if (state.index === frames.length - 1) { state.status = 'ended'; emit(); return; }
      request(state.index + 1, true);
    }
    function run() {
      if (destroyed) return;
      state.status = 'playing';
      deadline = now() + state.remainingMs;
      timer = schedule(tick, state.remainingMs);
      emit();
    }
    async function request(nextIndex, autoplay, remainingMs = frames[nextIndex].durationMs) {
      cancel();
      const token = generation;
      state.index = nextIndex;
      state.remainingMs = remainingMs;
      state.started = true;
      state.status = 'loading';
      state.error = null;
      emit();
      try {
        const image = await loadImage(frames[nextIndex].image);
        // 离屏、取消和导航后的迟到解码不能重新开播。
        if (destroyed || token !== generation) return;
        state.displayedIndex = nextIndex;
        state.status = 'paused';
        options.onFrame?.(frames[nextIndex], image);
        prefetch();
        if (autoplay) run(); else emit();
      } catch (error) {
        if (destroyed || token !== generation) return;
        state.status = 'error';
        state.error = error;
        emit();
      }
    }
    function pause() {
      if (destroyed) return;
      if (state.status === 'playing') state.remainingMs = Math.max(0, deadline - now());
      const wasActive = state.status === 'playing' || state.status === 'loading';
      cancel();
      if (wasActive) state.status = 'paused';
      emit();
    }
    function play() {
      if (destroyed || state.status === 'playing' || state.status === 'ended') return;
      if (state.displayedIndex !== state.index || state.status === 'error') {
        request(state.index, true, state.remainingMs); return;
      }
      if (state.remainingMs === 0) { tick(); return; }
      cancel(); run();
    }
    function seekBeat(beatIndex) {
      if (destroyed || beatIndex < 0 || beatIndex >= episode.beats.length) return;
      request(frames.findIndex(frame => frame.beatIndex === beatIndex), false);
    }
    return {
      play, pause, snapshot, frames,
      seekBeat,
      previous: () => seekBeat(frames[state.index].beatIndex - 1),
      next: () => seekBeat(frames[state.index].beatIndex + 1),
      restart: () => { if (!destroyed) request(0, true); },
      retry: () => { if (!destroyed) request(state.index, false, state.remainingMs); },
      restore: () => { if (!destroyed && state.started && state.displayedIndex === null) request(state.index, false, state.remainingMs); },
      destroy: () => { pause(); destroyed = true; cancel(); },
    };
  }

  function createImageLoader(ImageType = Image) {
    const cache = new Map();
    return function loadImage(src) {
      if (cache.has(src)) return cache.get(src);
      const promise = new Promise((resolve, reject) => {
        const image = new ImageType();
        let finished = false;
        const timeout = setTimeout(() => finish(new Error('图片加载超时')), 20000);
        function finish(error) {
          if (finished) return;
          finished = true;
          clearTimeout(timeout);
          image.onload = image.onerror = null;
          if (error) reject(error); else resolve(image);
        }
        image.onload = async () => {
          try { if (image.decode) await image.decode(); finish(); } catch (error) { finish(error); }
        };
        image.onerror = () => finish(new Error('图片暂时无法打开'));
        image.src = src;
      });
      cache.set(src, promise);
      promise.catch(() => { if (cache.get(src) === promise) cache.delete(src); });
      return promise;
    };
  }

  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function validEpisode(episode) {
    return episode && typeof episode.id === 'string' && typeof episode.title === 'string' && typeof episode.cover === 'string'
      && Number.isFinite(episode.durationMs) && episode.durationMs > 0 && Array.isArray(episode.cast)
      && Array.isArray(episode.beats) && episode.beats.length > 0 && episode.beats.every(beat => beat
        && ['speaker', 'text', 'alt', 'readingFrame'].every(key => typeof beat[key] === 'string') && Array.isArray(beat.frames)
        && beat.frames.length > 0 && beat.frames.every(frame => frame && typeof frame.image === 'string' && Number.isFinite(frame.durationMs) && frame.durationMs > 0));
  }

  function mount(host, episode, options = {}) {
    if (!validEpisode(episode)) {
      const beats = Array.isArray(episode?.beats) ? episode.beats : [];
      host.innerHTML = `<div class="theatre-unavailable"><h3>${escape(episode?.title || '日常小剧场')}</h3><p>小剧场暂时没有打开，可以先读对白。</p>${beats.map(beat => `<p><strong>${escape(beat?.speaker)}</strong> ${escape(beat?.text)}</p>`).join('')}<button data-refresh>刷新页面</button></div>`;
      host.querySelector('[data-refresh]').onclick = () => location.reload();
      return { pause() {}, destroy() {}, snapshot: () => null };
    }
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const profiles = options.profiles || [];
    let disposed = false, reading = media.matches || Boolean(options.initial?.reading);
    let restored = false, sharing = false, imageFailed = false;
    const loadImage = createImageLoader();
    const shareURL = new URL(location.href);
    shareURL.hash = `theatre/${episode.id}`;
    host.className = 'theatre';
    host.innerHTML = `<div class="theatre-heading"><h3>${escape(episode.title)}</h3><span>约 ${Math.round(episode.durationMs / 1000)} 秒 · ${episode.beats.length} 幕</span></div>
      <p class="theatre-summary">${escape(episode.summary)}</p>
      <div class="theatre-player" role="region" aria-label="${escape(episode.title)}播放器" aria-describedby="theatre-keys" tabindex="0">
        <figure class="theatre-frame"><img data-stage data-src="${escape(episode.cover)}" width="1200" height="900" decoding="async" alt="${escape(episode.beats[0].alt)}"><div class="theatre-image-note" hidden></div></figure>
        <div class="theatre-caption"><div><span data-count></span><strong data-speaker></strong></div><p data-dialogue></p></div>
        <div class="theatre-controls"><button data-previous aria-label="上一幕">上一幕</button><button data-toggle>开始播放</button><button data-next aria-label="下一幕">下一幕</button><button data-replay>重播</button><span data-status role="status" aria-live="polite"></span></div>
        <div class="theatre-recovery" hidden><p>这张图片暂时无法打开，仍可阅读对白。页面更新后，刷新可取得新图片。</p><button data-retry>重试图片</button><button data-refresh>刷新页面</button></div>
        <p id="theatre-keys" class="visually-hidden">播放器获得焦点时，空格播放或暂停，左右方向键逐幕阅读。</p>
      </div>
      <div class="theatre-links"><button data-reading aria-expanded="${reading}" aria-controls="theatre-reader">${reading ? '回到播放器' : '静态阅读'}</button><button data-share>分享这出戏</button><span class="theatre-cast">参演：${episode.cast.map(id => `<a data-focus-key="theatre-${escape(id)}" href="#character/${escape(id)}">${escape(profiles.find(profile => profile.id === id)?.name || id)}</a>`).join('、')}</span></div>
      <div class="theatre-share" hidden><label for="theatre-link">这出戏的链接</label><div><input id="theatre-link" readonly value="${escape(shareURL.href)}"><button data-copy>复制链接</button></div><p data-share-status role="status"></p></div>
      <section id="theatre-reader" class="theatre-reader" ${reading ? '' : 'hidden'} aria-label="六幕静态阅读"><h4 tabindex="-1">${escape(episode.title)} · 静态阅读</h4><ol>${episode.beats.map((beat, index) => `<li><figure><img data-static data-src="${escape(beat.readingFrame)}" width="1200" height="900" decoding="async" alt="${escape(beat.alt)}"><figcaption><span class="theatre-reading-count">第 ${index + 1} 幕</span><p class="theatre-action">${escape(beat.alt)}</p><p class="theatre-line"><strong>${escape(beat.speaker)}</strong>${escape(beat.text)}</p></figcaption></figure><div class="theatre-static-error" hidden><span>图片暂时无法打开。</span><button data-static-retry>重试图片</button><button data-refresh>刷新页面</button></div></li>`).join('')}</ol><button data-back-player>回到播放器</button></section>`;
    const playerBox = host.querySelector('.theatre-player');
    const stage = host.querySelector('[data-stage]');
    const imageNote = host.querySelector('.theatre-image-note');
    const toggle = host.querySelector('[data-toggle]');
    const status = host.querySelector('[data-status]');
    const reader = host.querySelector('#theatre-reader');
    const readingButton = host.querySelector('[data-reading]');
    const player = createPlayer(episode, {
      loadImage, initial: options.initial,
      onFrame(frame) {
        imageFailed = false;
        stage.src = frame.image; stage.alt = episode.beats[frame.beatIndex].alt; stage.hidden = false;
      },
      onChange(state) {
        if (disposed) return;
        // 暂停或取消重试不会修好图片；实际呈现成功后才清除回退。
        if (state.status === 'error') imageFailed = true;
        const shownIndex = !imageFailed && state.displayedIndex !== null ? state.displayedIndex : state.index;
        const beat = episode.beats[player.frames[shownIndex].beatIndex];
        const selectedBeat = player.frames[state.index].beatIndex;
        host.querySelector('[data-count]').textContent = `第 ${player.frames[shownIndex].beatIndex + 1} / ${episode.beats.length} 幕`;
        host.querySelector('[data-speaker]').textContent = beat.speaker;
        host.querySelector('[data-dialogue]').textContent = beat.text;
        host.querySelector('[data-previous]').disabled = selectedBeat === 0;
        host.querySelector('[data-next]').disabled = selectedBeat === episode.beats.length - 1;
        toggle.disabled = state.status === 'ended';
        toggle.textContent = ({ idle: '开始播放', loading: '取消加载', playing: '暂停', paused: '继续播放', ended: '播放结束', error: '继续播放' })[state.status];
        toggle.setAttribute('aria-pressed', String(state.status === 'playing'));
        playerBox.setAttribute('aria-busy', String(state.status === 'loading'));
        status.textContent = ({ idle: '点击播放，或逐幕阅读', loading: '正在准备画面…', playing: '', paused: '已暂停', ended: '这一出，到这里。', error: '图片未能打开' })[state.status];
        host.querySelector('.theatre-recovery').hidden = !imageFailed;
        imageNote.hidden = !imageFailed;
        imageNote.textContent = imageFailed ? beat.alt : '';
        if (imageFailed) stage.hidden = true;
        options.onState?.({ ...state, reading });
      },
    });
    // 首帧未解码前不计时；这里只加载靠近视口的封面与静态图。
    function loadVisibleImage(image) {
      if (image.getAttribute('src') || !image.dataset.src || disposed) return;
      image.src = image.dataset.src;
    }
    const lazy = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { loadVisibleImage(entry.target); lazy.unobserve(entry.target); }
    }), { rootMargin: '200px 0px' });
    host.querySelectorAll('img[data-src]').forEach(image => lazy.observe(image));
    stage.onerror = () => {
      if (disposed) return;
      imageFailed = true;
      const beat = episode.beats[player.frames[player.snapshot().index].beatIndex];
      imageNote.hidden = false; imageNote.textContent = beat.alt;
      stage.hidden = true; host.querySelector('.theatre-recovery').hidden = false;
    };
    host.querySelectorAll('[data-static]').forEach(image => {
      const error = image.closest('li').querySelector('.theatre-static-error');
      image.onerror = () => { if (!disposed) { image.hidden = true; error.hidden = false; } };
      image.onload = () => { image.hidden = false; error.hidden = true; };
      error.querySelector('[data-static-retry]').onclick = () => { image.removeAttribute('src'); loadVisibleImage(image); };
    });
    function showReading(value, focus = true) {
      reading = value; player.pause();
      playerBox.hidden = value; reader.hidden = !value;
      readingButton.textContent = value ? '回到播放器' : '静态阅读';
      readingButton.setAttribute('aria-expanded', String(value));
      if (focus) {
        const target = value ? reader.querySelector('h4') : playerBox;
        target.focus({ preventScroll: true }); target.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      options.onState?.({ ...player.snapshot(), reading });
    }
    toggle.onclick = () => ['playing', 'loading'].includes(player.snapshot().status) ? player.pause() : player.play();
    host.querySelector('[data-previous]').onclick = player.previous;
    host.querySelector('[data-next]').onclick = player.next;
    host.querySelector('[data-replay]').onclick = player.restart;
    host.querySelector('[data-retry]').onclick = player.retry;
    host.querySelectorAll('[data-refresh]').forEach(button => { button.onclick = () => location.reload(); });
    readingButton.onclick = () => showReading(!reading);
    host.querySelector('[data-back-player]').onclick = () => showReading(false);
    playerBox.onkeydown = event => {
      if (event.target !== playerBox || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === ' ' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.preventDefault();
      if (event.key === ' ') toggle.click();
      else if (event.key === 'ArrowLeft') player.previous();
      else if (event.key === 'ArrowRight') player.next();
    };
    const shareBox = host.querySelector('.theatre-share');
    const shareStatus = host.querySelector('[data-share-status]');
    async function copyLink() {
      shareBox.hidden = false;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('复制不可用');
        await navigator.clipboard.writeText(shareURL.href);
        if (!disposed) shareStatus.textContent = '链接已复制。';
      } catch (_) {
        if (disposed) return;
        shareStatus.textContent = '可以选中链接后复制。';
        const field = host.querySelector('#theatre-link'); field.focus(); field.select();
      }
    }
    host.querySelector('[data-copy]').onclick = copyLink;
    host.querySelector('[data-share]').onclick = async () => {
      if (sharing) return;
      player.pause(); sharing = true;
      try {
        if (!navigator.share) { await copyLink(); return; }
        await navigator.share({ title: episode.title, text: episode.summary, url: shareURL.href });
      } catch (_) {
        if (!disposed) { shareBox.hidden = false; shareStatus.textContent = '也可以复制链接分享。'; }
      } finally { sharing = false; }
    };
    const visibility = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) player.pause();
      else if (!restored && options.initial?.started) { restored = true; player.restore(); }
    });
    visibility.observe(playerBox);
    const hidden = () => { if (document.hidden) player.pause(); };
    const pagehide = () => player.pause();
    const reduced = () => { player.pause(); if (media.matches) showReading(true, false); };
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('pagehide', pagehide);
    media.addEventListener('change', reduced);
    showReading(reading, false);
    return {
      pause: player.pause,
      snapshot: () => ({ ...player.snapshot(), reading }),
      destroy() {
        disposed = true; player.destroy(); lazy.disconnect(); visibility.disconnect();
        document.removeEventListener('visibilitychange', hidden);
        window.removeEventListener('pagehide', pagehide);
        media.removeEventListener('change', reduced);
      },
    };
  }
  return { createPlayer, createImageLoader, validEpisode, mount };
});
