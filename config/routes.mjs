// Source of truth for public routes. Run `npm run routes` after editing.
export const siteURL = 'https://ezevillo.com';
export const netlifyURL = 'https://ezevillo-portfolio.netlify.app';

export const projects = [
  {
    path: '/ibit-to-btc/',
    origin: 'https://ezevillo-ibit-to-btc.netlify.app/ibit-to-btc/',
    pages: ['ar/'],
  },
  {
    path: '/git-review-workflow/',
    origin: 'https://ezevillo-git-review-workflow.netlify.app/',
  },
  {
    path: '/truco-a-3/',
    origin: 'https://ezevillo-truco-a-3.netlify.app/truco-a-3/',
  },
];

export const entryPaths = projects.flatMap(({ path, pages = [] }) =>
  ['', ...pages].map(page => `${path}${page}`.slice(0, -1)));
