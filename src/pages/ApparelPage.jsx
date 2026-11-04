import React, { useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';

export default function ApparelPage({ products, renderProducts }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const items = products.filter(item => (category === 'All' || item.category === category) && item.name.toLowerCase().includes(query.toLowerCase()));
  if (sort !== 'featured') items.sort((a, b) => sort === 'low' ? a.price - b.price : b.price - a.price);
  return <main className="apparel-page route-page">
    <section className="page-heading section"><p className="eyebrow">COLORFLU / WEAR & CUSTOMIZE</p><h1>Shop Apparel</h1><div className="page-heading-bottom"><p>Everyday essentials. A little more you.<br/>Find your fit, then make it your own.</p><a href="/design-studio">Create your own<ArrowUpRight size={18}/></a></div></section>
    <section className="apparel-editorial"><img src="/streetwear.jpg" alt="Black graphic T-shirt worn as everyday streetwear"/><div><span>THE EVERYDAY EDIT</span><h2>Wear your<br/>point of view.</h2><a href="/design-studio">Start with your design<ArrowUpRight size={18}/></a></div></section>
    <section className="section apparel-catalog" aria-label="Apparel collection"><div className="catalog-toolbar"><div className="category-tabs" aria-label="Apparel categories">{['All', 'T-shirts', 'Hoodies', 'Caps'].map(item => <button key={item} aria-pressed={category === item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="catalog-search"><Search size={17}/><input type="search" placeholder="Find your next favorite" aria-label="Search apparel" value={query} onChange={event => setQuery(event.target.value)}/></label></div><div className="catalog-meta"><span aria-live="polite">{items.length} pieces</span><label>Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
      {items.length ? renderProducts(items) : <div className="catalog-empty"><h2>No pieces found.</h2><button onClick={() => { setCategory('All'); setQuery(''); }}>Clear filters<X size={16}/></button></div>}
      <p className="demo-note">Illustrative demo prices and photography. Final garment availability and printing are confirmed by our team.</p></section>
    <section className="apparel-service-band"><div><span>01 / YOUR DESIGN</span><h3>Your artwork, your identity.</h3><p>Start with a blank garment and preview a personal print.</p></div><div><span>02 / YOUR CREW</span><h3>Better in good company.</h3><p>Plan coordinated apparel for teams, brands and events.</p></div><a href="/bulk-orders">Build a group order<ArrowUpRight size={20}/></a></section>
  </main>;
}
