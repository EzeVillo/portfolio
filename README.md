# Sitio personal y proyectos

## Primera versión del portfolio

La home está implementada en `public/`, sin dependencias de runtime ni proceso
de compilación. Presenta el perfil como **desarrollador de software**, creador de
herramientas y productos propios. La experiencia backend y bancaria queda como
contexto en «Sobre mí». Conserva
el encabezado **«De una idea a algo que podés usar.»**, Git Review, IBIT to BTC,
Truco a 3 puntos, BTC Unspendable Bot y el nodo Bitcoin en una LG V480,
y contacto mediante LinkedIn. La estructura
es presentación, proyectos, sobre mí y contacto. «En lo que estoy» dice:
«Aprendiendo, aplicando y enseñando cómo usar IA». Los proyectos explican
soluciones técnicas concretas, incluida la capacidad de IA de Git Review.
Truco se presenta como un juego web completo: conserva el énfasis en la
arquitectura del backend y suma el frontend Angular, sus modos de juego y
el botón «Jugá al Truco», junto a los repositorios de backend y frontend.

```sh
npm run dev
```

Abrir `http://127.0.0.1:4321/`. `npm run check` comprueba la sintaxis del servidor,
assets locales, anclas, referencias ARIA y metadatos. Las fuentes son locales;
sus licencias están en `public/assets/licenses/`.

Para verificar un despliegue completo: `npm run check:live -- https://ezevillo.com`.
Comprueba la home, los proyectos, sus assets, las redirecciones con parámetros,
los sitemaps y que los proxies conserven la CSP de cada proyecto. La CSP del
portfolio se limita a `/` e `/index.html`; aplicarla a `/*` bloquearía las
conexiones de IBIT a Cloudflare y el funcionamiento de los otros proyectos.

Verificación del ajuste editorial del 14 de octubre de 2026: `npm run check`
pasó. Se revisó la vista previa en escritorio y móvil a 390 y 320 px, sin
desborde horizontal. Los enlaces «Proyectos» y «Sobre mí» quedan visibles en
móvil. Se eliminó el JavaScript y los estilos de las pestañas de «Cómo trabajo».

El ajuste de Truco también pasó `npm run check`. Se revisó la tarjeta en
escritorio y a 390 y 320 px, con los tres enlaces dentro de la pantalla y sin
desborde horizontal. La URL para jugar cargó la portada pública después del
aviso de arranque del servidor; no se creó una cuenta ni se inició una partida.

### Contenido y fuentes

- [LinkedIn público](https://ar.linkedin.com/in/ezevillo): nombre, Buenos Aires,
  experiencia en Banco Supervielle, formación en UTN y colaboración con Somos Más.
- [GitHub público](https://github.com/EzeVillo) y READMEs de los proyectos locales:
  funcionalidades y enlaces. La imagen de Git Review corresponde
  a su captura real de VS Code (`docs/media/vscode-poster-en.png`).
- BTC Unspendable Bot se describe a partir de su README y código local:
  publicaciones diarias en X con datos de Bitcoin Core, precisión en satoshis,
  GitHub Actions y OAuth 2.0. La tarjeta enlaza a la cuenta
  [@UnspendableBTC en X](https://x.com/UnspendableBTC), indicada por el usuario,
  y al repositorio del proyecto con el enlace «GitHub». «Explorá el bot»,
  «Abrí el conversor» y «Jugá al Truco» comparten el estilo de enlace azul.
  Su portada usa fondo oscuro, acento naranja Bitcoin y el titular «Del dato
  de Bitcoin Core al post diario.». Conserva la captura real y muestra el
  recorrido Bitcoin Core → variación en sats → post en X. La composición
  está hecha en HTML y CSS y se apila sobre la descripción a 800 px o menos.
- Truco a 3 puntos sigue el mismo enfoque de portada: captura real del juego
  proporcionada por el usuario, fondo verde y acento amarillo. El titular
  «Una mesa de truco. Siempre a mano.» acompaña la captura completa en vertical
  y las formas de jugar: online, con amigos y contra bots. La portada se apila
  sobre la descripción a 800 px o menos. Se verificó en escritorio, a 801 px
  y en móvil a 390 y 320 px, sin desborde horizontal. `npm run check` pasó.
- IBIT to BTC incorpora las dos capturas completas proporcionadas por el usuario:
  el conversor y el cálculo del costo equivalente por BTC. La portada usa el
  azul oscuro y el acento azul de la herramienta, con el titular «De IBIT y CEDEAR
  a Bitcoin.». Las imágenes se apilan y la portada pasa sobre la descripción
  a 800 px o menos, como las tarjetas de Truco y el bot.
  `npm run check` pasó; se verificaron ambas capturas cargadas, completas y
  sin desborde horizontal en escritorio, a 801 px y en móvil a 390 y 320 px.
  Se presenta como un único proyecto con dos versiones explicadas: Argentina,
  en español, con CEDEAR, cuotas de IBIT, BTC, satoshis, ARS y USD MEP/CCL;
  e internacional, en inglés, con cuotas de IBIT, BTC, satoshis y USD.
  Incluye enlaces directos a ambas y aclara que las capturas son de la argentina.
  La descripción también explica el cálculo del costo equivalente por BTC
  desde el precio promedio de compra. Se contrastó con el README y el código
  de `../ibit-to-btc`; ambas URLs respondieron HTTP 200 con el idioma esperado.
  El ajuste pasó `npm run check` y se verificó sin desborde en escritorio
  y en móvil a 390 y 320 px, con las imágenes cargadas y los enlaces dentro
  del ancho disponible.
- La presentación amplia como desarrollador de software, el foco actual en
  aprender, aplicar y enseñar IA y la eliminación de «Cómo trabajo» siguen el
  ajuste editorial aprobado por el usuario. Las soluciones técnicas de los
  proyectos provienen de sus READMEs locales.
- «De tablet a nodo Bitcoin» suma la reutilización de una LG G Pad V480 como
  nodo podado con Tor, LineageOS y Termux, app nativa Java, API local y control
  de carga en C. La descripción especifica el modelo de 2014, 1 GB de RAM,
  microSD de 32 GB y LineageOS 14.1; Bitcoin Core se presenta sin fijar versión.
  La portada muestra una captura directa del panel nativo,
  obtenida por ADB de la tablet conectada por el usuario. Se conserva completa
  y sin modificar a 1280 × 800 en `public/assets/lg-v480-bitcoin-node.png`,
  con el mismo formato de imagen a la izquierda y texto a la derecha.
  Enlaza al README y al código público; el contenido se contrastó
  con el README local y el repositorio actual mediante la API de GitHub.
  `npm run check` pasó y ambos enlaces respondieron HTTP 200. Se verificó
  en navegador a 1440, 801, 800, 390 y 320 px: sin desborde horizontal,
  portadas apiladas desde 800 px y enlaces dentro de la tarjeta.

No se agregaron empleos, fechas, títulos académicos obtenidos, métricas de
impacto ni credenciales que no se hayan podido comprobar.

### Composición de los proyectos

Los cinco proyectos comparten una portada visual a la izquierda y descripción a la
derecha en escritorio. El texto arranca arriba; el divisor y los enlaces
quedan al pie de la columna, con el mismo margen inferior. La altura sobrante
se distribuye entre la descripción y ese pie, sin centrar el texto ni fijar
alturas. A 800 px o menos, las imágenes se apilan sobre la descripción.

Se verificó en navegador a 1440, 801, 800, 390 y 320 px: imágenes cargadas,
texto alineado arriba, enlaces al pie dentro de las tarjetas y sin desborde
horizontal. `npm run check` pasó.

### Ajuste de lectura y foco en software

El ajuste del 15 de octubre de 2026 presenta cada proyecto con una descripción
breve y párrafos que integran el desarrollo y los detalles técnicos útiles,
sin subtítulos repetidos. Las etiquetas destacan el trabajo
de software: herramientas de desarrollo, datos, tiempo real, automatización
e integración de sistemas. El nodo conserva su lugar y se presenta desde la
app Android, la API local, el servicio en C y la optimización de memoria.

En móvil, hasta 620 px, la tarjeta de presentación se reduce a «En lo que estoy»
y un enlace a Git Review como ejemplo de IA aplicada. La tarjeta del proyecto
explica el recorrido de lectura que puede aportar un agente. A 390 px, la
sección de proyectos comienza aproximadamente a los 800 px, frente a los
1.280 px anteriores. Se mantiene la composición de escritorio y el orden
de los cinco proyectos.

### Publicación

`netlify.toml` configura la carpeta `public`, la verificación de la home y los
proxies de los proyectos. Este repositorio es la fuente de las reglas del dominio:

| Ruta pública | Sitio de origen | Ruta en el origen |
| --- | --- | --- |
| `/` | Este portfolio | `/` |
| `/ibit-to-btc/*` | `neon-macaron-a52e5c.netlify.app` | `/ibit-to-btc/:splat` |
| `/git-review-workflow/*` | `ezevillo-git-review-workflow.netlify.app` | `/:splat` |
| `/truco-a-3/*` | `ezevillo-truco-a-3.netlify.app` | `/truco-a-3/:splat` |

Los rewrites `200` conservan `ezevillo.com` en el navegador. La Edge Function
`netlify/edge-functions/project-slash.js`, trasladada desde IBIT, agrega la barra
final a las entradas de los proyectos y a `/ibit-to-btc/ar` antes del proxy,
conservando los parámetros y evitando bucles. `npm run check` incluye sus pruebas.

Cada origen conserva su build, sus headers y su caché. En IBIT permanecen la
CSP que permite el gateway de Cloudflare, la función programada de cotizaciones
y sus credenciales. Las consultas del navegador van directamente a Cloudflare.
`public/robots.txt` anuncia los sitemaps de la home y del conversor.

**En producción desde el 15 de octubre de 2026:** [ezevillo.com](https://ezevillo.com)
pertenece al sitio `ezevillo-portfolio` de Netlify, conectado a
[`EzeVillo/portfolio`](https://github.com/EzeVillo/portfolio), rama `main`.
Cada push dispara la verificación y el despliegue. La URL nativa del portfolio
redirige al dominio principal, conservando la ruta y los parámetros.
`www.ezevillo.com` y HTTP también redirigen a HTTPS sin `www`.

Se verificaron 47 solicitudes sobre el dominio definitivo: home, cuatro páginas
de proyectos, assets, sitemaps y normalización de rutas. Truco ya es público.
La limpieza de IBIT (`bdd3da8`) está publicada; el conversor conserva su origen,
sus variables privadas y la actualización programada de cotizaciones. Ver
[el registro de migración](docs/netlify-migration.md).

No renombrar `/git-review-workflow/` a `/git-review/`: la tabla siguiente
contiene ejemplos de la propuesta original, no URLs nuevas.

---

## Objetivo

Usar el dominio personal como punto de entrada a todos los proyectos. La raíz
(`/`) tendrá una home y cada producto estará disponible en su propia ruta.
Netlify será el hosting previsto.

## Dirección propuesta para la home

Combinar una presentación personal breve con un catálogo de herramientas:

- Presentación: quién soy y qué construyo.
- Proyectos destacados: IBIT to BTC y Git Review por ahora.
- Cada proyecto con una descripción concreta, una captura y un enlace para abrirlo.
- Una sección breve sobre mí y enlaces a GitHub y contacto.

Empezar con una home liviana. Agregar categorías o filtros cuando la cantidad
de proyectos lo justifique. Cada producto puede conservar su identidad visual
y ofrecer un enlace discreto para volver a la home.

## Estructura de URLs

| Ruta ilustrativa | Contenido |
| --- | --- |
| `/` | Home personal y catálogo de proyectos |
| `/ibit-to-btc/` | Herramienta IBIT to BTC y explicación de su funcionamiento |
| `/git-review/` | Presentación y acceso a Git Review |

Los nombres de las rutas son ejemplos, no una instrucción para cambiar las URLs
publicadas. Conservar las rutas actuales de los proyectos y definir una ruta
estable y descriptiva para cada proyecto nuevo.

## Criterio de SEO

Estar en una subcarpeta no implica una desventaja automática de posicionamiento.
Google evalúa principalmente páginas individuales y también utiliza señales
del sitio completo. Compartir dominio no garantiza que todos los proyectos
se beneficien por igual.

La home presenta a la persona y su trabajo. Cada producto debe tener contenido
propio que responda a lo que sus usuarios buscan: qué hace, cómo se usa,
ejemplos y, cuando corresponda, metodología, fuentes y actualización de datos.

Al implementar:

- Definir título, descripción y URL canónica propios para cada página.
- Servir el contenido explicativo en el HTML inicial.
- Enlazar los proyectos directamente desde la home.
- Mantener un sitemap y revisar la indexación en Search Console.
- Resolver versiones duplicadas con una URL principal por contenido.

Una limitación de marca: Google admite un nombre de sitio por dominio o
subdominio, pero no por subcarpeta. Los productos en `/ruta/` compartirían el
nombre del sitio principal en los resultados, aunque cada página tenga su título.

## Cuándo separar un producto

Mantener las rutas para herramientas y proyectos personales. Si un producto
necesita identidad independiente, evaluar un subdominio. Si se desarrolla como
negocio independiente, evaluar un dominio propio por marca y autonomía.
Comprar otro dominio no mejora por sí solo el posicionamiento.

## Implementación en Netlify

Los productos conservan sus despliegues separados. El sitio principal sirve la
home y dirige cada prefijo al producto correspondiente mediante las reglas
de `netlify.toml`. La publicación y el traslado del dominio están realizados
según [el registro de migración](docs/netlify-migration.md).

## Referencias

- [Guía de SEO de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Sistemas de posicionamiento de Google](https://developers.google.com/search/docs/appearance/ranking-systems-guide)
- [Nombres de sitio en Google](https://developers.google.com/search/docs/appearance/site-names)
- [Reescrituras y proxies en Netlify](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)
