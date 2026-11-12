# locaTeam

## Development and deployment

`npm ci`, `npm run dev`. Production: `npm test`, `npm run build`, `node scripts/check-build.mjs`.
`npm run preview -- --host 0.0.0.0` previews the generated output.

GitHub Pages: repository `locateam/locateam.github.io`, branch `main`; enable Settings → Pages → GitHub Actions. The workflow tests, builds, checks static links and deploys `dist`.

## Static pages and search

The build prerenders the homepage, `/blog/`, `/blog/page/2/` (when needed), and `/blog/<slug>/` into HTML. Content and links are readable without JavaScript. React hydrates these pages to enable motion and interactions. Legacy `?blog`/`?post=` links redirect in the browser.

Each page has its own title, description, canonical URL and Open Graph metadata. Blog articles include BlogPosting structured data. The build generates `sitemap.xml`, `.nojekyll` and `404.html`. `/admin/` has noindex and is excluded in robots.txt.

Canonical origin: `https://locateam.github.io`, configured in `src/routes.js` and `public/robots.txt`. Update both if changing domain. Submit `/sitemap.xml` to Google Search Console and Yandex Webmaster after deployment; indexing is controlled by search engines.

## Editorial access

`/admin/` uses Decap CMS. It requires a configured GitHub OAuth proxy: set `backend.base_url` and `backend.auth_endpoint` in `public/admin/config.yml` and register the proxy callback in a GitHub OAuth app. Keep secrets only in the proxy environment. Editors need push access to the repository. Authentication is not connected yet.

Projects are JSON in `public/projects`; the editor supports title, description, HTTPS URL, display order and visibility on the homepage. Blog posts are JSON in `public/news`; the editor supports title, date, category, description and plain text paragraphs. Publishing commits content and triggers the Pages build. Post slugs must be unique lowercase Latin words/numbers separated by hyphens; `page` and `index` are reserved. The initial welcome article is sample content. Confirm the Hugging Face profile before launch.

## Design

Light theme; Canvas #FBFBF8, Mist #DBE3E9, Cornflower #6AA6DA, Pear #E1E5AC, Black #000000. Balsamiq Sans and Stick are local fonts with bundled OFL licenses. Interface icons use Phosphor; GitHub/Hugging Face brand SVGs come from Simple Icons (CC0). Button and pagination follow shadcn composition with local styles. Motion respects reduced-motion; static headline remains visible without JavaScript.

## Verification

Unit checks cover pagination boundaries, legacy/new routes and text deformation. `scripts/check-build.mjs` verifies prerendered content, canonical tags, sitemap URLs, internal file links and admin noindex. Browser checks cover homepage, blog and article at 320, 390, 768 and 1440 CSS pixels, hydration errors, local fonts/images and legacy redirects. Real devices, production hosting and OAuth require separate checks after deployment.
