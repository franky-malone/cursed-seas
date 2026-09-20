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

  noIndex: true,

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

  editUrl: ({docPath}) => {
    if (
      docPath.startsWith('players/') ||
      docPath.startsWith('player-s-diary/')
    ) {
      return `https://github.com/franky-malone/cursed-seas/edit/main/docs/${docPath}`;
    }

    return undefined;
  },
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
          title: 'Campaign',
          items: [
            {
              label: "Travel's Diary",
              to: '/docs/category/travels-diary/',
            },
            {
              label: "Players' Diary",
              to: '/docs/category/players-diary/',
            },
            {
              label: 'Players',
              to: '/docs/category/players/',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Homebrew Rules',
              to: '/docs/category/homebrew-rules/',
            },
            {
              label: 'Important Items',
              to: '/docs/category/important-items/',
            },
            {
              label: 'OneNote',
              href: 'https://onedrive.live.com/:o:/g/personal/1164a76b05a28ca0/UgCgjKIFa6dkIIARKzgAAAAAAPnZBa8z4LXpLZ0?rtime=N8juWEQX30g&redeem=aHR0cHM6Ly8xZHJ2Lm1zL28vcyFBcUNNb2dWcnAyUVI4Q3Y1MlFXdk0tQzE2UzJkP2U9Q1ZZTkpU',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cursed Seas.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;