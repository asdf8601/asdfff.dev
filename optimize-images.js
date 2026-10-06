import { readFile, writeFile } from "fs/promises"
import { extname } from "path"
import sharp from "sharp"

const ENCODERS = {
  ".png": img => img.png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true }),
  ".jpg": img => img.jpeg({ quality: 85, mozjpeg: true }),
  ".jpeg": img => img.jpeg({ quality: 85, mozjpeg: true }),
  ".webp": img => img.webp({ quality: 85, effort: 6 }),
}

async function optimize(file) {
  const encode = ENCODERS[extname(file).toLowerCase()]
  if (!encode) return

  const input = await readFile(file)
  const output = await encode(sharp(input).rotate()).toBuffer()

  if (output.length >= input.length) return

  await writeFile(file, output)
  const saved = Math.round((1 - output.length / input.length) * 100)
  console.log(`${file}: ${input.length} -> ${output.length} bytes (-${saved}%)`)
}

try {
  await Promise.all(process.argv.slice(2).map(optimize))
} catch (error) {
  console.error(error)
  process.exit(1)
}
