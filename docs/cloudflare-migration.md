# Publicación por subdominios

La migración del 3 de noviembre de 2026 separó los proyectos en subdominios.
El 12 de noviembre se añadieron redirecciones permanentes para recuperar enlaces
a las antiguas páginas públicas y conservar sus parámetros de consulta.

| Proyecto | Rama | Custom Domain | Worker | Assets |
| --- | --- | --- | --- | --- |
| Portfolio | main | ezevillo.com | ezevillo-portfolio | public/ |
| IBIT | main | ibit.ezevillo.com | ezevillo-ibit-to-btc | dist/ |
| Git Review | main, tags landing-v* | git-review.ezevillo.com | ezevillo-git-review-workflow | docs/ |
| Truco | master | truco.ezevillo.com | ezevillo-truco-a-3 | dist/cloudflare/ |

Los cuatro Workers sirven sus archivos directamente. El portfolio usa
`public/_redirects` para llevar cada página anterior a su equivalente con un
301. IBIT en español vive
en `https://ibit.ezevillo.com/ar/`. Truco instala su PWA en la raíz de su subdominio.
Cada `robots.txt` anuncia únicamente el sitemap de su propio host.

## Estado publicado

Los cinco repositorios se subieron a sus ramas principales y los cuatro frontends
se publicaron correctamente. Git Review se publicó con `landing-v0.1.0`; sus
releases de CLI y clientes se gestionan aparte.

La zona DNS está activa en Cloudflare, con Always Use HTTPS. DonWeb conserva el
registro del dominio. Se retiró el A del dominio raíz que apuntaba al hosting
anterior; los cuatro hosts están asociados a sus Workers. Se conservaron el
CNAME de `www` y el TXT de verificación de Google. En Cloudflare, el CNAME
`www` apunta a `ezevillo.com` con proxy activo. La regla «www a ezevillo.com»
coincide con el host exacto y envía un 301 a HTTPS conservando ruta y consulta.

El usuario cargó los secretos de Actions en los cuatro repositorios. Ambos
gateways se actualizaron conservando secretos y almacenamiento. IBIT respondió
para ambos mercados y pasó la comprobación de vigencia. Se verificó el transporte
REST/SockJS/WebSocket de Truco con el nuevo origen, sin iniciar sesión; su estado
operativo se documenta en `docs/PRODUCCION.md` del repositorio backend.

`npm run check:live` comprueba páginas, assets, canónicas, sitemaps y redirects.
Search Console leyó los cuatro sitemaps el 12 de noviembre de 2026. El de Truco
incluye la portada y las reglas. El acceso y el registro indican `noindex`.
Umami recibió visitas y eventos de IBIT y Git Review en sus subdominios.
Los cuatro proyectos de Netlify figuran como `Paused` desde el 12 de noviembre
de 2026. Sus URLs `netlify.app` devuelven 404. La desactivación conserva la
configuración de los proyectos. Se desvincularon `ezevillo.com` y
`www.ezevillo.com` del portfolio antiguo en Netlify. IBIT ya estaba desactivado
antes de poner en marcha el refresco programado de Cloudflare. El estado de
ejecución se documenta en `../ibit-to-btc/docs/cloudflare-migration.md`.

## Publicaciones siguientes

Los workflows del portfolio e IBIT publican desde `main`; Truco, desde `master`.
Git Review publica sólo con tags `landing-vX.Y.Z`, independientes de CLI/clientes.
Conservar `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en Actions, con permisos
para Workers y sus Custom Domains. `wrangler.jsonc` administra la asociación y
Cloudflare, los certificados. El portfolio sólo publica sus assets.

Los gateways se publican por separado según las guías de cada repositorio. El
refresco de IBIT sólo se publica cuando se solicita explícitamente; un push
común no activa ni actualiza su cron.

## Pendientes operativos

Completar la comprobación autenticada de Truco con login, invitaciones, eventos
de partida y PWA. Hasta ahora se verificó la apertura WebSocket sin sesión.

## Verificación local

Portfolio: `npm run check` y `npm run cloudflare:check`.
IBIT: `npm test`, `npm run build:cloudflare`, `npm run gateway:test`,
`npm run cloudflare:check` y `npm run refresh:test`.
Truco: `pnpm lint`, `pnpm test --watch=false`, `pnpm test:hosting`,
`pnpm run build:cloudflare` y `pnpm run cloudflare:check`.
Git Review: checker de logo y landing, tests Bats en Docker y dry run de Wrangler.
Backend: tests de gateway HTTP/WebSocket y tests Java de producción/ingreso.

Los dry runs no publican, no cambian DNS y no activan el cron.
