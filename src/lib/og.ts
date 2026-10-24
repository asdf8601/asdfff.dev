import { readFileSync } from "node:fs"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"

export interface Card {
  title: string
  date?: Date
  tags?: string[]
}

interface Node {
  type: string
  props: { style?: Record<string, unknown>; children?: (Node | string)[] | Node | string }
}

const paper = "#faf8f3"
const ink = "#2b2a27"
const muted = "#6f6b63"
const vermilion = "#b5432f"
const languageTags = ["english", "spanish"]

const font = (path: string) => readFileSync(`node_modules/@fontsource/${path}`)

const fonts = [
  {
    name: "Noto Serif JP",
    data: font("noto-serif-jp/files/noto-serif-jp-latin-600-normal.woff"),
    weight: 600,
    style: "normal",
  },
  {
    name: "Inter",
    data: font("inter/files/inter-latin-500-normal.woff"),
    weight: 500,
    style: "normal",
  },
  {
    name: "EB Garamond",
    data: font("eb-garamond/files/eb-garamond-latin-400-italic.woff"),
    weight: 400,
    style: "italic",
  },
] as const

const el = (style: Record<string, unknown>, children: Node["props"]["children"] = []): Node => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
})

const titleSize = (title: string) => (title.length > 85 ? 48 : title.length > 60 ? 56 : 64)

const formatDate = (date: Date) => date.toISOString().slice(0, 10).replaceAll("-", "·")

const card = ({ title, date, tags = [] }: Card): Node =>
  el(
    {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      position: "relative",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "56px 64px",
      background: paper,
      color: ink,
    },
    [
      el(
        {
          gap: 20,
          fontFamily: "Inter",
          fontSize: 26,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: muted,
        },
        [
          el({ color: vermilion }, "wtfm"),
          el({}, "blog.asdfff.dev"),
          ...(date ? [el({}, formatDate(date))] : []),
        ]
      ),
      el({ position: "absolute", left: 64, right: 64, top: 118, height: 4, background: vermilion }),
      el(
        {
          display: "block",
          marginTop: 24,
          fontFamily: "Noto Serif JP",
          fontSize: titleSize(title),
          lineHeight: 1.22,
          lineClamp: 3,
        },
        title
      ),
      el({ justifyContent: "flex-end", alignItems: "center", gap: 40 }, [
        el(
          { gap: 22, fontFamily: "EB Garamond", fontStyle: "italic", fontSize: 28, color: muted },
          tags
            .filter(tag => !languageTags.includes(tag))
            .slice(0, 3)
            .map(tag => el({}, tag))
        ),
        el(
          {
            width: 124,
            height: 124,
            padding: 10,
            flexWrap: "wrap",
            alignContent: "center",
            borderRadius: 10,
            background: vermilion,
            color: paper,
            fontFamily: "Noto Serif JP",
            fontSize: 46,
            lineHeight: 1,
          },
          ["w", "t", "f", "m"].map(letter => el({ width: "50%", justifyContent: "center" }, letter))
        ),
      ]),
    ]
  )

export async function renderCard(input: Card): Promise<Uint8Array> {
  const svg = await satori(card(input) as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: fonts.map(f => ({ ...f })),
  })
  return new Resvg(svg).render().asPng()
}
