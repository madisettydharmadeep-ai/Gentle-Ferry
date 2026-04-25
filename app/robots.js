export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/memories', '/collections', '/profile', '/api/'],
      },
    ],
    sitemap: 'https://gentleferry.com/sitemap.xml',
    host: 'https://gentleferry.com',
  };
}
