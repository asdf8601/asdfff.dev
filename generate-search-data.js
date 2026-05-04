import { readdir, readFile, writeFile, stat } from "fs/promises"
import { join } from "path"

const PAGES_DIR = "./src/pages"
const OUTPUT_FILE = "./public/search-data.json"

function removeNestedBraces(str) {
  let result = str
  let prev = ""
  while (result !== prev) {
    prev = result
    result = result.replace(/\{[^{}]*\}/g, " ")
  }
  return result
}

async function extractTextContent(html) {
  const text = html
    .replace(/---[\s\S]*?---/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
  const withoutBraces = removeNestedBraces(text)
  return withoutBraces
    .replace(/[()=>:?]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

async function getTitle(content) {
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i)
  if (titleMatch) return titleMatch[1].replace(/<[^>]+>/g, "")

  const frontmatterMatch = content.match(/title:\s*["']([^"']+)["']/)
  if (frontmatterMatch) return frontmatterMatch[1]

  return "Untitled"
}

async function processFile(filePath, fileName) {
  const content = await readFile(filePath, "utf-8")
  const title = await getTitle(content)
  const text = await extractTextContent(content)

  const url = fileName === "index.astro" ? "/" : `/${fileName.replace(".astro", "")}`

  return {
    url,
    title,
    content: text.slice(0, 500),
  }
}

function parseListLike(s) {
  if (!s) return []
  return s
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map(x =>
      x
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .trim()
    )
    .filter(Boolean)
}

async function processMarkdownFile(filePath, relativePath) {
  const content = await readFile(filePath, "utf-8")
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)

  let title = "Untitled"
  let date = ""
  let category = ""
  let tags = []

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/)
    const authorMatch = frontmatter.match(/author:\s*["']?([^"'\n]+)["']?/)
    const dateMatch = frontmatter.match(/date:\s*["']?([^"'\n]+)["']?/)
    const categoryMatch = frontmatter.match(/category:\s*["']?([^"'\n]+)["']?/)
    const tagMatch = frontmatter.match(/^tag(?:s)?:\s*(.+)$/m)

    if (titleMatch) {
      title = titleMatch[1].trim()
    } else if (authorMatch) {
      title = authorMatch[1].trim()
    } else {
      const body = content.replace(/^---[\s\S]*?---/, "").trim()
      const firstLine = body.split("\n").find(l => l.trim().length > 0)
      if (firstLine) {
        title = firstLine
          .replace(/[#*_~[\]<>]/g, "")
          .trim()
          .slice(0, 60)
      }
    }
    if (dateMatch) date = dateMatch[1].trim().slice(0, 10)
    if (categoryMatch) category = categoryMatch[1].trim()
    if (tagMatch) tags = parseListLike(tagMatch[1])
  }

  const text = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import\s+.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_~[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  return {
    url: relativePath.replace(/\.mdx?$/, "").replace("src/pages", ""),
    title,
    date,
    category,
    tags,
    content: text.slice(0, 2000),
  }
}

async function processDirectory(dir, baseDir = PAGES_DIR) {
  const entries = await readdir(dir)
  const results = []

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stats = await stat(fullPath)

    if (stats.isDirectory()) {
      results.push(...(await processDirectory(fullPath, baseDir)))
    } else if (entry.endsWith(".md") || entry.endsWith(".mdx")) {
      const relativePath = fullPath.replace(baseDir, "").replace(/\\/g, "/")
      results.push(await processMarkdownFile(fullPath, relativePath))
    }
  }

  return results
}

async function generateSearchData() {
  const files = await readdir(PAGES_DIR)
  const astroFiles = files.filter(f => f.endsWith(".astro"))

  const pagesData = await Promise.all(
    astroFiles.map(file => processFile(join(PAGES_DIR, file), file))
  )

  const markdownData = await processDirectory(PAGES_DIR)

  const allData = [...pagesData, ...markdownData]

  await writeFile(OUTPUT_FILE, JSON.stringify(allData, null, 2))
  console.log(
    `Generated search data for ${allData.length} pages (${pagesData.length} astro, ${markdownData.length} markdown)`
  )
}

generateSearchData().catch(console.error)
