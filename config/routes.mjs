// Source of truth for public routes. Run `npm run routes` after editing.
export const siteURL = 'https://ezevillo.com';
export const netlifyURL = 'https://ezevillo-portfolio.netlify.app';

export const projects = [
  {
    path: '/ibit-to-btc/',
    origin: 'https://neon-macaron-a52e5c.netlify.app/ibit-to-btc/',
    binding: 'IBIT',
    service: 'ezevillo-ibit-to-btc',
    stripPrefix: false,
    pages: ['ar/'],
  },
  {
    path: '/git-review-workflow/',
    origin: 'https://ezevillo-git-review-workflow.netlify.app/',
    binding: 'GIT_REVIEW',
    service: 'ezevillo-git-review-workflow',
    stripPrefix: true,
  },
  {
    path: '/truco-a-3/',
    origin: 'https://ezevillo-truco-a-3.netlify.app/truco-a-3/',
    binding: 'TRUCO',
    service: 'ezevillo-truco-a-3',
    stripPrefix: true,
  },
];

export const entryPaths = projects.flatMap(({ path, pages = [] }) =>
  ['', ...pages].map(page => `${path}${page}`.slice(0, -1)));
