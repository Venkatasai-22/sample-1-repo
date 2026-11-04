# ColorFlu Portal Pages

The React frontend now has separate page components and browser-history URLs:

- `/`: brand homepage
- `/apparel`: apparel catalog, categories, search, price sorting and customization
- `/print-produce`: equipment and consumables catalog, support and FAQs
- `/bulk-orders`: purpose, garment selection and a local-only project brief
- `/design-studio`: garment previews, artwork upload and business templates

Header navigation, footer, product enquiry and cross-page suggestions connect
these destinations. Back/forward navigation and direct reloads resolve the same
page independently of the former in-memory Shop tab. Legacy hash bookmarks are
normalized to their matching path. The shared cart remains browser-local.

Production hosting must rewrite unknown non-asset paths to `index.html` for
these SPA URLs. Vite's development server already provides this behavior.
This is a multi-route frontend, not separate backend services. No database,
real order submission or payment processing has been introduced.

The visual direction uses white space with mint, cyan, pink and yellow accents,
lightweight CSS depth/hover effects, and reduced-motion alternatives. An
"endless portal" means connected journeys and no dead-end service pages here;
no fake infinite inventory or continuously loading content is introduced.

## Verification

Verified direct page loading and reload, browser Back, legacy `#studio`
normalization, mobile menu navigation and all four layouts at 390 x 844.
All four mobile pages have no horizontal overflow. Apparel category filtering
and hoodie-to-Studio preselection were exercised in the browser. Printing
product enquiries pass their context to the project brief. Page screenshots
are stored in `docs/page-*.jpg`; no console errors were observed in the final
navigation run. Demo enquiry submission remains browser-local only.
