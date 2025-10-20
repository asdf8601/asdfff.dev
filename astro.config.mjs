import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://asdf8601.github.io',
  base: '/asdfff.dev',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    shikiConfig: {
      theme: 'css-variables'
    }
  },
  integrations: [
    {
      name: 'default-layout',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
            markdown: {
              remarkPlugins: [
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
