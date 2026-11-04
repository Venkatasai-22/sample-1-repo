import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import logo from '../../images/colorflu-logo.jpg';
import './intro.css';

export const VISIT_KEY = 'colorflu-film-to-fabric-web-v1';
const POSTER = '/intro/film-to-fabric-poster.jpg';

export default function Intro({ onDone }) {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState('loading');
  const [paused, setPaused] = useState(false);
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const video = useRef(null), previousFocus = useRef(null), finished = useRef(false);
  const root = useRef(null), buffering = useRef(null);
  const clearBuffering = () => { clearTimeout(buffering.current); buffering.current = null; };
  const done = useRef(onDone);
  done.current = onDone;
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    clearBuffering();
    video.current?.pause();
    document.body.classList.remove('cinema-entering');
    document.body.classList.add('cinema-arrived');
    done.current();
    requestAnimationFrame(() => {
      const target = previousFocus.current;
      if (target?.isConnected && target !== document.body) target.focus();
      else document.querySelector('header .brand')?.focus();
    });
  }, []);

  const recoverPlayback = useCallback(() => {
    clearBuffering();
    video.current?.pause();
    if (config?.fallback && config.src !== config.fallback) {
      setConfig(current => ({ ...current, src: current.fallback }));
      setStatus('loading-film');
    } else setStatus('poster');
  }, [config]);

  useEffect(() => () => clearBuffering(), []);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    document.body.classList.remove('cinema-arrived');
    document.body.classList.add('cinema-entering');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    fetch('/intro/film.json', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Intro unavailable'); return response.json(); })
      .then(data => {
        if (finished.current) return;
        if (data.mode !== 'video' || !data.desktop) throw new Error('Invalid intro');
        setConfig({ ...data, src: innerWidth < 700 ? data.mobile || data.desktop : data.desktop });
        setStatus(reduced ? 'poster' : 'loading-film');
      })
      .catch(() => { if (!finished.current) setStatus('poster'); })
      .finally(() => clearTimeout(timeout));
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const change = event => { if (event.matches) finish(); };
    preference.addEventListener('change', change);
    return () => {
      controller.abort(); clearTimeout(timeout);
      preference.removeEventListener('change', change);
      document.body.classList.remove('cinema-entering');
    };
  }, [finish]);

  useEffect(() => {
    if (status !== 'loading-film') return;
    const timeout = setTimeout(recoverPlayback, 8000);
    return () => clearTimeout(timeout);
  }, [status, recoverPlayback]);

  useEffect(() => {
    const element = video.current;
    const hide = () => {
      if (document.hidden && element && !element.paused) { element.pause(); setPaused(true); }
    };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, [config]);

  const play = async () => {
    try {
      if (!video.current) return;
      await video.current.play();
      if (finished.current) { video.current?.pause(); return; }
      setPaused(false); setStatus('playing');
    } catch { setStatus('poster'); }
  };
  const fallback = status !== 'playing';
  return <section ref={root} className="intro cinema fabric-intro" data-status={status}
    role="dialog" aria-modal="true"
    aria-label="Colorflu Film to Fabric introduction"
    onKeyDown={event => { if (event.key === 'Escape') finish(); }}>
    <div className="cinema-scene">
      <img className="cinema-poster" src={config?.poster || POSTER} alt="ColorFlu: Wear Your Creativity" fetchPriority="high" />
      {config?.src && !reduced && <video ref={video} className="cinema-video"
        src={config.src} poster={config.poster || POSTER} muted playsInline preload="auto"
        aria-label="DTF printing, film transfer, heat pressing and peeling animation"
        onCanPlay={() => { if (status === 'loading-film') play(); }}
        onTimeUpdate={() => root.current?.style.setProperty('--film-progress', String(video.current?.duration ? video.current.currentTime / video.current.duration : 0))}
        onWaiting={() => { clearBuffering(); buffering.current = setTimeout(recoverPlayback, 3000); }}
        onPlaying={clearBuffering} onPause={clearBuffering}
        onError={recoverPlayback} onEnded={finish} />}
      {fallback && <div className="fabric-entrance">
        {status === 'poster' && config?.src && !reduced && <button onClick={play}><Play size={17}/>Play intro</button>}
        <button onClick={finish}>Enter ColorFlu<ArrowRight size={18}/></button>
      </div>}
    </div>
    <div className="cinema-bar">
      <a className="cinema-brand" href="#home" aria-label="Go to Colorflu home" onClick={event => { event.preventDefault(); finish(); }}><img src={logo} alt=""/><span>ColorFlu</span></a>
      <div className="cinema-controls">
        {status === 'playing' && <button aria-label={paused ? 'Resume film' : 'Pause film'} onClick={() => {
          if (paused) play(); else { video.current?.pause(); setPaused(true); }
        }}>{paused ? <Play size={17}/> : <Pause size={17}/>}</button>}
        <button autoFocus className="cinema-skip" onClick={finish}>Skip intro<ArrowRight size={15}/></button>
      </div>
    </div>
    <div className="cinema-progress" aria-hidden="true"><span/></div>
  </section>;
}
