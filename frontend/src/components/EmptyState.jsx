import { Inbox, LoaderCircle } from 'lucide-react'

// Standard sheet-empty state. Plot surfaces use their own dashed frame
// ("NO MEASUREMENTS RECORDED"), rendered by the panel that owns them.
function EmptyState({ title = 'No data available', description, loading = false, error = false }) {
  return (
    <div className={`empty-state ${loading ? 'is-loading' : ''} ${error ? 'is-error' : ''}`}>
      {loading ? <LoaderCircle className="empty-icon spin" size={20} /> : <Inbox className="empty-icon" size={20} />}
      <strong>{loading ? 'Loading measurements…' : error ? 'Unable to load data' : title}</strong>
      {description && <p>{description}</p>}
    </div>
  )
}

export default EmptyState
