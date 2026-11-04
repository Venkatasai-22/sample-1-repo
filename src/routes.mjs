export const routes = {
  home: { path: '/', title: 'Home' },
  apparel: { path: '/apparel', title: 'Shop Apparel' },
  produce: { path: '/print-produce', title: 'Print & Produce' },
  bulk: { path: '/bulk-orders', title: 'Bulk Orders' },
  studio: { path: '/design-studio', title: 'Design Studio' },
};
export function resolveRoute(pathname, hash = '') {
  const legacy = { home: 'home', shop: 'apparel', apparel: 'apparel', supplies: 'produce', studio: 'studio', bulk: 'bulk' };
  if (legacy[hash.slice(1)]) return legacy[hash.slice(1)];
  const path = pathname.replace(/\/$/, '') || '/';
  return Object.keys(routes).find(key => routes[key].path === path) || 'not-found';
}
