import { useMemo, useState } from 'react'
import { ArrowDownUp, Search } from 'lucide-react'
import EmptyState from './EmptyState'

const DASH = '—'

function UtilCell({ metric }) {
  if (metric?.cpu_average == null) return <td className="unmeasured">{DASH}</td>
  const value = Number(metric.cpu_average)
  return (
    <td>
      <span className="util-cell">
        <span className="util-track"><span className="util-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></span>
        <span className="util-value">{value}%</span>
      </span>
    </td>
  )
}

function ResourceRow({ resource, metric }) {
  const [open, setOpen] = useState(false)
  const tags = resource.tags || {}
  const launch = resource.launch_time ? new Date(resource.launch_time) : null
  return (
    <>
      <tr>
        <td><strong className="resource-id">{resource.instance_id || DASH}</strong></td>
        <td>{resource.instance_type || DASH}</td>
        <td><span className={`chip ${resource.state === 'running' ? 'chip--ok' : resource.state === 'stopped' ? 'chip--amber' : ''}`}>{resource.state || 'unknown'}</span></td>
        <td>{resource.availability_zone || DASH}</td>
        <td>{tags.Environment || tags.environment || 'Unassigned'}</td>
        <td>{tags.Owner || tags.owner || 'Unassigned'}</td>
        <UtilCell metric={metric} />
        <td><button type="button" className="btn btn--text" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Details'}</button></td>
      </tr>
      {open && (
        <tr className="resource-detail">
          <td colSpan={8}>
            <div className="redline-spec">
              <div><dt>Launched</dt><dd className="mono">{launch ? launch.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : DASH}</dd></div>
              <div><dt>CPU average</dt><dd className="mono">{metric?.cpu_average != null ? `${metric.cpu_average}% (${metric.data_points} points, 24h)` : DASH}</dd></div>
              <div><dt>CPU peak</dt><dd className="mono">{metric?.cpu_max != null ? `${metric.cpu_max}%` : DASH}</dd></div>
              <div><dt>Tags</dt><dd>{Object.keys(tags).length ? Object.entries(tags).map(([k, v]) => `${k}=${v}`).join(', ') : 'None reported'}</dd></div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function ResourceTable({ resources = [], metrics = [], loading = false, fullPage = false }) {
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [newestFirst, setNewestFirst] = useState(true)

  const metricsById = useMemo(() => Object.fromEntries(metrics.map((m) => [m.instance_id, m])), [metrics])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return resources
      .filter((r) => (stateFilter === 'all' ? true : (r.state || 'unknown') === stateFilter))
      .filter((r) => !q || [r.instance_id, r.instance_type, r.availability_zone, JSON.stringify(r.tags || {})].join(' ').toLowerCase().includes(q))
      .sort((a, b) => {
        const ta = a.launch_time ? new Date(a.launch_time).getTime() : 0
        const tb = b.launch_time ? new Date(b.launch_time).getTime() : 0
        return newestFirst ? tb - ta : ta - tb
      })
  }, [resources, query, stateFilter, newestFirst])

  const states = useMemo(() => {
    const counts = {}
    for (const r of resources) counts[r.state || 'unknown'] = (counts[r.state || 'unknown'] || 0) + 1
    return counts
  }, [resources])

  return (
    <section className={`panel ${fullPage ? 'resource-page' : ''}`}>
      <div className="panel-heading">
        <div>
          <h2>Resources</h2>
          <p>EC2 inventory from the latest read-only scan, newest first.</p>
        </div>
      </div>
      <div className="table-toolbar">
        <label className="search-box">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search id, type, tag" aria-label="Search resources" />
        </label>
        {['all', 'running', 'stopped'].map((s) => (
          <button key={s} type="button" className={`btn ${stateFilter === s ? 'btn--primary' : 'btn--secondary'}`} onClick={() => setStateFilter(s)}>{s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)} ({s === 'all' ? resources.length : states[s] || 0})</button>
        ))}
        <button type="button" className="btn btn--secondary" onClick={() => setNewestFirst(!newestFirst)} style={{ marginLeft: 'auto' }}><ArrowDownUp size={14} /> {newestFirst ? 'Newest first' : 'Oldest first'}</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Resource ID</th><th>Type</th><th>State</th><th>Availability zone</th><th>Environment</th><th>Owner</th><th>Utilization 24h</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><EmptyState loading title="Loading resources" /></td></tr>
            ) : filtered.length ? (
              filtered.map((resource) => <ResourceRow key={resource.instance_id} resource={resource} metric={metricsById[resource.instance_id]} />)
            ) : (
              <tr><td colSpan={8}><EmptyState title={query || stateFilter !== 'all' ? `No resources match the current filter` : 'No AWS resources discovered'} description={query || stateFilter !== 'all' ? 'Clear the search or state filter to see the full inventory.' : 'Connect AWS read access and add a scan to populate this sheet.'} /></td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-foot">
        <span>Showing {filtered.length} of {resources.length} resources</span>
        <span>{metrics.length ? 'Utilization from CloudWatch, last 24h' : 'Utilization unavailable'}</span>
      </div>
    </section>
  )
}

export default ResourceTable
