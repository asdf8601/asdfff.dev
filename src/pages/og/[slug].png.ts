import type { APIContext } from "astro"
import { renderCard, type Card } from "../../lib/og"

interface Post {
  file: string
  frontmatter: {
    title: string
    date?: string
    tag?: string[]
    tags?: string[]
  }
}

export function getStaticPaths() {
  const posts = Object.values(import.meta.glob<Post>("../posts/*.mdx", { eager: true }))
  return [
    { params: { slug: "default" }, props: { title: "Write the Fucking Manual" } },
    ...posts.map(post => ({
      params: {
        slug: post.file
          .split("/")
          .pop()!
          .replace(/\.mdx$/, ""),
      },
      props: {
        title: post.frontmatter.title,
        date: post.frontmatter.date ? new Date(post.frontmatter.date) : undefined,
        tags: post.frontmatter.tags ?? post.frontmatter.tag,
      },
    })),
  ]
}

export async function GET({ props }: APIContext<Card>) {
  const png = await renderCard(props)
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } })
}
