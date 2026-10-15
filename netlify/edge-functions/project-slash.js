// Netlify redirect rules match both forms of a trailing slash, which can loop.
// Inspect the original URL before proxying each project's entry pages.
// Entry paths are generated from config/routes.mjs by npm run routes.
const entryPaths = ["/ibit-to-btc","/ibit-to-btc/ar","/git-review-workflow","/truco-a-3"];

export default function projectSlash(request, context) {
  const url = new URL(request.url);
  if (entryPaths.includes(url.pathname)) {
    url.pathname += '/';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}

export const config = { path: entryPaths };
