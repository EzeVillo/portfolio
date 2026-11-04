# Publicación por subdominios

Estado comprobado el 3 de noviembre de 2026. Por decisión de Ezequiel, los
proyectos no tienen usuarios y se abandona la compatibilidad con las URLs viejas:
no se mantienen proxies, redirects de migración ni despliegues de respaldo.

| Proyecto | Rama | Custom Domain | Worker | Assets |
| --- | --- | --- | --- | --- |
| Portfolio | main | ezevillo.com | ezevillo-portfolio | public/ |
| IBIT | main | ibit.ezevillo.com | ezevillo-ibit-to-btc | dist/ |
| Git Review | main, tags landing-v* | git-review.ezevillo.com | ezevillo-git-review-workflow | docs/ |
| Truco | master | truco.ezevillo.com | ezevillo-truco-a-3 | dist/cloudflare/ |

Los cuatro Workers sirven sus archivos directamente. El portfolio sólo contiene
enlaces a los proyectos; las subrutas viejas no se atienden. IBIT en español vive
en `https://ibit.ezevillo.com/ar/`. Truco instala su PWA en la raíz de su subdominio.
Cada `robots.txt` anuncia únicamente el sitemap de su propio host.

## Estado publicado

Los cinco repositorios se subieron a sus ramas principales y los cuatro frontends
se publicaron correctamente. Git Review se publicó con `landing-v0.1.0`; sus
releases de CLI y clientes se gestionan aparte.

La zona DNS está activa en Cloudflare, con Always Use HTTPS. DonWeb conserva el
registro del dominio. Se retiró el A del dominio raíz que apuntaba al hosting
anterior; los cuatro hosts están asociados a sus Workers. Se conservaron el
CNAME de `www` y el TXT de verificación de Google.

El usuario cargó los secretos de Actions en los cuatro repositorios. Ambos
gateways se actualizaron conservando secretos y almacenamiento. IBIT respondió
para ambos mercados y pasó la comprobación de vigencia. Se verificó el transporte
REST/SockJS/WebSocket de Truco con el nuevo origen, sin iniciar sesión; su estado
operativo se documenta en `docs/PRODUCCION.md` del repositorio backend.

`npm run check:live` comprobó 51 solicitudes de páginas, assets, robots y sitemaps.
Los builds de los cuatro sitios antiguos en Netlify están detenidos. El proyecto
anterior de IBIT se desactivó completamente antes de activar su cron privado de
Cloudflare cada 15 minutos; el usuario cargó Finnhub sin compartir el valor.
El estado de ejecución se documenta en `../ibit-to-btc/docs/cloudflare-migration.md`.
Los sitios antiguos todavía no se eliminaron.

## Publicaciones siguientes

Los workflows del portfolio e IBIT publican desde `main`; Truco, desde `master`.
Git Review publica sólo con tags `landing-vX.Y.Z`, independientes de CLI/clientes.
Conservar `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en Actions, con permisos
para Workers y sus Custom Domains. `wrangler.jsonc` administra la asociación y
Cloudflare, los certificados. El portfolio sólo publica sus assets.

Los gateways se publican por separado según las guías de cada repositorio. El
refresco de IBIT sólo se publica cuando se solicita explícitamente; un push
común no activa ni actualiza su cron.

## Pendiente fuera de los repositorios

1. Verificar en Umami que la propiedad compartida acepta los nuevos hosts. El
   código de Git Review e IBIT ya limita sus trackers a sus respectivos
   subdominios, conservando website ID y etiqueta de proyecto.
2. Completar la comprobación autenticada de Truco: login, invitaciones, eventos de
   partida y PWA. La apertura WebSocket sin sesión no prueba esos flujos.
3. Retirar los sitios antiguos de Netlify después de comprobar el cron nuevo. No se
   necesitan redirects desde las URLs anteriores.

## Verificación local

Portfolio: `npm run check` y `npm run cloudflare:check`.
IBIT: `npm test`, `npm run build:cloudflare`, `npm run gateway:test`,
`npm run cloudflare:check` y `npm run refresh:test`.
Truco: `pnpm lint`, `pnpm test --watch=false`, `pnpm test:hosting`,
`pnpm run build:cloudflare` y `pnpm run cloudflare:check`.
Git Review: checker de logo y landing, tests Bats en Docker y dry run de Wrangler.
Backend: tests de gateway HTTP/WebSocket y tests Java de producción/ingreso.

Los dry runs no publican, no cambian DNS y no activan el cron.
