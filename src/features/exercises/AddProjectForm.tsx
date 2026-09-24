import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { X } from 'lucide-react'
import { BuildStatusSelect } from '../../components/BuildStatusSelect'
import { scrollToTop } from '../../lib/scroll'
import type { BuildStatus, CustomProject } from '../../types'

export function AddProjectForm({ onAdd, onClose }: { onAdd: (project: CustomProject) => void; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<BuildStatus>('to-build')
  const titleRef = useRef<HTMLInputElement>(null)

  // The form opens below the sticky banner at the top of the page, which may be scrolled far away.
  useEffect(() => {
    scrollToTop()
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    onAdd({ id: `custom-${Date.now().toString(36)}`, title: trimmedTitle, note: note.trim(), status })
  }

  return (
    <form className="add-project-form" onSubmit={submit}>
      <div className="project-form-heading"><div><span>Personal build</span><h2>Add a project to your board</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close project form"><X size={18} /></button></div>
      <div className="project-form-fields">
        <label><span>Project name</span><input ref={titleRef} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Support-ticket triage assistant" /></label>
        <label><span>Status</span><BuildStatusSelect value={status} onChange={setStatus} /></label>
        <label className="project-note-field"><span>Short note <em>optional</em></span><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="What will this project demonstrate?" /></label>
      </div>
      <div className="project-form-actions"><button type="button" onClick={onClose}>Cancel</button><button className="save-project-button" type="submit" disabled={!title.trim()}>Add to board</button></div>
    </form>
  )
}
