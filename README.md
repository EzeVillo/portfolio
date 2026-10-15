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

Para modificar rutas, editar `config/routes.mjs` y ejecutar `npm run routes`.
Ese comando actualiza las reglas de Netlify y las entradas que normalizan su
barra final. `npm run check` comprueba que ambas sigan sincronizadas.

Netlify publica `public/` y ejecuta `npm run check`. Los pushes a `main`
disparan un despliegue. Sin créditos de publicación se pueden subir commits a
GitHub; Netlify mantiene la versión vigente. Comprobar o reintentar el deploy
cuando vuelva el cupo.
