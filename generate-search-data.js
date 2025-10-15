import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';

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

async function generateSearchData() {
  const files = await readdir(PAGES_DIR);
  const astroFiles = files.filter(f => f.endsWith('.astro'));
  
  const pagesData = await Promise.all(
    astroFiles.map(file => processFile(join(PAGES_DIR, file), file))
  );
  
  await writeFile(OUTPUT_FILE, JSON.stringify(pagesData, null, 2));
  console.log(`Generated search data for ${pagesData.length} pages`);
}

generateSearchData().catch(console.error);
