// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking.

/** @type {import('@docusaurus/types').Config} */

import {themes as prismThemes} from 'prism-react-renderer';

const config = {
  title: 'Cursed Seas',
  tagline: 'D&D Campaign',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages
  url: 'https://franky-malone.github.io',
  baseUrl: '/cursed-seas/',

  organizationName: 'franky-malone',
  projectName: 'cursed-seas',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/franky-malone/cursed-seas/tree/main/',
        },

        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },

        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    colorMode: {
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'Cursed Seas',
      logo: {
        alt: 'Cursed Seas Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'wikiSidebar',
          position: 'left',
          label: 'Wiki',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/franky-malone/cursed-seas',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cursed Seas. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;