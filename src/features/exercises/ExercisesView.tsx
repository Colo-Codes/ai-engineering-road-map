import { useEffect, useMemo, useState } from 'react'
import { Cog, Plus } from 'lucide-react'
import { Banner } from '../../components/Banner'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { pluralize } from '../../lib/format'
import { scrollToSection } from '../../lib/scroll'
import type { BuildStatus, CustomProject, ExerciseChecklist, Phase } from '../../types'
import { AddProjectForm } from './AddProjectForm'
import { CustomProjects } from './CustomProjects'
import { ExerciseGroup } from './ExerciseGroup'
import { ExerciseRail } from './ExerciseRail'
import { buildExerciseGroups, CUSTOM_PROJECTS_ID, exerciseItemId, groupSectionId } from './exerciseGroups'

type ExercisesViewProps = {
  phases: Phase[]
  checklist: ExerciseChecklist
  customProjects: CustomProject[]
  // An exercise opened from a lesson: scrolled into view and flashed once, then cleared via onHighlightEnd.
  highlightTopicId: string
  onHighlightEnd: () => void
  onToggleExercise: (topicId: string) => void
  onOpenModule: (phaseId: string) => void
  onSelectTopic: (topicId: string) => void
  onAddProject: (project: CustomProject) => void
  onRemoveProject: (projectId: string) => void
  onProjectStatusChange: (projectId: string, status: BuildStatus) => void
}

export function ExercisesView({ phases, checklist, customProjects, highlightTopicId, onHighlightEnd, onToggleExercise, onOpenModule, onSelectTopic, onAddProject, onRemoveProject, onProjectStatusChange }: ExercisesViewProps) {
  const [showProjectForm, setShowProjectForm] = useState(false)
  const groups = useMemo(() => buildExerciseGroups(phases, checklist), [phases, checklist])
  const activeId = useScrollSpy([...groups.map(({ phase }) => groupSectionId(phase.id)), CUSTOM_PROJECTS_ID])
  const totalExercises = groups.reduce((sum, { rows }) => sum + rows.length, 0)
  const checkedExercises = groups.reduce((sum, { done }) => sum + done, 0)
  const percent = totalExercises ? Math.round(checkedExercises / totalExercises * 100) : 0

  useEffect(() => {
    if (highlightTopicId) scrollToSection(exerciseItemId(highlightTopicId))
  }, [highlightTopicId])

  return (
    <section className="milestones-view">
      <div className="study-grid">
        <div className="study-main">
          <Banner
            tag={pluralize(groups.length, 'module')}
            stats={[`${checkedExercises} / ${totalExercises} completed`, `${totalExercises - checkedExercises} remaining`]}
            title="Exercises"
            description="Every exercise from the curriculum, grouped by module, so you can track exactly what still needs to be built."
            percent={percent}
            className="banner-exercises"
            decoration={<Cog />}
            action={<button className="add-project-button" onClick={() => setShowProjectForm((current) => !current)} aria-expanded={showProjectForm}><Plus size={18} />Add project</button>}
          />

          {showProjectForm && <AddProjectForm onAdd={(project) => { onAddProject(project); setShowProjectForm(false) }} onClose={() => setShowProjectForm(false)} />}

          <div className="exercise-checklist">
            {groups.map((group) => <ExerciseGroup key={group.phase.id} group={group} checklist={checklist} highlightTopicId={highlightTopicId} onHighlightEnd={onHighlightEnd} onToggleExercise={onToggleExercise} onOpenModule={onOpenModule} onSelectTopic={onSelectTopic} />)}
          </div>

          <CustomProjects projects={customProjects} onRemove={onRemoveProject} onStatusChange={onProjectStatusChange} />
        </div>
        <ExerciseRail groups={groups} projectCount={customProjects.length} activeId={activeId} />
      </div>
    </section>
  )
}
