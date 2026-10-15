# Migración del dominio de IBIT al portfolio

## Estado actual: publicado el 15 de octubre de 2026

- Repositorio: `https://github.com/EzeVillo/portfolio`, rama `main`.
- Sitio Netlify: `ezevillo-portfolio` (`9a3f2e9a-f9a5-4dcd-a4cc-50f75ac7d067`).
- Dominio: `https://ezevillo.com`, con certificado válido para el dominio y
  `www.ezevillo.com`. HTTP y `www` redirigen al origen canónico.
- Despliegue automático: webhook de GitHub para cada push y clave de despliegue
  de solo lectura. El build ejecuta `npm run check` con Node.js 24.
- La URL `ezevillo-portfolio.netlify.app` redirige al dominio canónico, incluida
  cualquier ruta y sus parámetros. Las URLs inmutables de despliegue permiten
  verificar una versión antes de publicarla en el dominio.
- Las dos versiones de IBIT, Git Review y Truco responden `200` en las rutas
  originales. Se quitó el login de Netlify que impedía el acceso público a Truco.
- Se publicó `bdd3da8` en IBIT después de comprobar las rutas bajo el portfolio.
  Su origen `neon-macaron-a52e5c.netlify.app` y sus variables se conservaron.

Verificación reproducible: `npm run check:live` realiza 47 solicitudes para
comprobar páginas, assets, sitemaps, redirecciones con parámetros y las CSP.
`npm run check` también comprueba el hash del JSON-LD autorizado por la CSP.
La política de la home se limita a `/` e `/index.html`: una regla `/*` también
sobrescribe la CSP de los proxies y bloquea Cloudflare y otras conexiones.

Durante la migración, algunas respuestas del subdominio nativo conservaron
cabeceras anteriores al revalidar con `304`. Se purgó la caché y se comprobó
también la URL inmutable del despliegue. Al cambiar cabeceras, verificar la
respuesta efectiva en producción, además del estado `ready` de Netlify.

## Estado antes de publicar, comprobado el 15 de octubre de 2026

- `ezevillo.com` está asociado al sitio `neon-macaron-a52e5c`, vinculado a
  `EzeVillo/ibit-to-btc`. Ese despliegue también enruta Git Review y Truco.
- El portfolio todavía no tiene sitio de Netlify ni remoto Git configurado.
- Las dos versiones del conversor responden `200` en su origen nativo:
  `https://neon-macaron-a52e5c.netlify.app/ibit-to-btc/` y su subruta `ar/`.
- Git Review responde `200` en `https://ezevillo-git-review-workflow.netlify.app/`.
- Truco responde `401` en `https://ezevillo-truco-a-3.netlify.app/truco-a-3/`.
  Resolver o confirmar ese acceso antes de dar la migración por terminada.

En ese momento la preparación se limitaba a archivos y commits locales;
el resto de esta guía conserva el procedimiento de migración y recuperación.

## Responsabilidades

| Proyecto | Configuración que conserva |
| --- | --- |
| Portfolio `ezevillo` | Home, dominio, proxies de los proyectos, normalización de entradas y `robots.txt` del dominio |
| `ibit-to-btc` | Build del conversor, rutas propias, CSP, caché, sitemap y función privada `refresh-rates` |
| Git Review y Truco | Sus archivos, builds, rutas internas y headers |

No mover las variables privadas de cotizaciones al portfolio. `SITE_URL` y
`ALLOWED_ORIGIN` siguen siendo `https://ezevillo.com`, y `APP_BASE_PATH` sigue
siendo `/ibit-to-btc/`. La API pública permanece en Cloudflare.

## Procedimiento de publicación

1. Mantener el despliegue vigente de IBIT mientras posea el dominio. No publicar
   antes la eliminación de sus proxies: dejaría Git Review y Truco sin rutas.
   Si se sube ese commit a una rama con auto deploy, detener primero ese auto
   deploy o conservar el commit fuera de la rama publicada hasta el paso 5.
2. Crear el remoto del portfolio y conectarlo a un sitio nuevo de Netlify en
   el mismo equipo. Usar este `netlify.toml`: `npm run check`, publicación de
   `public/` y Node.js 24. Mantener el nombre del sitio de IBIT para que su
   subdominio nativo siga siendo el origen del proxy.
3. Publicar primero el portfolio en su URL nativa y verificar la home, sus
   assets, los tres proxies y las rutas de la tabla siguiente. En las páginas
   de IBIT, comprobar que la CSP y los headers de caché vienen de su origen.
   Las cotizaciones restringen CORS a `ezevillo.com`: su funcionamiento completo
   se comprueba después de trasladar el dominio.
4. Reasignar `ezevillo.com` del sitio de IBIT al sitio del portfolio. Revisar
   los aliases que existan al momento del cambio y verificar DNS y TLS. No
   borrar el sitio de IBIT: sigue sirviendo el conversor y su tarea privada.
5. Verificar todas las rutas bajo `https://ezevillo.com` y recién entonces
   desplegar la limpieza de IBIT. Comprobar que `refresh-rates` sigue figurando
   como Scheduled cada 15 minutos y que ambas versiones leen cotizaciones.

## Verificación de rutas

| Solicitud | Resultado esperado |
| --- | --- |
| `/` | Home del portfolio, `200` |
| `/ibit-to-btc` y `/ibit-to-btc/ar` | Un `301` a su versión con barra; después `200` |
| `/ibit-to-btc/` y `/ibit-to-btc/ar/` | Conversor en inglés y español, respectivamente, `200` |
| `/ibit-to-btc/assets/...` | Asset del conversor, sin redirigir al dominio de origen |
| `/ibit-to-btc/sitemap.xml` | Sitemap del conversor con URLs de `ezevillo.com` |
| `/git-review-workflow` | Un `301` a `/git-review-workflow/`; después `200` |
| `/git-review-workflow/` y sus assets | Landing y archivos de su origen, `200` |
| `/truco-a-3` | Un `301` a `/truco-a-3/`; después `200` |
| `/truco-a-3/` y sus rutas internas | Juego y navegación del origen, `200` |
| `/robots.txt` | Sitemaps de la home y de IBIT |

Probar las entradas también con parámetros, por ejemplo `?ref=portfolio`:
deben conservarse tras el único `301`. Comprobar en el navegador que las
cotizaciones llaman directamente al gateway de Cloudflare.

La normalización de barras se hace en la Edge Function porque [las reglas de
Netlify consideran equivalentes las rutas con y sin barra final](https://docs.netlify.com/manage/routing/redirects/redirect-options/#trailing-slash).
Los [headers de contenido proxificado se definen en el origen](https://docs.netlify.com/manage/routing/headers/).

## Si hay que volver atrás

Si IBIT todavía conserva su despliegue anterior, se puede devolver el dominio
a ese sitio. Si ya se publicó su limpieza, restaurar primero el despliegue
anterior de IBIT con los proxies de Git Review y Truco y luego devolverle el
dominio. Así se recupera el enrutamiento previo.
