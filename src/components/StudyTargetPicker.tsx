import { lessonLabel, moduleLabel } from '../lib/format'
import { GENERAL_STUDY_LABEL, lessonTarget, projectTarget } from '../lib/studyTime'
import type { CustomProject, Phase, StudyKind, StudyTarget, Topic } from '../types'

const TARGET_TYPES: Array<{ type: StudyTarget['type']; label: string }> = [
  { type: 'lesson', label: 'Lesson' },
  { type: 'project', label: 'Personal project' },
  { type: 'general', label: 'General study' },
]
const KINDS: Array<{ kind: StudyKind; label: string }> = [
  { kind: 'theory', label: 'Theory' },
  { kind: 'exercise', label: 'Exercise' },
]

type StudyTargetPickerProps = {
  value: StudyTarget
  phases: Phase[]
  projects: CustomProject[]
  // Chosen when switching to "Lesson".
  fallbackTopic: Topic
  onChange: (target: StudyTarget) => void
}

export function StudyTargetPicker({ value, phases, projects, fallbackTopic, onChange }: StudyTargetPickerProps) {
  const phase = value.type === 'lesson' ? phases.find((item) => item.topics.some((topic) => topic.id === value.topicId)) : undefined

  const selectType = (type: StudyTarget['type']) => {
    if (type === value.type) return
    if (type === 'lesson') onChange(lessonTarget(fallbackTopic, 'theory'))
    else if (type === 'project') onChange(projects[0] ? projectTarget(projects[0]) : { type: 'project', projectId: '', label: '' })
    else onChange({ type: 'general', label: '' })
  }

  return (
    <div className="study-target-picker">
      <div className="study-segmented" role="group" aria-label="What are you studying?">
        {TARGET_TYPES.map(({ type, label }) => <button key={type} type="button" aria-pressed={value.type === type} onClick={() => selectType(type)}>{label}</button>)}
      </div>

      {value.type === 'lesson' && <div className="study-picker-fields">
        <label><span>Module</span>
          <select value={phase?.id ?? ''} onChange={(event) => {
            const next = phases.find((item) => item.id === event.target.value)?.topics[0]
            if (next) onChange(lessonTarget(next, value.kind))
          }}>
            {!phase && <option value="">Not in the roadmap</option>}
            {phases.map((item) => <option key={item.id} value={item.id}>{moduleLabel(item.number)} · {item.title}</option>)}
          </select>
        </label>
        <label><span>Lesson</span>
          <select value={value.topicId} onChange={(event) => {
            const next = phase?.topics.find((topic) => topic.id === event.target.value)
            if (next) onChange(lessonTarget(next, value.kind))
          }}>
            {phase
              ? phase.topics.map((topic, index) => <option key={topic.id} value={topic.id}>{lessonLabel(index)} · {topic.title}</option>)
              : <option value={value.topicId}>{value.label}</option>}
          </select>
        </label>
        <div className="study-segmented" role="group" aria-label="Theory or exercise">
          {KINDS.map(({ kind, label }) => <button key={kind} type="button" className={`study-accent-${kind}`} aria-pressed={value.kind === kind} onClick={() => onChange({ ...value, kind })}>{label}</button>)}
        </div>
      </div>}

      {value.type === 'project' && (projects.length || value.projectId ? <div className="study-picker-fields">
        <label><span>Project</span>
          <select value={value.projectId} onChange={(event) => {
            const next = projects.find((project) => project.id === event.target.value)
            if (next) onChange(projectTarget(next))
          }}>
            {!projects.some((project) => project.id === value.projectId) && <option value={value.projectId}>{value.label || 'Choose a project'}</option>}
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </select>
        </label>
      </div> : <p className="study-picker-hint">Add a personal project on the Exercises page first.</p>)}

      {value.type === 'general' && <div className="study-picker-fields">
        <label><span>Label</span>
          <input type="text" value={value.label} maxLength={120} placeholder={GENERAL_STUDY_LABEL} onChange={(event) => onChange({ type: 'general', label: event.target.value })} />
        </label>
      </div>}
    </div>
  )
}
