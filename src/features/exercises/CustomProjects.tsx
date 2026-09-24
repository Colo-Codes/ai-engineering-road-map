import { Check, Trash2 } from 'lucide-react'
import { BuildStatusSelect } from '../../components/BuildStatusSelect'
import { InlineText } from '../../components/InlineText'
import type { BuildStatus, CustomProject } from '../../types'
import { CUSTOM_PROJECTS_ID } from './exerciseGroups'

type CustomProjectsProps = {
  projects: CustomProject[]
  onRemove: (projectId: string) => void
  onStatusChange: (projectId: string, status: BuildStatus) => void
}

export function CustomProjects({ projects, onRemove, onStatusChange }: CustomProjectsProps) {
  return (
    <section className="custom-projects-section" id={CUSTOM_PROJECTS_ID}>
      <div className="custom-projects-heading"><h2>Personal projects</h2><span>{projects.length}</span></div>
      {projects.length ? <div className="custom-projects-grid">
        {projects.map((project) => (
          <article className="build-card custom-build" key={project.id}>
            <div className="build-card-top"><span>Personal project</span><button onClick={() => { if (window.confirm(`Remove “${project.title}” from your board?`)) onRemove(project.id) }} aria-label={`Remove ${project.title}`}><Trash2 size={15} /></button></div>
            <h3>{project.title}</h3>
            {project.note && <p><InlineText text={project.note} /></p>}
            <label className="custom-status"><span>Status</span><BuildStatusSelect value={project.status} onChange={(status) => onStatusChange(project.id, status)} /></label>
          </article>
        ))}
      </div> : <div className="empty-build-column"><Check size={18} /><span>No personal projects added yet.</span></div>}
    </section>
  )
}
