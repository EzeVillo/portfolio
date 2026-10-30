# Portfolio

Sitio personal de Ezequiel Villordo: [ezevillo.com](https://ezevillo.com).
HTML y CSS estáticos, fuentes locales y sin dependencias de runtime.

Requiere Node.js 22 o superior; producción usa Node.js 24.

```sh
npm run dev          # Vista local en http://127.0.0.1:4321
npm run check        # Validaciones locales y pruebas
npm run check:live   # Verificación del sitio publicado, sin desplegar
```

El contenido está en `public/`. La configuración de Cloudflare Workers conserva
el dominio y conecta cada proyecto con su despliegue independiente mediante
service bindings. La migración está preparada; su activación y recuperación se
describen en [Publicación en Cloudflare](docs/cloudflare-migration.md).
Netlify se conserva como respaldo durante la transición.

La portada para compartir la raíz está en `public/assets/og-portfolio.png`
(1200 × 630), con su fuente editable en `design/og.html`. Para regenerarla,
capturar ese HTML a 1200 × 630 después de cargar las fuentes locales.
`public/index.html` define la imagen para Open Graph y Twitter.

Para modificar rutas, editar `config/routes.mjs` y ejecutar `npm run routes`.
Ese comando mantiene las reglas de respaldo de Netlify. El Worker importa las
rutas directamente. `npm run cloudflare:config` genera las cabeceras estáticas;
`npm run check` verifica rutas, bindings, cabeceras y pruebas de enrutamiento.

El workflow de Cloudflare verifica y publica desde `main`, una vez configurados
sus secretos. `npm run cloudflare:check` empaqueta sin publicar y
`npm run cloudflare:deploy` publica manualmente. El dominio se asocia al Worker
después de verificar los servicios hijos; los commits locales no cambian el sitio.
