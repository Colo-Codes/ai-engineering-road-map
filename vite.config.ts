import { spawn } from 'node:child_process'
import { stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir } from 'node:os'
import { extname, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { createRoadmapDatabase, isBuildStatus, isTopicStatus, type CustomProject, type ExerciseChecklist, type LegacyState, type ProgressMap } from './server/database'

function sendJson(response: ServerResponse, status: number, body: object) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}

function readJson(request: IncomingMessage, limit = 12 * 1024 * 1024): Promise<unknown> {
  return new Promise((resolveBody, reject) => {
    let body = ''
    let tooLarge = false
    request.setEncoding('utf8')
    request.on('data', (chunk: string) => {
      if (tooLarge) return
      body += chunk
      if (body.length > limit) {
        tooLarge = true
        reject(new Error('The request is too large.'))
      }
    })
    request.on('end', () => {
      if (tooLarge) return
      try { resolveBody(JSON.parse(body || '{}')) }
      catch { reject(new SyntaxError('The request was not valid JSON.')) }
    })
    request.on('error', reject)
  })
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value).every((entry) => typeof entry === 'string')
}

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value).every((entry) => typeof entry === 'boolean')
}

function isCustomProjects(value: unknown): value is CustomProject[] {
  return Array.isArray(value) && value.every((project) => {
    if (!project || typeof project !== 'object') return false
    const candidate = project as Partial<CustomProject>
    return typeof candidate.id === 'string' && typeof candidate.title === 'string'
      && typeof candidate.note === 'string' && isBuildStatus(candidate.status)
  })
}

function localDataApi(): Plugin {
  const roadmapDatabase = createRoadmapDatabase(
    resolve(process.cwd(), 'data/roadmap.sqlite'),
    resolve(process.cwd(), 'data/roadmap.seed.sqlite'),
  )

  const handleApi = async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    const path = request.url?.split('?')[0]
    try {
      if (request.method === 'GET' && path === '/app-data') {
        sendJson(response, 200, roadmapDatabase.getAppData())
        return
      }

      if (request.method === 'GET' && path === '/database') {
        sendJson(response, 200, roadmapDatabase.getAdminData())
        return
      }

      if (request.method === 'PUT' && path === '/progress') {
        const payload = await readJson(request) as { progress?: unknown }
        if (!payload.progress || typeof payload.progress !== 'object' || Array.isArray(payload.progress)
          || !Object.values(payload.progress).every(isTopicStatus)) {
          sendJson(response, 400, { error: 'Progress data is invalid.' })
          return
        }
        roadmapDatabase.replaceProgress(payload.progress as ProgressMap)
        sendJson(response, 200, { saved: true })
        return
      }

      if (request.method === 'PUT' && path === '/exercise-checklist') {
        const payload = await readJson(request) as { exerciseChecklist?: unknown }
        if (!isBooleanRecord(payload.exerciseChecklist)) {
          sendJson(response, 400, { error: 'Exercise checklist data is invalid.' })
          return
        }
        roadmapDatabase.replaceExerciseChecklist(payload.exerciseChecklist as ExerciseChecklist)
        sendJson(response, 200, { saved: true })
        return
      }

      if (request.method === 'PUT' && path === '/book-settings') {
        const payload = await readJson(request) as { bookPaths?: unknown; bookCovers?: unknown }
        if (!isStringRecord(payload.bookPaths) || !isStringRecord(payload.bookCovers)) {
          sendJson(response, 400, { error: 'Book settings are invalid.' })
          return
        }
        roadmapDatabase.replaceBookSettings(payload.bookPaths, payload.bookCovers)
        sendJson(response, 200, { saved: true })
        return
      }

      if (request.method === 'PUT' && path === '/custom-projects') {
        const payload = await readJson(request) as { customProjects?: unknown }
        const projects = payload.customProjects
        if (!isCustomProjects(projects)) {
          sendJson(response, 400, { error: 'Custom project data is invalid.' })
          return
        }
        roadmapDatabase.replaceCustomProjects(projects)
        sendJson(response, 200, { saved: true })
        return
      }

      if (request.method === 'POST' && path === '/import-legacy') {
        const payload = await readJson(request) as Partial<LegacyState>
        if (!payload.progress || typeof payload.progress !== 'object' || Array.isArray(payload.progress)
          || !Object.values(payload.progress).every(isTopicStatus)
          || !isStringRecord(payload.bookPaths) || !isStringRecord(payload.bookCovers)
          || !isCustomProjects(payload.customProjects)) {
          sendJson(response, 400, { error: 'Legacy browser data is invalid.' })
          return
        }
        const imported = roadmapDatabase.importLegacyState(payload as LegacyState)
        sendJson(response, 200, { imported })
        return
      }

      next()
    } catch (error) {
      sendJson(response, error instanceof SyntaxError ? 400 : 500, {
        error: error instanceof Error ? error.message : 'The local database request failed.',
      })
    }
  }

  return {
    name: 'local-roadmap-database',
    configureServer(server) {
      server.middlewares.use('/api', handleApi)
      server.httpServer?.once('close', roadmapDatabase.close)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', handleApi)
      server.httpServer?.once('close', roadmapDatabase.close)
    },
  }
}

function localPdfOpener(): Plugin {
  const handleOpen = (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    if (request.method !== 'POST') {
      next()
      return
    }

    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk: string) => {
      body += chunk
      if (body.length > 8192) request.destroy()
    })
    request.on('end', async () => {
      try {
        const payload = JSON.parse(body) as { path?: unknown }
        if (typeof payload.path !== 'string' || !payload.path.trim()) {
          sendJson(response, 400, { error: 'Enter a local PDF path.' })
          return
        }

        const expanded = payload.path.trim().startsWith('~/')
          ? resolve(homedir(), payload.path.trim().slice(2))
          : resolve(payload.path.trim())
        if (extname(expanded).toLocaleLowerCase() !== '.pdf') {
          sendJson(response, 400, { error: 'The selected path must point to a PDF file.' })
          return
        }

        const file = await stat(expanded)
        if (!file.isFile()) {
          sendJson(response, 400, { error: 'The selected PDF path is not a file.' })
          return
        }

        const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd.exe' : 'xdg-open'
        const args = process.platform === 'win32' ? ['/c', 'start', '', expanded] : [expanded]
        const child = spawn(command, args, { detached: true, stdio: 'ignore' })
        await new Promise<void>((resolveSpawn, rejectSpawn) => {
          child.once('spawn', resolveSpawn)
          child.once('error', rejectSpawn)
        })
        child.unref()
        sendJson(response, 200, { opened: true })
      } catch (error) {
        const message = error instanceof SyntaxError
          ? 'The request was not valid.'
          : error instanceof Error && 'code' in error && error.code === 'ENOENT'
            ? 'No PDF exists at that path.'
            : 'The PDF could not be opened.'
        sendJson(response, 400, { error: message })
      }
    })
  }

  return {
    name: 'local-pdf-opener',
    configureServer(server) {
      server.middlewares.use('/api/open-file', handleOpen)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/open-file', handleOpen)
    },
  }
}

export default defineConfig({
  plugins: [react(), localDataApi(), localPdfOpener()],
  server: { watch: { ignored: ['**/data/roadmap.sqlite*'] } },
})
