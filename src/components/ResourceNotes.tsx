import { useId, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ExternalLink, Link2, NotebookPen, Pencil, Plus, Trash2 } from 'lucide-react'
import { resourceHost } from '../lib/format'
import { EMPTY_RESOURCE_NOTE, hasResourceNote } from '../lib/library'
import type { ResourceLink, ResourceNote } from '../types'
import { InlineText } from './InlineText'

type ResourceNotesProps = {
  note: ResourceNote | undefined
  // The resource's title, for button labels ("Edit notes for …").
  subject: string
  onChange: (note: ResourceNote) => void
}

// Your own notes and links for a book or web resource: shown in the library and in the reading-list dialogs.
export function ResourceNotes({ note = EMPTY_RESOURCE_NOTE, subject, onChange }: ResourceNotesProps) {
  // Which part of the editor to open with: the note field, or a fresh link row.
  const [editing, setEditing] = useState<EditorStart | null>(null)
  const hasNote = hasResourceNote(note)

  if (editing) return <ResourceNotesEditor initial={note} subject={subject} startWith={editing} onSave={(next) => { onChange(next); setEditing(null) }} onCancel={() => setEditing(null)} />

  return (
    <section className="resource-notes" aria-label={`Notes and links for ${subject}`}>
      <header className="resource-notes-head">
        <span className="detail-label"><NotebookPen size={14} />Notes & links</span>
        <div className="resource-notes-buttons">
          {hasNote
            ? <button type="button" className="resource-notes-edit" onClick={() => setEditing('note')} aria-label={`Edit notes and links for ${subject}`}><Pencil size={14} />Edit</button>
            : <button type="button" className="resource-notes-edit" onClick={() => setEditing('note')} aria-label={`Add a note for ${subject}`}><Plus size={14} />Add note</button>}
          <button type="button" className="resource-notes-edit" onClick={() => setEditing('link')} aria-label={`Add a link for ${subject}`}><Link2 size={14} />Add link</button>
        </div>
      </header>
      {note.note.trim() && <p className="resource-notes-text"><InlineText text={note.note} links /></p>}
      {note.links.length > 0 && <ul className="resource-notes-links">
        {note.links.map((link, index) => (
          <li key={`${link.url}-${index}`}>
            <a href={link.url} target="_blank" rel="noreferrer"><ExternalLink size={14} /><span>{link.title || resourceHost(link.url)}</span></a>
            {link.title && <small>{resourceHost(link.url)}</small>}
          </li>
        ))}
      </ul>}
    </section>
  )
}

type LinkDraft = ResourceLink & { id: number }
type EditorStart = 'note' | 'link'

// A blank row is simply dropped on save; a half-filled one needs fixing first.
function linkProblem({ title, url }: LinkDraft) {
  if (!url.trim()) return title.trim() ? 'Add the address for this link.' : ''
  if (!/^https?:\/\/\S+$/i.test(url.trim())) return 'Links must start with http:// or https://.'
  try {
    new URL(url.trim())
    return ''
  } catch {
    return 'This address is not valid.'
  }
}

type ResourceNotesEditorProps = {
  initial: ResourceNote
  subject: string
  // "link" opens with an empty link row and its address focused, so adding just a link is quick.
  startWith: EditorStart
  onSave: (note: ResourceNote) => void
  onCancel: () => void
}

function ResourceNotesEditor({ initial, subject, startWith, onSave, onCancel }: ResourceNotesEditorProps) {
  const idPrefix = useId()
  const nextId = useRef(initial.links.length + 1)
  const [note, setNote] = useState(initial.note)
  const [links, setLinks] = useState<LinkDraft[]>(() => {
    const existing = initial.links.map((link, index) => ({ ...link, id: index }))
    return startWith === 'link' ? [...existing, { id: initial.links.length, title: '', url: '' }] : existing
  })
  // The row whose address gets focus: the fresh one from "Add link" or the editor's "Add link" button.
  const [focusLinkId, setFocusLinkId] = useState(startWith === 'link' ? initial.links.length : -1)
  const problems = links.map(linkProblem)
  const invalid = problems.some(Boolean)

  const updateLink = (id: number, change: Partial<ResourceLink>) => setLinks((current) => current.map((link) => link.id === id ? { ...link, ...change } : link))
  const moveLink = (index: number, offset: number) => setLinks((current) => {
    const next = [...current]
    const [moved] = next.splice(index, 1)
    next.splice(index + offset, 0, moved)
    return next
  })
  const addLink = () => {
    const id = nextId.current
    setLinks((current) => [...current, { id, title: '', url: '' }])
    setFocusLinkId(id)
    nextId.current += 1
  }

  const save = () => {
    if (invalid) return
    onSave({
      note: note.trim() ? note.trimEnd() : '',
      links: links.filter((link) => link.url.trim()).map(({ title, url }) => ({ title: title.trim(), url: url.trim() })),
    })
  }

  return (
    <form className="resource-notes resource-notes-editor" aria-label={`Edit notes for ${subject}`} onSubmit={(event) => { event.preventDefault(); save() }}>
      <label className="resource-notes-field" htmlFor={`${idPrefix}-note`}>
        <span>Notes</span>
        <textarea id={`${idPrefix}-note`} value={note} rows={5} maxLength={20000} placeholder="Summary, key takeaways, what to revisit… Use `code` and [text](https://…) for links." onChange={(event) => setNote(event.target.value)} autoFocus={startWith === 'note'} />
      </label>

      <div className="resource-notes-field">
        <span>Links</span>
        {links.length > 0 && <ol className="resource-link-rows">
          {links.map((link, index) => (
            <li key={link.id}>
              <div className="resource-link-inputs">
                <input value={link.title} maxLength={300} placeholder="Title (optional)" aria-label={`Link ${index + 1} title`} onChange={(event) => updateLink(link.id, { title: event.target.value })} />
                <input type="url" value={link.url} maxLength={2000} placeholder="https://…" aria-label={`Link ${index + 1} address`} aria-invalid={Boolean(problems[index])} spellCheck={false} autoFocus={link.id === focusLinkId} onChange={(event) => updateLink(link.id, { url: event.target.value })} />
              </div>
              <div className="resource-link-actions">
                <button type="button" disabled={index === 0} onClick={() => moveLink(index, -1)} aria-label={`Move link ${index + 1} up`}><ArrowUp size={15} /></button>
                <button type="button" disabled={index === links.length - 1} onClick={() => moveLink(index, 1)} aria-label={`Move link ${index + 1} down`}><ArrowDown size={15} /></button>
                <button type="button" className="resource-link-remove" onClick={() => setLinks((current) => current.filter((item) => item.id !== link.id))} aria-label={`Remove link ${index + 1}`}><Trash2 size={15} /></button>
              </div>
              {problems[index] && <p className="resource-link-problem" role="alert">{problems[index]}</p>}
            </li>
          ))}
        </ol>}
        <button type="button" className="resource-add-link" onClick={addLink}><Plus size={15} />Add link</button>
      </div>

      <div className="resource-notes-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="resource-notes-save" disabled={invalid}>Save notes</button>
      </div>
    </form>
  )
}
