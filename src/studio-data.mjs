const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export function artworkKey(art) {
  let hash = 2166136261;
  for (let index = 0; index < art.length; index++) hash = Math.imul(hash ^ art.charCodeAt(index), 16777619);
  return `${art.length}-${(hash >>> 0).toString(16)}`;
}
export const garments = [
  { id: 'tee', label: 'T-shirts', name: 'The Everyday Tee', category: 'T-shirts', price: 599, img: '/tee.jpg', sizes, placements: ['Front', 'Back', 'Left chest'], description: 'Everyday cotton. A fresh canvas for personal prints and team identities.' },
  { id: 'hoodie', label: 'Hoodies', name: 'After Hours Hoodie', category: 'Hoodies', price: 1499, img: '/hoodie.jpg', sizes, placements: ['Front', 'Back', 'Left chest'], description: 'Layer up with a custom print for your brand, campus or crew.' },
  { id: 'sweatshirt', label: 'Sweatshirts', name: 'Studio Crew Sweatshirt', category: 'Sweatshirts', price: 1199, img: '', sizes, placements: ['Front', 'Back', 'Left chest'], description: 'A clean crewneck for coordinated teams and everyday merchandise.' },
  { id: 'cap', label: 'Caps', name: 'Signature Cap', category: 'Caps', price: 449, img: '/cap.jpg', sizes: ['One size'], placements: ['Front'], description: 'A compact front-panel design for events, staff and brand collections.' },
];
export const businessPresets = [
  { id: 'corporate', title: 'Corporate identity', description: 'A clean wordmark for staff apparel and business merchandise.' },
  { id: 'team', title: 'Teams & uniforms', description: 'A bold team identity for clubs, campus groups and work crews.' },
  { id: 'event', title: 'Events & launches', description: 'A graphic mark for celebrations, campaigns and product launches.' },
];
const escapeXml = text => String(text).replace(/[&<>"']/g, value => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[value]);
export function templateArtwork(name, preset) {
  const label = escapeXml((name.trim() || 'YOUR BRAND').slice(0, 28));
  const color = preset === 'team' ? '#ed3d85' : preset === 'event' ? '#178b9c' : '#2353ad';
  const subtitle = preset === 'team' ? 'ONE TEAM. ONE IDENTITY.' : preset === 'event' ? 'MAKE YOUR MOMENT.' : 'PEOPLE. PURPOSE. POSSIBILITIES.';
  const size = name.length > 16 ? 23 : 34;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect x="16" y="24" width="448" height="252" rx="4" fill="#ffffff"/><path d="M48 60H432" stroke="${color}" stroke-width="8"/><text x="240" y="158" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" font-weight="700" fill="${color}">${label}</text><text x="240" y="207" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#24313a">${subtitle}</text><path d="M190 245H290" stroke="${color}" stroke-width="4"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
