import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import StatusPill from './ui/StatusPill'
import { getHealth } from '../services/api'

function TitleBlock({ onMenu, sampleMode = false }) {
  const [connection, setConnection] = useState(() => (sampleMode ? 'sample' : 'checking'))

  useEffect(() => {
    if (sampleMode) return undefined
    let active = true
    getHealth()
      .then(() => { if (active) setConnection('connected') })
      .catch(() => { if (active) setConnection('offline') })
    return () => { active = false }
  }, [sampleMode])

  const status = {
    checking: { tone: 'neutral', label: 'Checking' },
    connected: { tone: 'ok', label: 'Connected' },
    offline: { tone: 'amber', label: 'Offline' },
    sample: { tone: 'blue', label: 'Sample' },
  }[connection]

  return (
    <header className="titleblock">
      <div className="titleblock-heading">
        <button type="button" className="icon-button menu-button" onClick={onMenu} aria-label="Open sheet index"><Menu size={19} /></button>
        <span className="titleblock-wordmark">CloudOps AI</span>
        <span className="context-divider" />
        <span className="titleblock-account">AWS Account</span>
      </div>
      <div className="titleblock-context">
        <StatusPill tone={status.tone} title="Live connectivity to the CloudOps AI API (/health)">{status.label}</StatusPill>
        <span className="region-label">Region <b>—</b></span>
        <button type="button" className="btn btn--primary" onClick={() => window.dispatchEvent(new CustomEvent('cloudops:scan'))}>
          Add a scan
        </button>
      </div>
    </header>
  )
}

export default TitleBlock
