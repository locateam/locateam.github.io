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

`/admin/` links to the hosted Pages CMS GUI at https://app.pagescms.org/. Its forms are defined in `.pages.yml`. No custom OAuth app or auth server is required. The owner must sign in and install the Pages CMS GitHub App with access only to `locateam/locateam.github.io`; this permission has not been granted by the coding agent.

Projects are JSON in `public/projects`; the editor supports title, description, HTTPS URL, display order and visibility on the homepage. Blog posts are JSON in `public/news`; the editor supports title, date, category, description and plain text paragraphs. Saving commits content and triggers the Pages build. Select the `main` branch in the editor. Post slugs must be unique lowercase Latin words/numbers separated by hyphens; `page` and `index` are reserved. The initial welcome article is sample content. Confirm the Hugging Face profile before launch.

This is a third-party hosted editor with read/write access to the selected repository. Use GitHub App installation settings to revoke access. Repository files (including hidden projects) remain public. `public/admin/config.yml` is the previous Decap schema, retained only as a migration reference; the admin page no longer loads Decap.

## Design

Light theme; Canvas #FBFBF8, Mist #DBE3E9, Cornflower #6AA6DA, Pear #E1E5AC, Black #000000. Balsamiq Sans and Stick are local fonts with bundled OFL licenses. Interface icons use Phosphor; GitHub/Hugging Face brand SVGs come from Simple Icons (CC0). Button and pagination follow shadcn composition with local styles. Motion respects reduced-motion; static headline remains visible without JavaScript.

## Verification

Unit checks cover pagination boundaries, legacy/new routes and text deformation. `scripts/check-build.mjs` verifies prerendered content, canonical tags, sitemap URLs, internal file links and admin noindex. Browser checks cover homepage, blog and article at 320, 390, 768 and 1440 CSS pixels, hydration errors, local fonts/images and legacy redirects. Real devices, production hosting and OAuth require separate checks after deployment.
