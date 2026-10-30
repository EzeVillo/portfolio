# Publicación en Cloudflare conservando ezevillo.com

Preparación local del 29 de octubre de 2026. La configuración no acredita un
despliegue: los commits, secretos de Actions, DNS y activación se coordinan aparte.

## Servicios y rutas

| Repositorio | Worker | Assets | Entrada pública | Path en el servicio |
| --- | --- | --- | --- | --- |
| portfolio (`main`) | ezevillo-portfolio | public/ | / | / |
| ibit-to-btc (`main`) | ezevillo-ibit-to-btc | dist/ | /ibit-to-btc/ y ar/ | conserva el prefijo |
| git-review-workflow (`main`) | ezevillo-git-review-workflow | docs/ | /git-review-workflow/ | quita el prefijo |
| fe-truco-to-three (`master`) | ezevillo-truco-a-3 | dist/cloudflare/ | /truco-a-3/ | quita el prefijo |

`config/routes.mjs` declara los bindings internos del hub. No hay llamadas a
Netlify en el Worker. El hub conserva parámetros, barras finales, CSP y caché del
proyecto y repone el prefijo en los redirects de los servicios hijos. La API de
cotizaciones y la API/WebSocket de Truco siguen usando sus gateways actuales de
Cloudflare; la API Java continúa en Render.

Las visitas a assets propios del hub se sirven directamente. Las peticiones que
pasan por su código para llegar a otro servicio sí consumen el cupo de Workers
(100.000 solicitudes/día por cuenta en Free, compartido con otros Workers).
No configurar Workers Builds además de Actions: duplicaría publicaciones.

## Preparación y publicación, cuando se decida activar

1. Usar la **misma cuenta Cloudflare** que los gateways existentes. Los cuatro
   Workers y los service bindings deben pertenecer a ella. El dominio puede
   continuar registrado en DonWeb; para usar Cloudflare como DNS hay que importar
   todos los registros, incluidos correo/TXT, y cambiar los nameservers en DonWeb.
   Guardar antes los registros de Netlify para poder recuperarlos.
2. En cada repositorio, configurar los secretos de GitHub Actions
   `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit en esa cuenta) y
   `CLOUDFLARE_ACCOUNT_ID`. Para publicar el refresco de IBIT también se necesita
   acceso de lectura a KV para resolver el binding; no hace falta una clave REST
   de escritura de KV en el Worker, porque usa su binding nativo.
3. Detener los builds automáticos de Netlify sin borrar sus sitios ni su
   configuración. Se mantienen como respaldo hasta verificar el dominio nuevo.
4. Publicar primero los tres servicios hijos: IBIT desde `main`, Truco desde
   `master` y Git Review desde un tag `landing-vX.Y.Z` cuyo commit incluya esta
   migración. Los workflows de cada repo verifican antes de desplegar. Para la
   primera publicación también se puede ejecutar Wrangler localmente después
   de construir cada proyecto; no se necesita cambiar el dominio todavía.
5. Publicar el preview del portfolio después de los hijos con
   `npm run cloudflare:preview`. Comprobar sus rutas en
   `https://ezevillo-portfolio-preview.<subdominio-cuenta>.workers.dev`. Después,
   publicar el Worker de producción con `npm run cloudflare:deploy` o su workflow.
   `wrangler.jsonc` **no adjunta el dominio automáticamente**. Producción omite
   `routes` y usa `workers_dev: false` para conservar las asociaciones del dashboard
   en despliegues siguientes; el preview tiene un nombre y configuración separados.
6. En el Worker `ezevillo-portfolio`, agregar `ezevillo.com` como **Custom Domain**.
   Esta asociación se administra en el dashboard y no se declara en Wrangler.
   Configurar en la zona una Redirect Rule de `www.ezevillo.com` a
   `https://ezevillo.com` con 301, preservando path y query, y activar **Always Use
   HTTPS**. `www` necesita un registro DNS proxificado. No asignar el dominio a
   los servicios hijos. Comprobar certificados antes de dar el cambio por listo.
7. Verificar home, IBIT en ambos idiomas, guías de Git Review, rutas profundas y
   PWA de Truco, imágenes/JS/CSS, sitemaps y parámetros. El origen CORS sigue
   siendo `https://ezevillo.com`; no agregar orígenes de preview al backend.
8. Coordinar por separado el cron de IBIT según su `docs/cloudflare-migration.md`.
   Mantener un único programador activo. Conservar el gateway y el namespace KV.

## Comprobaciones locales

```powershell
# portfolio
npm run check
npm run cloudflare:check
# ../ibit-to-btc
npm test
npm run build:cloudflare
npm run gateway:test
npm run cloudflare:check
npm run refresh:test
# ../fe-truco-to-three
pnpm lint
pnpm test --watch=false
pnpm test:hosting
pnpm run build:cloudflare
pnpm run cloudflare:check
# ../git-review-workflow (los tests Bats se ejecutan en Docker)
node scripts/check-logo-assets.mjs
node scripts/check-landing.mjs
npx --yes wrangler@4.148.0 deploy --dry-run --outdir dist/landing-worker
```

Los `--dry-run` validan y empaquetan localmente: no publican, no cambian DNS y no
activan cron. Para una prueba HTTP del destino, `npm run check:live -- <origen>`
comprueba las rutas del hub. La comparación con los antiguos orígenes de Netlify
es opcional (`--compare-netlify`), porque sus versiones pueden diferir.

## Recuperación

Desasociar el Custom Domain de Cloudflare y restaurar los registros guardados de
Netlify. Las configuraciones originales de los cuatro sitios siguen versionadas;
no eliminarlas hasta verificar la migración. Si también se cambió el programador
de IBIT, desactivar primero el cron de Cloudflare y recién después restaurar el
de Netlify. Evitar dos tareas consultando simultáneamente a los proveedores.
