import { useCallback, useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { CurriculumView } from './features/curriculum/CurriculumView'
import { DatabaseView } from './features/database/DatabaseView'
import { ExercisesView } from './features/exercises/ExercisesView'
import { LibraryView } from './features/library/LibraryView'
import { useEscapeKey } from './hooks/useEscapeKey'
import { useRoadmapData } from './hooks/useRoadmapData'
import type { StatusFilter } from './features/curriculum/LessonBrowser'
import { lessonStatus } from './lib/progress'
import { scrollToTop } from './lib/scroll'
import type { AppView } from './types'

function App() {
  const data = useRoadmapData()
  const [view, setView] = useState<AppView>('curriculum')
  const [selectedId, setSelectedId] = useState('')
  const [libraryTargetId, setLibraryTargetId] = useState('')
  const [exerciseTargetId, setExerciseTargetId] = useState('')
  const [lessonFilter, setLessonFilter] = useState<StatusFilter>('all')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
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

  return (
    <div className="app-shell">
      <Sidebar open={mobileNavOpen} view={view} phases={phases} activePhaseId={view === 'curriculum' ? phase.id : ''} completion={completion} onNavigate={navigate} onOpenModule={openModule} onResetProgress={data.resetProgress} onClose={closeMobileNav} />
      <main className="main-content">
        <button className="icon-button mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={22} /></button>
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
          onSelectTopic={selectTopic}
          onToggleReading={data.toggleReading}
          onToggleExercise={data.toggleExercise}
          onOpenExercise={openExercise}
          onConfigurePath={openLibraryPath}
        />}
        {view === 'exercises' && <ExercisesView
          phases={phases}
          checklist={completion.exerciseChecklist}
          customProjects={data.customProjects}
          highlightTopicId={exerciseTargetId}
          onHighlightEnd={() => setExerciseTargetId('')}
          onToggleExercise={data.toggleExercise}
          onOpenModule={openModule}
          onSelectTopic={selectTopic}
          onAddProject={data.addCustomProject}
          onRemoveProject={data.removeCustomProject}
          onProjectStatusChange={data.setCustomProjectStatus}
        />}
        {view === 'library' && <LibraryView topics={allTopics} library={library} targetBookId={libraryTargetId} onPathChange={data.setBookPath} onCoverChange={data.setBookCover} />}
        {view === 'database' && <DatabaseView />}
      </main>
    </div>
  )
}

export default App
