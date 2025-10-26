import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join } from 'path';

const PAGES_DIR = './src/pages';
const OUTPUT_FILE = './public/search-data.json';

async function extractTextContent(html) {
  const text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/---[\s\S]*?---/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

async function getTitle(content) {
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (titleMatch) return titleMatch[1].replace(/<[^>]+>/g, '');
  
  const frontmatterMatch = content.match(/title:\s*["']([^"']+)["']/);
  if (frontmatterMatch) return frontmatterMatch[1];
  
  return 'Untitled';
}

async function processFile(filePath, fileName) {
  const content = await readFile(filePath, 'utf-8');
  const title = await getTitle(content);
  const text = await extractTextContent(content);
  
  const url = fileName === 'index.astro' 
    ? '/' 
    : `/${fileName.replace('.astro', '')}`;
  
  return {
    url,
    title,
    content: text.slice(0, 500)
  };
}

async function processMarkdownFile(filePath, relativePath) {
  const content = await readFile(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  
  let title = 'Untitled';
  let description = '';
  
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
    const descMatch = frontmatter.match(/description:\s*["']?([^"'\n]+)["']?/);
    
    if (titleMatch) title = titleMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
  }
  
  const text = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/[#*_~\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return {
    url: relativePath.replace('.md', '').replace('src/pages', ''),
    title,
    content: text.slice(0, 1000)
  };
}

async function processDirectory(dir, baseDir = PAGES_DIR) {
  const entries = await readdir(dir);
  const results = [];
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      results.push(...await processDirectory(fullPath, baseDir));
    } else if (entry.endsWith('.md')) {
      const relativePath = fullPath
        .replace(baseDir, '')
        .replace(/\\/g, '/');
      results.push(await processMarkdownFile(fullPath, relativePath));
    }
  }
  
  return results;
}

async function generateSearchData() {
  const files = await readdir(PAGES_DIR);
  const astroFiles = files.filter(f => f.endsWith('.astro'));
  
  const pagesData = await Promise.all(
    astroFiles.map(file => processFile(join(PAGES_DIR, file), file))
  );
  
  const markdownData = await processDirectory(PAGES_DIR);
  
  const allData = [...pagesData, ...markdownData];
  
  await writeFile(OUTPUT_FILE, JSON.stringify(allData, null, 2));
  console.log(`Generated search data for ${allData.length} pages (${pagesData.length} astro, ${markdownData.length} markdown)`);
}

generateSearchData().catch(console.error);
