import rss from "@astrojs/rss"
import type { APIContext } from "astro"

interface Post {
  url: string
  frontmatter: {
    title: string
    date: string
    description?: string
    draft?: boolean
  }
}

export function GET(context: APIContext) {
  const posts = Object.values(import.meta.glob<Post>("./posts/*.mdx", { eager: true }))
    .filter(post => !post.frontmatter.draft)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  return rss({
    title: "wtfm",
    description: "Write the Fucking Manual - A minimalist guide to documentation",
    site: context.site!,
    items: posts.map(post => ({
      title: post.frontmatter.title,
      pubDate: new Date(post.frontmatter.date),
      description: post.frontmatter.description,
      link: post.url,
    })),
  })
}
