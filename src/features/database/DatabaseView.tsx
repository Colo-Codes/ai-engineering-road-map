import { useEffect, useState } from 'react'
import { Database, RefreshCw } from 'lucide-react'
import { loadDatabaseAdmin } from '../../api'
import { pluralize } from '../../lib/format'
import type { DatabaseAdminData } from '../../types'

const STATE_TABLES = ['topic_progress', 'exercise_checklist', 'book_settings', 'custom_projects', 'study_sessions', 'study_intervals']

function formatCell(value: string | number | null) {
  if (value === null) return <span className="database-null">NULL</span>
  if (value === '') return <span className="database-empty">empty</span>
  return String(value)
}

export function DatabaseView() {
  const [data, setData] = useState<DatabaseAdminData | null>(null)
  const [selectedTable, setSelectedTable] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const result = await loadDatabaseAdmin()
        if (cancelled) return
        setData(result)
        setSelectedTable((current) => result.tables.some((table) => table.name === current) ? current : result.tables[0]?.name ?? '')
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'The database could not be inspected.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [refreshCount])

  const activeTable = data?.tables.find((table) => table.name === selectedTable)
  const countRows = (tables: DatabaseAdminData['tables']) => tables.reduce((sum, table) => sum + table.rows.length, 0)
  const totalRows = countRows(data?.tables ?? [])
  const stateRows = countRows(data?.tables.filter((table) => STATE_TABLES.includes(table.name)) ?? [])

  return (
    <section className="database-view">
      <header className="database-hero">
        <div>
          <h1>Database administration</h1>
          <p>Inspect the catalog and saved app state. This panel is read-only, so nothing can be changed accidentally.</p>
        </div>
        <button className="database-refresh" onClick={() => setRefreshCount((count) => count + 1)} disabled={loading}><RefreshCw size={17} />Refresh</button>
      </header>

      {error ? <div className="database-error" role="alert"><strong>Could not load the database</strong><span>{error}</span></div> : <>
        <div className="database-overview" aria-label="Database summary">
          <div><span>Database</span><strong>SQLite</strong><small>{data?.databaseFile ?? 'Loading…'}</small></div>
          <div><span>Tables</span><strong>{data?.tables.length ?? '—'}</strong><small>Catalog and app state</small></div>
          <div><span>Total rows</span><strong>{loading ? '—' : totalRows}</strong><small>Across every table</small></div>
          <div><span>Saved state</span><strong>{loading ? '—' : stateRows}</strong><small>Progress, exercises, settings, projects and study time</small></div>
        </div>

        <div className="database-browser">
          <nav className="database-table-nav" aria-label="Database tables">
            <div className="database-nav-heading"><span>Tables</span><small>Read only</small></div>
            {data?.tables.map((table) => <button key={table.name} className={table.name === selectedTable ? 'active' : ''} onClick={() => setSelectedTable(table.name)}><span>{table.label}<code>{table.name}</code></span><strong>{table.rows.length}</strong></button>)}
          </nav>

          <section className="database-table-panel" aria-live="polite">
            {loading && !activeTable ? <div className="database-loading">Loading database tables…</div> : activeTable ? <>
              <header><div><span>Table</span><h2>{activeTable.label}</h2><p>{activeTable.description}</p></div><strong>{pluralize(activeTable.rows.length, 'row')}</strong></header>
              {activeTable.rows.length ? <div className="database-table-scroll"><table><thead><tr>{activeTable.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{activeTable.rows.map((row, index) => <tr key={index}>{activeTable.columns.map((column) => <td key={column}>{formatCell(row[column])}</td>)}</tr>)}</tbody></table></div> : <div className="database-empty-table"><Database size={22} /><strong>No rows stored</strong><span>This table is ready but currently empty.</span></div>}
            </> : <div className="database-loading">No database tables are available.</div>}
          </section>
        </div>
      </>}
    </section>
  )
}
