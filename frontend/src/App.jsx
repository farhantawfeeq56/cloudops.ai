import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import SheetIndex from './components/Sidebar'
import TitleBlock from './components/TopBar'
import Dashboard from './pages/Dashboard'
import { Agentation } from 'agentation'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [railOpen, setRailOpen] = useState(false)
  const [scanRequested, setScanRequested] = useState(false)
  // Sample measurements are the default so the console is reviewable without
  // AWS credentials; ?sample=0 opts back into the live backend.
  const [sampleMode] = useState(() => new URLSearchParams(window.location.search).get('sample') !== '0')

  const navigate = (page) => { setActivePage(page); setRailOpen(false) }

  useEffect(() => {
    const onNavigate = (event) => navigate(event.detail)
    const onScan = () => setScanRequested(true)
    window.addEventListener('cloudops:navigate', onNavigate)
    window.addEventListener('cloudops:scan', onScan)
    return () => { window.removeEventListener('cloudops:navigate', onNavigate); window.removeEventListener('cloudops:scan', onScan) }
  }, [])

  return <>
  <div className="app-shell">
    <SheetIndex activePage={activePage} onNavigate={navigate} open={railOpen} onClose={() => setRailOpen(false)} />
    <div className="app-main">
      <TitleBlock onMenu={() => setRailOpen(true)} sampleMode={sampleMode} />
      <Dashboard activePage={activePage} sampleMode={sampleMode} />
    </div>
    {scanRequested && <div className="toast" role="status"><span><CheckCircle2 size={16} /> Scan will be available once the backend is connected.</span><button onClick={() => setScanRequested(false)} aria-label="Dismiss notification"><X size={15} /></button></div>}
  </div>
    {process.env.NODE_ENV === 'development' && <Agentation endpoint="http://localhost:4747" />}
  </>
}

export default App
