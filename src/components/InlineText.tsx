// Renders `backticked` fragments as inline code; everything else stays plain text.
export function InlineText({ text }: { text: string }) {
  return text.split(/(`[^`\n]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code className="inline-code" key={index}>{part.slice(1, -1)}</code>
    return <span key={index}>{part}</span>
  })
}
