# Publicación por subdominios

Configuración preparada el 2 de noviembre de 2026. Por decisión de Ezequiel, los
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

## Pendiente fuera de los repositorios

1. Subir juntos los commits preparados y el trabajo de producción del backend que
   ya se integró en su `master`. Revisar también los commits locales anteriores
   de Git Review e IBIT. No se hizo push durante la preparación.
   El checkout local del backend en `master` es `../api-truco-to-three-production`;
   el otro checkout conserva su revisión de código independiente.
2. Usar la cuenta Cloudflare que contiene los gateways y KV actuales. Importar la
   zona `ezevillo.com` conservando registros ajenos al hosting (correo, TXT, etc.)
   y apuntar sus nameservers desde DonWeb. El registro del dominio puede seguir
   en DonWeb. Retirar los registros de hosting de Netlify que ocupen esos hosts
   y activar Always Use HTTPS en la zona.
3. Configurar `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en los cuatro repos
   de frontend. El token necesita Workers Scripts: Edit; al crear los Custom
   Domains también necesita los permisos de zona necesarios para administrarlos.
   `wrangler.jsonc` declara cada dominio: un deploy real lo asocia a su Worker y
   Cloudflare administra su certificado. No crear un hub de rutas adicional.
4. Publicar cada frontend con su workflow o comando de deploy. Git Review mantiene
   su publicación por tag `landing-vX.Y.Z`, independiente de CLI y clientes.
5. Desplegar el gateway de IBIT: cambian su origen permitido a
   `https://ibit.ezevillo.com` y su endpoint a `/api/rates`. Los datos, KV y Durable
   Object se conservan. Seguir `../ibit-to-btc/docs/cloudflare-migration.md` para
   cargar Finnhub y activar un único cron de actualización.
6. Desplegar el gateway de Truco y el backend de producción. En Render, configurar
   `TRUCO_ALLOWED_ORIGINS=https://truco.ezevillo.com,https://localhost,capacitor://localhost`:
   el valor externo prevalece sobre el YAML. La misma lista se declara en el
   gateway. Conservar sus secretos, la URL del backend y los orígenes nativos.
7. Verificar en Umami que la propiedad compartida acepta los nuevos hosts. El
   código de Git Review e IBIT ya limita sus trackers a sus respectivos
   subdominios, conservando website ID y etiqueta de proyecto.
8. Verificar certificados y ejecutar `npm run check:live` desde el portfolio.
   Comprobar además cotizaciones reales, login, WebSocket y PWA de Truco.
   Las pruebas locales usan proveedores simulados y no acreditan disponibilidad
   ni consumo de CPU del cron con los proveedores reales en Cloudflare Free.
9. Desactivar los sitios, builds y cron anteriores de Netlify. No se prepara una
   vuelta atrás ni se necesitan redirects desde las URLs anteriores.

## Verificación local

Portfolio: `npm run check` y `npm run cloudflare:check`.
IBIT: `npm test`, `npm run build:cloudflare`, `npm run gateway:test`,
`npm run cloudflare:check` y `npm run refresh:test`.
Truco: `pnpm lint`, `pnpm test --watch=false`, `pnpm test:hosting`,
`pnpm run build:cloudflare` y `pnpm run cloudflare:check`.
Git Review: checker de logo y landing, tests Bats en Docker y dry run de Wrangler.
Backend: tests de gateway HTTP/WebSocket y tests Java de producción/ingreso.

Los dry runs no publican, no cambian DNS y no activan el cron.
