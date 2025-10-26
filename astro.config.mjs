import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'css-variables'
    }
  },
  integrations: [
    mdx({
      remarkPlugins: [
        remarkMath,
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
      rehypePlugins: [rehypeKatex]
    }),
    {
      name: 'default-layout',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
              markdown: {
                remarkPlugins: [
                  remarkMath,
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
