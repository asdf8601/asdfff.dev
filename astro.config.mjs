import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import rehypeKatex from 'rehype-katex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://blog.asdfff.dev',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      rollupOptions: {
        external: []
      }
    },
    assetsInclude: ['**/*.json']
  },
  markdown: {
    remarkPlugins: [remarkMath, remarkToc],
    rehypePlugins: [rehypeKatex, rehypeAutolinkHeadings],
    shikiConfig: {
      theme: 'css-variables'
    }
  },
  integrations: [
    mdx({
      remarkPlugins: [
        remarkMath,
        remarkToc,
        function defaultLayoutPlugin() {
          return (_tree, file) => {
            if (!file.data.astro?.frontmatter?.layout) {
              if (!file.data.astro) file.data.astro = {};
              if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {};
              
              const filePath = file.history[0] || '';
              if (filePath.includes('/posts/')) {
                file.data.astro.frontmatter.layout = '../../layouts/PostLayout.astro';
              }
            }
          };
        }
      ],
      rehypePlugins: [rehypeKatex, rehypeAutolinkHeadings]
    }),
    {
      name: 'default-layout',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
              markdown: {
                remarkPlugins: [
                  remarkMath,
                  remarkToc,
                  function defaultLayoutPlugin() {
                  return (_tree, file) => {
                    if (!file.data.astro?.frontmatter?.layout) {
                      if (!file.data.astro) file.data.astro = {};
                      if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {};
                      
                      const filePath = file.history[0] || '';
                      if (filePath.includes('/posts/')) {
                        file.data.astro.frontmatter.layout = '../../layouts/PostLayout.astro';
                      }
                    }
                  };
                }
              ]
            }
          });
        }
      }
    }
  ]
});
