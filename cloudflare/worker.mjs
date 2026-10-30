import { entryPaths, projects } from '../config/routes.mjs';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default {
  async fetch(request, env) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const url = new URL(request.url);
    if (entryPaths.includes(url.pathname)) {
      url.pathname += '/';
      return Response.redirect(url.href, 301);
    }
    const project = projects.find(({ path }) => url.pathname.startsWith(path));
    if (!project) return new Response('Página no encontrada', { status: 404 });
    // Bindings select fixed services: no user-supplied origin or external proxy.
    if (project.stripPrefix) url.pathname = url.pathname.slice(project.path.length - 1);
    try {
      const upstream = await env[project.binding].fetch(new Request(url, request));
      const response = new Response(upstream.body, upstream);
      const location = response.headers.get('location');
      if (project.stripPrefix && location) {
        const destination = new URL(location, url);
        if (destination.origin === url.origin) {
          destination.pathname = project.path.slice(0, -1) + destination.pathname;
          response.headers.set('location', destination.href);
        }
      }
      for (const [name, value] of Object.entries(securityHeaders)) response.headers.set(name, value);
      // Each project owns its CSP, cache policy and redirects.
      return response;
    } catch {
      return new Response('Proyecto temporalmente no disponible', { status: 502 });
    }
  },
};
