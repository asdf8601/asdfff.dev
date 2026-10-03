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
      themes: ["vitesse-light", "vitesse-dark"],
      themeCssSelector: theme => `[data-theme="${theme.type}"]`,
      useDarkModeMediaQuery: false,
      styleOverrides: {
        borderRadius: "8px",
        borderWidth: "1px",
        borderColor: "var(--color-border)",
        codeFontFamily: "var(--font-mono)",
        codeFontSize: "0.85rem",
        codeLineHeight: "1.65",
        codePaddingInline: "1.25rem",
        uiFontFamily: "var(--font-sans)",
        codeBackground: ({ theme }) => (theme.type === "light" ? "#f3f0e9" : "#262523"),
        frames: {
          shadowColor: "transparent",
          editorBackground: ({ theme }) => (theme.type === "light" ? "#f3f0e9" : "#262523"),
          terminalBackground: ({ theme }) => (theme.type === "light" ? "#f3f0e9" : "#262523"),
          editorActiveTabBackground: ({ theme }) =>
            theme.type === "light" ? "#f3f0e9" : "#262523",
          editorActiveTabIndicatorTopColor: "transparent",
          editorActiveTabIndicatorBottomColor: ({ theme }) =>
            theme.type === "light" ? "#b5432f" : "#e08a74",
          editorTabBarBackground: ({ theme }) => (theme.type === "light" ? "#ece7dc" : "#1e1d1b"),
          terminalTitlebarBackground: ({ theme }) =>
            theme.type === "light" ? "#ece7dc" : "#1e1d1b",
          terminalTitlebarDotsForeground: "var(--color-border)",
          terminalTitlebarDotsOpacity: "1",
          editorTabBarBorderBottomColor: "var(--color-border)",
          terminalTitlebarBorderBottomColor: "var(--color-border)",
          inlineButtonBackground: ({ theme }) => (theme.type === "light" ? "#faf8f3" : "#1e1d1b"),
          inlineButtonBorder: "var(--color-border)",
          inlineButtonForeground: "var(--color-text-muted)",
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
