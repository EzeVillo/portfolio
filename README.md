# Portfolio

Sitio personal de Ezequiel Villordo: [ezevillo.com](https://ezevillo.com).
HTML y CSS estáticos, fuentes locales y sin dependencias de runtime.

Requiere Node.js 22 o superior; producción usa Node.js 24.

```sh
npm run dev          # Vista local en http://127.0.0.1:4321
npm run check        # Validaciones locales y pruebas
npm run check:live   # Verificación del sitio publicado, sin desplegar
```

El contenido está en `public/`. El dominio y los proxies se sirven desde Netlify;
cada proyecto conserva su despliegue independiente.

La portada para compartir la raíz está en `public/assets/og-portfolio.png`
(1200 × 630), con su fuente editable en `design/og.html`. Para regenerarla,
capturar ese HTML a 1200 × 630 después de cargar las fuentes locales.
`public/index.html` define la imagen para Open Graph y Twitter.

Para modificar rutas, editar `config/routes.mjs` y ejecutar `npm run routes`.
Ese comando actualiza las reglas de Netlify y las entradas que normalizan su
barra final. `npm run check` comprueba que ambas sigan sincronizadas.

Netlify publica `public/` y ejecuta `npm run check`. Los pushes a `main`
disparan un despliegue. Sin créditos de publicación se pueden subir commits a
GitHub; Netlify mantiene la versión vigente. Comprobar o reintentar el deploy
cuando vuelva el cupo.
