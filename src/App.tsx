import { useCallback, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { StudyDocumentTitle } from './components/StudyDocumentTitle'
import { StudySessionDialog } from './components/StudySessionDialog'
import { StudyTracker } from './components/StudyTracker'
import { TopBar } from './components/TopBar'
import { CurriculumView } from './features/curriculum/CurriculumView'
import { DatabaseView } from './features/database/DatabaseView'
import { ExercisesView } from './features/exercises/ExercisesView'
import { LibraryView } from './features/library/LibraryView'
import { StudyTimeView } from './features/study-time/StudyTimeView'
import { useEscapeKey } from './hooks/useEscapeKey'
import { useRoadmapData } from './hooks/useRoadmapData'
import { useStudyTracker } from './hooks/useStudyTracker'
import type { StatusFilter } from './features/curriculum/LessonBrowser'
import { lessonStatus } from './lib/progress'
import { scrollToTop } from './lib/scroll'
import type { AppView } from './types'

function App() {
  const data = useRoadmapData()
  const study = useStudyTracker()
  const [view, setView] = useState<AppView>('curriculum')
  const [selectedId, setSelectedId] = useState('')
  const [libraryTargetId, setLibraryTargetId] = useState('')
  const [exerciseTargetId, setExerciseTargetId] = useState('')
  const [lessonFilter, setLessonFilter] = useState<StatusFilter>('all')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  // The session open in the edit dialog: an id, '' to add one by hand, or null when closed.
  const [dialogSessionId, setDialogSessionId] = useState<string | null>(null)
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])
  useEscapeKey(closeMobileNav)

  const { phases, allTopics, completion, library } = data
  const selectedIndex = Math.max(0, allTopics.findIndex((topic) => topic.id === selectedId))
  const selected = allTopics[selectedIndex]
  const phase = selected && phases.find((item) => item.id === selected.phaseId)

  if (data.error) return <main className="app-loading"><h1>Roadmap unavailable</h1><p>{data.error}</p></main>
  if (!data.ready || !selected || !phase) return <main className="app-loading"><p>Loading roadmap…</p></main>

  // Every navigation starts at the top: instantly when the page changes, smoothly within the same page.
  const navigate = (next: AppView) => {
    scrollToTop(next === view ? 'smooth' : 'instant')
    setLibraryTargetId('')
    setExerciseTargetId('')
    setView(next)
    setMobileNavOpen(false)
  }
  const selectTopic = (topicId: string) => { setSelectedId(topicId); navigate('curriculum') }
  const openModule = (phaseId: string) => {
    const topics = phases.find((item) => item.id === phaseId)?.topics ?? []
    const topic = topics.find((item) => lessonStatus(item.id, completion) !== 'complete') ?? topics[0]
    if (!topic) return
    setLessonFilter('all')
    selectTopic(topic.id)
  }
  const openExercise = (topicId: string) => { navigate('exercises'); setExerciseTargetId(topicId) }
  const openLibraryPath = (bookId: string) => { navigate('library'); setLibraryTargetId(bookId) }
  const dialogSession = dialogSessionId ? study.sessions.find((session) => session.id === dialogSessionId) : undefined
  const studyTrackerProps = { tracker: study, phases, projects: data.customProjects, suggestedTopic: selected, onEditSession: setDialogSessionId }

  return (
    <div className="app-shell">
      <TopBar view={view} onNavigate={navigate} onOpenMenu={() => setMobileNavOpen(true)} />
      <Sidebar open={mobileNavOpen} view={view} phases={phases} activePhaseId={view === 'curriculum' ? phase.id : ''} completion={completion} tracker={<StudyTracker variant="card" {...studyTrackerProps} />} onNavigate={navigate} onOpenModule={openModule} onResetProgress={data.resetProgress} onClose={closeMobileNav} />
      <main className="main-content">
        <StudyTracker variant="pill" {...studyTrackerProps} />
        {view === 'curriculum' && <CurriculumView
          phase={phase}
          lessonFilter={lessonFilter}
          onLessonFilterChange={setLessonFilter}
          topic={selected}
          lessonIndex={phase.topics.findIndex((topic) => topic.id === selected.id)}
          previousId={allTopics[selectedIndex - 1]?.id}
          nextId={allTopics[selectedIndex + 1]?.id}
          library={library}
          completion={completion}
          studyTracker={study}
          onSelectTopic={selectTopic}
          onToggleReading={data.toggleReading}
          onToggleExercise={data.toggleExercise}
          onOpenExercise={openExercise}
          onConfigurePath={openLibraryPath}
          onNoteChange={data.setResourceNote}
        />}
        {view === 'exercises' && <ExercisesView
          phases={phases}
          checklist={completion.exerciseChecklist}
          customProjects={data.customProjects}
          studyTracker={study}
          highlightTopicId={exerciseTargetId}
          onHighlightEnd={() => setExerciseTargetId('')}
          onToggleExercise={data.toggleExercise}
          onOpenModule={openModule}
          onSelectTopic={selectTopic}
          onAddProject={data.addCustomProject}
          onRemoveProject={data.removeCustomProject}
          onProjectStatusChange={data.setCustomProjectStatus}
        />}
        {view === 'study-time' && <StudyTimeView tracker={study} phases={phases} onAddSession={() => setDialogSessionId('')} onEditSession={setDialogSessionId} />}
        {view === 'library' && <LibraryView topics={allTopics} library={library} targetBookId={libraryTargetId} onPathChange={data.setBookPath} onCoverChange={data.setBookCover} onNoteChange={data.setResourceNote} />}
        {view === 'database' && <DatabaseView />}
      </main>
      {/* A session deleted elsewhere closes its dialog rather than turning it into "add a session". */}
      {dialogSessionId !== null && (dialogSessionId === '' || dialogSession) && <StudySessionDialog
        key={dialogSessionId}
        session={dialogSession ?? null}
        tracker={study}
        phases={phases}
        projects={data.customProjects}
        suggestedTopic={selected}
        onClose={() => setDialogSessionId(null)}
      />}
      <StudyDocumentTitle active={study.active} />
    </div>
  )
}

export default App
