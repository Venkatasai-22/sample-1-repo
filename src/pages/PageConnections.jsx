import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { routes } from '../routes.mjs';
const descriptions = { apparel: 'Find your next canvas.', produce: 'Build your printing setup.', bulk: 'Bring your people together.', studio: 'Make something that is yours.' };
export default function PageConnections({ current }) {
  return <section className="page-connections" aria-label="Explore more of ColorFlu"><div><p className="eyebrow">KEEP CREATING</p><h2>Where next?</h2></div><div className="connection-links">{Object.entries(descriptions).filter(([key]) => key !== current).map(([key, description]) => <a key={key} href={routes[key].path}><span>{routes[key].title}<small>{description}</small></span><ArrowUpRight size={20}/></a>)}</div></section>;
}
