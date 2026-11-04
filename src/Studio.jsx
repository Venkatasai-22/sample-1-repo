import React, { useState } from 'react';
import { ArrowRight, Check, RotateCcw, ShoppingBag, Upload } from 'lucide-react';
import { garments, businessPresets, templateArtwork } from './studio-data.mjs';

const colors = { White: '#f4f4f2', Black: '#202020', Cyan: '#28bfd2', Pink: '#ed65a0' };
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function Studio({ onAdd }) {
  const [garmentId, setGarmentId] = useState(() => {
    const requested = new URLSearchParams(location.search).get('garment');
    return garments.some(item => item.id === requested) ? requested : 'tee';
  });
  const [color, setColor] = useState('White');
  const [size, setSize] = useState('M');
  const [placement, setPlacement] = useState('Front');
  const [art, setArt] = useState('');
  const [scale, setScale] = useState(65);
  const [error, setError] = useState('');
  const [preset, setPreset] = useState(null);
  const [brand, setBrand] = useState('YOUR BRAND');
  const garment = garments.find(item => item.id === garmentId);
  const artwork = preset ? templateArtwork(brand, preset) : art;
  const choose = item => {
    setGarmentId(item.id);
    setSize(item.sizes.includes(size) ? size : item.sizes[0]);
    setPlacement(item.placements.includes(placement) ? placement : item.placements[0]);
  };
  const upload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 10485760) {
      setError('Choose a PNG, JPG or WebP under 10 MB.'); return;
    }
    const reader = new FileReader();
    reader.onload = () => { setArt(String(reader.result)); setPreset(null); setError(''); };
    reader.onerror = () => setError('This image could not be read. Please try another file.');
    reader.readAsDataURL(file);
  };
  const reset = () => { setArt(''); setPreset(null); setScale(65); setColor('White'); setError(''); };

  return <main className="section studio business-studio">
    <div className="section-head"><div><p className="eyebrow">COLORFLU / DESIGN STUDIO</p><h1>Make it yours.</h1><p className="studio-intro-copy">Custom T-shirts, hoodies, sweatshirts and caps. For your style, your team or your business.</p></div><a href="/bulk-orders" className="studio-business-link">Planning a business order?<ArrowRight size={16}/></a></div>
    <fieldset className="garment-picker"><legend>Choose your garment</legend><div className="garment-cards">
      {garments.map((item, index) => <button key={item.id} className={`garment-card ${garmentId === item.id ? 'selected' : ''}`} style={{ '--card-delay': `${index * 55}ms` }} aria-pressed={garmentId === item.id} onClick={() => choose(item)}>
        <span className="garment-card-visual" aria-hidden="true"><span className={`garment-mini mini-${item.id}`}/></span>
        <span className="garment-card-copy"><strong>{item.label}</strong><span>From {money(item.price)}</span></span>{garmentId === item.id && <Check className="garment-selected" size={16}/>}</button>)}
    </div></fieldset>
    <div className="studio-grid">
      <div className="preview"><div className="preview-top"><span>{garment.label.toUpperCase()} / {placement.toUpperCase()}</span><button title="Reset design" aria-label="Reset design" onClick={reset}><RotateCcw size={18}/></button></div>
        <div key={`${garment.id}-${placement}`} className={`shirt garment-${garment.id} placement-${placement.toLowerCase().replace(' ', '-')}`} style={{ background: colors[color] }} role="img" aria-label={`${color} ${garment.label}, ${placement} design preview`}>
          <div className="collar" aria-hidden="true"/>{garment.id === 'hoodie' && <><div className="garment-hood" aria-hidden="true"/><div className="garment-pocket" aria-hidden="true"/></>}{garment.id === 'cap' && <div className="garment-brim" aria-hidden="true"/>}
          {artwork ? <img className="shirt-art" src={artwork} alt="Your design" style={{ width: `${scale}%` }}/> : <span className="shirt-mark" style={{ color: color === 'Black' ? '#fff' : '#181818' }}>YOUR<br/>IDEA<br/>HERE<span>✳</span></span>}
        </div><p>{color} / {size} / {placement}</p>
      </div>
      <div className="studio-controls"><h2>{garment.name}</h2><p>{garment.description}</p>
        <fieldset><legend>Garment color / {color}</legend><div className="swatches">{Object.entries(colors).map(([name, value]) => <button key={name} aria-label={name} aria-pressed={color === name} title={name} style={{ background: value }} className={color === name ? 'chosen' : ''} onClick={() => setColor(name)}/>)}</div></fieldset>
        <fieldset><legend>Size</legend><div className="options">{garment.sizes.map(item => <button key={item} aria-pressed={size === item} className={size === item ? 'active' : ''} onClick={() => setSize(item)}>{item}</button>)}</div></fieldset>
        <fieldset><legend>Print placement</legend><div className="options">{garment.placements.map(item => <button key={item} aria-pressed={placement === item} className={placement === item ? 'active' : ''} onClick={() => setPlacement(item)}>{item}</button>)}</div></fieldset>
        <label className="upload"><Upload size={23}/><strong>{artwork ? 'Replace artwork' : 'Upload your artwork'}</strong><span>PNG, JPG, WebP / Up to 10 MB</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload}/></label>
        {error && <p role="alert">{error}</p>}
        {preset && <label>Business or team name<input value={brand} maxLength={28} onChange={event => setBrand(event.target.value)} /></label>}
        {artwork && <><label className="range">Artwork size<input type="range" min="25" max="80" value={scale} onChange={event => setScale(Number(event.target.value))}/></label><button className="text-button" onClick={() => { setArt(''); setPreset(null); }}>Remove artwork</button></>}
        <div className="price-row"><span>Estimated total</span><strong>{money(garment.price + (artwork ? 149 : 0))}</strong></div>
        <button className="primary full" onClick={() => onAdd(garment, true, { color, size, placement, art: artwork })}>Add creation to bag<ShoppingBag size={18}/></button>
        <p className="demo-note">Illustrative demo pricing. Final artwork, print method and placement require approval before production.</p>
      </div>
    </div>
    <section className="business-templates"><div className="section-head"><div><p className="eyebrow">MADE FOR YOUR BUSINESS</p><h2>One brand. A whole team.</h2></div><span>Uniforms, event merchandise and creator collections.</span></div><div className="business-template-grid">
      {businessPresets.map(item => <article key={item.id} className={`business-template ${preset === item.id ? 'is-selected' : ''}`}><div className={`business-template-art template-${item.id}`}><img src={templateArtwork('YOUR BRAND', item.id)} alt={`${item.title} design template`} loading="lazy"/></div><h3>{item.title}</h3><p>{item.description}</p><button onClick={() => { setPreset(item.id); setArt(''); }}>{preset === item.id ? 'Template selected' : 'Apply template'}<ArrowRight size={16}/></button></article>)}
    </div><div className="studio-business-footer"><p>Need mixed sizes, multiple garments or your own brand identity?</p><a href="/bulk-orders">Discuss a bulk order<ArrowRight size={16}/></a></div></section>
  </main>;
}
