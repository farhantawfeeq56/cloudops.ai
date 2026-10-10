import { useEffect } from 'react'
import { BarChart3, Bot, Boxes, Cloud, Cog, FileCode2, LayoutDashboard, ShieldCheck, X } from 'lucide-react'
import StatusPill from './ui/StatusPill'

const groups = [
  { label: 'Monitor', items: [['Overview', LayoutDashboard], ['Resources', Boxes], ['Cost Analysis', BarChart3], ['AI Insights', Bot]] },
  { label: 'Govern', items: [['IaC Review', FileCode2], ['Governance', ShieldCheck]] },
]

function SheetIndex({ activePage, onNavigate, open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <aside className={`rail ${open ? 'is-open' : ''}`} aria-label="Sheet index">
      <div className="brand-row">
        <div className="brand-mark"><Cloud size={18} strokeWidth={1.8} /></div>
        <div><strong>CloudOps AI</strong><span>Cloud Intelligence Platform</span></div>
        <button type="button" className="rail-close" onClick={onClose} aria-label="Close sheet index"><X size={18} /></button>
      </div>
      {groups.map((group) => (
        <div className="nav-group" key={group.label}>
          <p className="nav-label">{group.label}</p>
          {group.items.map(([label, Icon]) => (
            <button
              key={label}
              type="button"
              className={`nav-item ${activePage === label ? 'active' : ''}`}
              onClick={() => onNavigate(label)}
              aria-current={activePage === label ? 'page' : undefined}
            >
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
            </button>
          ))}
        </div>
      ))}
      <div className="rail-footer">
        <StatusPill tone="warn">Read-only review</StatusPill>
        <p>CloudOps AI never creates, changes, or terminates AWS or Terraform resources.</p>
      </div>
      <div className="nav-group">
        <button type="button" className={`nav-item ${activePage === 'Settings' ? 'active' : ''}`} onClick={() => onNavigate('Settings')} aria-current={activePage === 'Settings' ? 'page' : undefined}>
          <Cog size={17} strokeWidth={1.8} /><span>Settings</span>
        </button>
      </div>
    </aside>
  )
}

export default SheetIndex
