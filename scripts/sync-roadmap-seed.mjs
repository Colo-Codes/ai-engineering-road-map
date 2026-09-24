import Database from 'better-sqlite3'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const sourcePath = resolve(root, 'docs/ai-engineering-roadmap-new.md')
const seedPath = resolve(root, 'data/roadmap.seed.sqlite')
const markdown = readFileSync(sourcePath, 'utf8')
const catalogueRevision = '7'

const phasePresentation = new Map([
  [0, ['python', '#e46a45']],
  [1, ['backend', '#c99431']],
  [2, ['llm-foundations', '#8f9b4a']],
  [3, ['prompting', '#3f9c7d']],
  [4, ['evaluation', '#3986a8']],
  [5, ['rag', '#536bb2']],
  [6, ['agents', '#7557a8']],
  [7, ['systems', '#9a518d']],
  [8, ['production', '#ad4f61']],
  [9, ['machine-learning', '#bf684d']],
  [10, ['deep-learning', '#a07c35']],
  [11, ['fine-tuning', '#5d7a8b']],
  [12, ['capstone', '#344e63']],
])

const sourceTypes = new Map([
  ['Core reading', 'core'],
  ['Required reading', 'core'],
  ['Supporting reading', 'supporting'],
  ['Recommended reading', 'supporting'],
  ['Official documentation', 'official'],
  ['Technical references', 'official'],
  ['Optional reading', 'optional'],
  ['Further reading', 'optional'],
])

function parseRoadmap(value) {
  const lines = value.split(/\r?\n/)
  const phases = []
  let phase
  let topic

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const phaseMatch = line.match(/^## (?:Phase|Module) (\d+): (.+)$/)
    if (phaseMatch) {
      const number = Number(phaseMatch[1])
      const presentation = phasePresentation.get(number)
      if (!presentation) throw new Error(`Missing presentation metadata for Phase ${number}.`)
      phase = {
        id: presentation[0],
        number,
        title: phaseMatch[2],
        accent: presentation[1],
        goal: '',
        learningGoal: '',
        buildingGoal: '',
        topics: [],
      }
      phases.push(phase)
      topic = undefined
      continue
    }

    if (!phase) continue

    const phaseField = line.match(/^\*\*(Phase goal|Phase learning goal|Phase building goal|Module aim|Module learning outcomes|Module practical assessment):\*\* (.+)$/)
    if (phaseField) {
      const keys = {
        'Phase goal': 'goal',
        'Phase learning goal': 'learningGoal',
        'Phase building goal': 'buildingGoal',
        'Module aim': 'goal',
        'Module learning outcomes': 'learningGoal',
        'Module practical assessment': 'buildingGoal',
      }
      const key = keys[phaseField[1]]
      phase[key] = phaseField[2]
      continue
    }

    const topicMatch = line.match(/^### (\d+)\.(\d+) (.+)$/)
    if (topicMatch) {
      topic = {
        phaseNumber: Number(topicMatch[1]),
        number: Number(topicMatch[2]),
        title: topicMatch[3].replaceAll('`', ''),
        description: '',
        learningGoal: '',
        buildingGoal: '',
        readingNote: '',
        sources: [],
      }
      phase.topics.push(topic)
      continue
    }

    if (!topic) continue

    const topicField = line.match(/^- \*\*(Learning goal|Learning outcomes|Building goal|Practical assessment|Applied exercises|Reading note|Reading guidance):\*\* (.+)$/)
    if (topicField) {
      const keys = {
        'Learning goal': 'learningGoal',
        'Learning outcomes': 'learningGoal',
        'Building goal': 'buildingGoal',
        'Practical assessment': 'buildingGoal',
        'Applied exercises': 'buildingGoal',
        'Reading note': 'readingNote',
        'Reading guidance': 'readingNote',
      }
      topic[keys[topicField[1]]] = topicField[2]
      continue
    }

    const sourceMatch = line.match(/^- \*\*(Core reading|Required reading|Supporting reading|Recommended reading|Official documentation|Technical references|Optional reading|Further reading):\*\*(?: (.*))?$/)
    if (sourceMatch) {
      const type = sourceTypes.get(sourceMatch[1])
      const inline = sourceMatch[2]?.trim()
      const nextNested = lines[index + 1]?.match(/^  - (.+)$/)
      if (inline && nextNested && inline.endsWith(':')) {
        const bookIntro = inline.slice(0, -1)
        while (index + 1 < lines.length) {
          const nested = lines[index + 1].match(/^  - (.+)$/)
          if (!nested) break
          topic.sources.push({ type, content: `${bookIntro}, ${nested[1]}` })
          index += 1
        }
      } else if (inline) {
        topic.sources.push({ type, content: inline })
      } else {
        while (index + 1 < lines.length) {
          const nested = lines[index + 1].match(/^  - (.+)$/)
          if (!nested) break
          topic.sources.push({ type, content: nested[1] })
          index += 1
        }
      }
      continue
    }

    if (!topic.learningGoal && line.trim() && !line.startsWith('#')) {
      topic.description = [topic.description, line.trim()].filter(Boolean).join(' ')
    }
  }

  for (const item of phases) {
    if (!item.goal || !item.learningGoal || !item.buildingGoal) {
      throw new Error(`Phase ${item.number} is missing one or more goals.`)
    }
    for (const lesson of item.topics) {
      if (!lesson.learningGoal || !lesson.buildingGoal || !lesson.sources.length) {
        throw new Error(`Topic ${item.number}.${lesson.number} is incomplete.`)
      }
    }
  }

  return phases
}

function normaliseTitle(value) {
  return value
    .toLowerCase()
    .replaceAll('`', '')
    .replaceAll('tokenisation', 'tokenization')
    .replaceAll('regularisation', 'regularization')
    .replaceAll('quantisation', 'quantization')
    .replaceAll('authorisation', 'authorization')
    .replace(/\s+\(extension\)$/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function slugify(value) {
  return normaliseTitle(value).split(' ').slice(0, 4).join('-')
}

function plainText(value) {
  return value
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replaceAll('_', '')
    .replaceAll('`', '')
}

const phases = parseRoadmap(markdown)
const database = new Database(seedPath)
database.pragma('foreign_keys = ON')

const tableColumns = (table) => new Set(database.prepare(`PRAGMA table_info(${table})`).all().map((column) => column.name))
const addColumn = (table, name, definition) => {
  if (!tableColumns(table).has(name)) database.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`)
}

addColumn('phases', 'learning_goal', "TEXT NOT NULL DEFAULT ''")
addColumn('phases', 'building_goal', "TEXT NOT NULL DEFAULT ''")
addColumn('topics', 'description', "TEXT NOT NULL DEFAULT ''")
addColumn('topics', 'learning_goal', "TEXT NOT NULL DEFAULT ''")
addColumn('topics', 'reading_note', "TEXT NOT NULL DEFAULT ''")
addColumn('topics', 'is_extension', 'INTEGER NOT NULL DEFAULT 0 CHECK (is_extension IN (0, 1))')
addColumn('books', 'reference_url', "TEXT NOT NULL DEFAULT ''")
addColumn('books', 'is_optional', 'INTEGER NOT NULL DEFAULT 0 CHECK (is_optional IN (0, 1))')
if (!tableColumns('topics').has('applied_exercises')) {
  if (tableColumns('topics').has('building_goal')) database.exec('ALTER TABLE topics RENAME COLUMN building_goal TO applied_exercises')
  else addColumn('topics', 'applied_exercises', "TEXT NOT NULL DEFAULT ''")
}
if (tableColumns('topics').has('practice')) database.exec('ALTER TABLE topics DROP COLUMN practice')
if (tableColumns('phases').has('eyebrow')) database.exec('ALTER TABLE phases DROP COLUMN eyebrow')

database.exec(`
  CREATE TABLE IF NOT EXISTS topic_sources (
    id INTEGER PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('core', 'supporting', 'official', 'optional')),
    content TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    UNIQUE (topic_id, source_type, sort_order)
  );
  CREATE TABLE IF NOT EXISTS catalog_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`)

const oldTopics = database.prepare(`
  SELECT topics.id, topics.title, topics.sort_order, phases.number AS phase_number
  FROM topics JOIN phases ON phases.id = topics.phase_id
`).all()
const oldIdByTitle = new Map(oldTopics.map((row) => [`${row.phase_number}:${normaliseTitle(row.title)}`, row.id]))
const oldIdByCoordinate = new Map(oldTopics.map((row) => [`${row.phase_number}.${row.sort_order + 1}`, row.id]))
const idOverrides = new Map([
  ['6.8', 'p6-mcp'],
  ['6.10', 'p6-frameworks'],
  ['8.9', 'p8-guardrails'],
  ['8.11', 'p8-feedback'],
])

const extraBooks = [
  {
    id: 'aima', shortTitle: 'Artificial Intelligence', title: 'Artificial Intelligence: A Modern Approach',
    authors: 'Stuart Russell and Peter Norvig', summary: 'A broad reference for artificial intelligence, including ethics, safety, privacy and fairness.', color: '#526a86', optional: 0, url: '',
  },
  {
    id: 'deep-rl', shortTitle: 'Deep Reinforcement Learning', title: 'Deep Reinforcement Learning with Python',
    authors: 'Nimish Sanghi', summary: 'A practical introduction to reinforcement learning algorithms and their implementation in Python.', color: '#567b58', optional: 0, url: '',
  },
  {
    id: 'generative-deep-learning', shortTitle: 'Generative Deep Learning', title: 'Generative Deep Learning',
    authors: 'David Foster', summary: 'A practical guide to generative models, diffusion and multimodal architectures.', color: '#9b5e4a', optional: 0, url: '',
  },
  {
    id: 'hands-on-context-engineering', shortTitle: 'Hands-On Context Engineering', title: 'Hands-On Context Engineering',
    authors: 'Xinye Tang and Wei Sun', summary: 'An optional guide to building context systems that can be inspected, debugged and evaluated.', color: '#4d7c74', optional: 1, url: 'https://www.oreilly.com/library/view/hands-on-context-engineering/0642572371005/',
  },
  {
    id: 'learn-mcp-python', shortTitle: 'Learn MCP with Python', title: 'Learn Model Context Protocol with Python',
    authors: 'Christoffer Noring', summary: 'An optional practical guide to implementing Model Context Protocol integrations in Python.', color: '#6a6591', optional: 1, url: 'https://www.oreilly.com/library/view/learn-model-context/9781806103232/',
  },
]

const sync = database.transaction(() => {
  const upsertPhase = database.prepare(`
    INSERT INTO phases (id, number, title, goal, outcome, accent, sort_order, learning_goal, building_goal)
    VALUES (@id, @number, @title, @goal, @buildingGoal, @accent, @number, @learningGoal, @buildingGoal)
    ON CONFLICT(id) DO UPDATE SET number=excluded.number, title=excluded.title,
      goal=excluded.goal, outcome=excluded.outcome, accent=excluded.accent, sort_order=excluded.sort_order,
      learning_goal=excluded.learning_goal, building_goal=excluded.building_goal
  `)
  const upsertTopic = database.prepare(`
    INSERT INTO topics (
      id, phase_id, title, primary_source, secondary_source, sort_order,
      description, learning_goal, applied_exercises, reading_note, is_extension
    ) VALUES (
      @id, @phaseId, @title, @primary, @secondary, @sortOrder,
      @description, @learningGoal, @buildingGoal, @readingNote, @isExtension
    )
    ON CONFLICT(id) DO UPDATE SET phase_id=excluded.phase_id, title=excluded.title,
      primary_source=excluded.primary_source, secondary_source=excluded.secondary_source,
      sort_order=excluded.sort_order, description=excluded.description,
      learning_goal=excluded.learning_goal, applied_exercises=excluded.applied_exercises,
      reading_note=excluded.reading_note, is_extension=excluded.is_extension
  `)
  const insertSource = database.prepare(`
    INSERT INTO topic_sources (topic_id, source_type, content, sort_order) VALUES (?, ?, ?, ?)
  `)

  const activeTopicIds = []
  database.prepare('DELETE FROM topic_sources').run()
  database.prepare('UPDATE topics SET sort_order = sort_order + 100').run()
  for (const phase of phases) {
    upsertPhase.run(phase)
    for (const topic of phase.topics) {
      const coordinate = `${phase.number}.${topic.number}`
      const id = idOverrides.get(coordinate)
        ?? oldIdByTitle.get(`${phase.number}:${normaliseTitle(topic.title)}`)
        ?? oldIdByCoordinate.get(coordinate)
        ?? `p${phase.number}-${slugify(topic.title)}`
      const core = topic.sources.find((source) => source.type === 'core')?.content ?? ''
      const supporting = topic.sources.find((source) => source.type === 'supporting')?.content ?? ''
      upsertTopic.run({
        ...topic,
        id,
        phaseId: phase.id,
        primary: plainText(core),
        secondary: plainText(supporting),
        sortOrder: topic.number - 1,
        isExtension: topic.title.endsWith('(extension)') ? 1 : 0,
      })
      activeTopicIds.push(id)
      topic.sources.forEach((source, sourceIndex) => insertSource.run(id, source.type, source.content, sourceIndex))
    }
  }

  const topicPlaceholders = activeTopicIds.map(() => '?').join(', ')
  database.prepare(`DELETE FROM topics WHERE id NOT IN (${topicPlaceholders})`).run(...activeTopicIds)

  const upsertBook = database.prepare(`
    INSERT INTO books (id, short_title, title, authors, summary, color, sort_order, reference_url, is_optional)
    VALUES (@id, @shortTitle, @title, @authors, @summary, @color, @sortOrder, @url, @optional)
    ON CONFLICT(id) DO UPDATE SET short_title=excluded.short_title, title=excluded.title,
      authors=excluded.authors, summary=excluded.summary, color=excluded.color,
      sort_order=excluded.sort_order, reference_url=excluded.reference_url, is_optional=excluded.is_optional
  `)
  const insertAlias = database.prepare(`
    INSERT OR IGNORE INTO book_aliases (book_id, alias, sort_order) VALUES (?, ?, ?)
  `)
  const extraBookIds = extraBooks.map((book) => book.id)
  const bookPlaceholders = extraBookIds.map(() => '?').join(', ')
  const currentBookCount = database.prepare(`SELECT COUNT(*) AS count FROM books WHERE id NOT IN (${bookPlaceholders})`).get(...extraBookIds).count
  extraBooks.forEach((book, index) => {
    upsertBook.run({ ...book, sortOrder: currentBookCount + index })
    insertAlias.run(book.id, book.title, 0)
    if (book.shortTitle !== book.title) insertAlias.run(book.id, book.shortTitle, 1)
  })

  const curatedAliases = new Map([
    ['fastapi-voron', ['Building Data Science Applications with FastAPI']],
    ['build-llm', ['Build a Large Language Model']],
    ['ddia', ['Designing Data-Intensive Applications']],
  ])
  const bookRows = database.prepare('SELECT id, short_title, title FROM books').all()
  bookRows.forEach((book) => {
    const aliases = [book.short_title, book.title, ...(curatedAliases.get(book.id) ?? [])]
    aliases.forEach((alias, index) => insertAlias.run(book.id, alias, 100 + index))
  })

  const chapterRows = [
    ['aima', '27', 'Philosophy, Ethics, and Safety of AI'],
    ['generative-deep-learning', '13', 'Multimodal Models'],
    ['hands-on-ml', '16', 'Vision and Multimodal Transformers'],
  ]
  const insertChapter = database.prepare(`
    INSERT INTO book_chapters (book_id, chapter_key, title, sort_order) VALUES (?, ?, ?, ?)
    ON CONFLICT(book_id, chapter_key) DO UPDATE SET title=excluded.title
  `)
  chapterRows.forEach((row, index) => insertChapter.run(...row, index))

  const metadata = database.prepare(`
    INSERT INTO catalog_metadata (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value
  `)
  metadata.run('schema_version', '4')
  metadata.run('content_version', createHash('sha256').update(`${catalogueRevision}\n${markdown}`).digest('hex'))
  metadata.run('source_document', 'docs/ai-engineering-roadmap-new.md')
  database.pragma('user_version = 4')
})

sync()
database.pragma('optimize')

const topicCount = database.prepare('SELECT COUNT(*) AS count FROM topics').get().count
const sourceCount = database.prepare('SELECT COUNT(*) AS count FROM topic_sources').get().count
const bookCount = database.prepare('SELECT COUNT(*) AS count FROM books').get().count
const integrity = database.pragma('quick_check', { simple: true })
database.close()

if (phases.length !== 13 || topicCount !== 99 || integrity !== 'ok') {
  throw new Error(`Seed validation failed: ${phases.length} phases, ${topicCount} topics, integrity ${integrity}.`)
}

console.log(`Updated roadmap seed: ${phases.length} phases, ${topicCount} topics, ${sourceCount} sources and ${bookCount} books.`)
