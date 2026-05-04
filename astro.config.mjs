import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import remarkMath from "remark-math"
import remarkToc from "remark-toc"
import rehypeKatex from "rehype-katex"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

import expressiveCode from "astro-expressive-code"

export default defineConfig({
  site: "https://blog.asdfff.dev",
  output: "static",
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      rollupOptions: {
        external: [],
      },
    },
    assetsInclude: ["**/*.json"],
  },
  markdown: {
    remarkPlugins: [remarkMath, remarkToc],
    rehypePlugins: [rehypeKatex, rehypeAutolinkHeadings],
    shikiConfig: {
      theme: "css-variables",
    },
  },
  integrations: [
    expressiveCode({
      themes: ["github-dark", "github-light"],
      themeCssSelector: theme => `[data-theme="${theme.type}"]`,
      styleOverrides: {
        borderRadius: "4px",
        borderColor: "var(--color-border)",
        codeFontFamily: "var(--font-mono)",
        codeBackground: ({ theme }) => (theme.type === "light" ? "#f1f1f1" : "#282828"),
        frames: {
          shadowColor: "transparent",
          editorBackground: ({ theme }) => (theme.type === "light" ? "#f1f1f1" : "#282828"),
          terminalBackground: ({ theme }) => (theme.type === "light" ? "#f1f1f1" : "#282828"),
          editorActiveTabBackground: ({ theme }) =>
            theme.type === "light" ? "#fafafa" : "#1d2021",
          terminalTitlebarBackground: ({ theme }) =>
            theme.type === "light" ? "#e6e6e6" : "#3c3836",
          editorTabBarBackground: ({ theme }) => (theme.type === "light" ? "#e6e6e6" : "#3c3836"),
        },
      },
      defaultProps: {
        wrap: true,
      },
    }),
    mdx(),
    {
      name: "default-layout",
      hooks: {
        "astro:config:setup": ({ updateConfig }) => {
          updateConfig({
            markdown: {
              remarkPlugins: [
                remarkMath,
                remarkToc,
                function defaultLayoutPlugin() {
                  return (_tree, file) => {
                    if (!file.data.astro?.frontmatter?.layout) {
                      if (!file.data.astro) file.data.astro = {}
                      if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {}

                      const filePath = file.history[0] || ""
                      if (filePath.includes("/posts/")) {
                        file.data.astro.frontmatter.layout = "../../layouts/PostLayout.astro"
                      }
                    }
                  }
                },
              ],
            },
          })
        },
      },
    },
  ],
})
