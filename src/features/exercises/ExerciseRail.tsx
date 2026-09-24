import { FolderKanban } from 'lucide-react'
import { RailLink, SideRail, SideRailList } from '../../components/SideRail'
import { moduleLabel, pluralize } from '../../lib/format'
import { progressStatus } from '../../lib/progress'
import { scrollToSection } from '../../lib/scroll'
import { CUSTOM_PROJECTS_ID, groupSectionId } from './exerciseGroups'
import type { ExerciseGroupData } from './exerciseGroups'

export function ExerciseRail({ groups, projectCount, activeId }: { groups: ExerciseGroupData[]; projectCount: number; activeId: string }) {
  return (
    <SideRail title="Modules" count={groups.length} label="Exercise navigation" className="side-rail-exercises">
      <SideRailList label="Jump to section" selectedKey={activeId}>
        {groups.map((group) => {
          const sectionId = groupSectionId(group.phase.id)
          return (
            <RailLink
              key={group.phase.id}
              title={group.phase.title}
              meta={`${moduleLabel(group.phase.number)} · ${group.done} / ${group.rows.length} done`}
              status={progressStatus(group.done, group.rows.length)}
              selected={activeId === sectionId}
              ariaCurrent="location"
              onClick={() => scrollToSection(sectionId)}
            />
          )
        })}
        <hr className="side-rail-divider" />
        <RailLink
          title="Personal projects"
          meta={pluralize(projectCount, 'project')}
          icon={<FolderKanban size={17} />}
          selected={activeId === CUSTOM_PROJECTS_ID}
          ariaCurrent="location"
          onClick={() => scrollToSection(CUSTOM_PROJECTS_ID)}
        />
      </SideRailList>
    </SideRail>
  )
}
