import { Fragment } from 'react'

const LINK = /(\[[^\]\n]+\]\(https?:\/\/[^)\s]+\))/g
const LINK_PARTS = /^\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)$/

function renderCode(text: string) {
  return text.split(/(`[^`\n]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code className="inline-code" key={index}>{part.slice(1, -1)}</code>
    return <span key={index}>{part}</span>
  })
}

// Renders `backticked` fragments as inline code; everything else stays plain text.
// With `links`, [text](https://…) also becomes a link. It's opt-in so catalogue text keeps rendering as it always has.
export function InlineText({ text, links = false }: { text: string; links?: boolean }) {
  if (!links) return renderCode(text)
  return text.split(LINK).filter(Boolean).map((part, index) => {
    const link = part.match(LINK_PARTS)
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>
    return <Fragment key={index}>{renderCode(part)}</Fragment>
  })
}
