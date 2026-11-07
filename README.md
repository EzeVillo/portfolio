# Portfolio

Sitio personal de Ezequiel Villordo: [ezevillo.com](https://ezevillo.com).
HTML y CSS estáticos, fuentes locales y sin dependencias de runtime.
Requiere Node.js 22 o superior; CI usa Node.js 24.

```sh
npm run dev                 # http://127.0.0.1:4321
npm run check               # HTML, enlaces, assets, dominio y CSP
npm run cloudflare:check    # Empaquetar sin publicar
npm run check:live          # Verificar los cuatro sitios publicados
```

`public/` contiene únicamente el portfolio. Cada proyecto tiene su propio
subdominio, repositorio y Worker de Cloudflare. No hay proxy ni aliases para las
URLs anteriores. Los enlaces de los proyectos se verifican contra `config/sites.mjs`.

La portada social está en `public/assets/og-portfolio.png` (1200 × 630), con fuente
editable en `design/og.html`. Capturar ese HTML a 1200 × 630 después de cargar las
fuentes para regenerarla. La frase y el dominio quedan dentro de los 630 × 630
centrales para admitir miniaturas cuadradas. Al cambiar el PNG, actualizar la
versión de su URL en `og:image` y `twitter:image` para renovar las cachés sociales.

`npm run cloudflare:config` genera `public/_headers` con la CSP y su hash JSON-LD.
`wrangler.jsonc` declara el Custom Domain de producción y un preview independiente.
El workflow verifica y publica desde `main` con secretos de Actions configurados.

Ver [Publicación y pendientes](docs/cloudflare-migration.md). Los commits locales
no publican ni modifican DNS.
