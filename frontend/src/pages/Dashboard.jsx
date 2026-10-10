import { AlertTriangle, Bot, CircleDollarSign, RefreshCw, Tags } from 'lucide-react'
import { useEffect, useState } from 'react'
import ChartBoard from '../components/ChartBoard'
import EmptyState from '../components/EmptyState'
import RegisterCell from '../components/RegisterCell'
import ResourceTable from '../components/ResourceTable'
import { getCostForecast, getCosts, getEc2Metrics, getEc2Resources, getInsights, getOverview } from '../services/api'
import { sample } from '../services/sampleData'

const DASH = '—'
const formatCurrency = (value, currency = 'USD') => typeof value === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value) : DASH
const getPayload = (result) => result.status === 'fulfilled' ? result.value.data : null
const isSampleMode = () => new URLSearchParams(window.location.search).get('sample') === '1'

function useDashboardData() {
  const [data, setData] = useState({ overview: null, resources: null, metrics: null, costs: null, insights: null, dailyCosts: null, forecast: null })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const load = async () => {
    if (isSampleMode()) {
      setData(sample)
      setLastUpdated(new Date())
      setLoading(false)
      return
    }
    setLoading(true)
    const results = await Promise.allSettled([getOverview(), getEc2Resources(), getEc2Metrics(), getCosts('monthly'), getInsights(), getCosts('daily'), getCostForecast('monthly')])
    setData({ overview: getPayload(results[0]), resources: getPayload(results[1]), metrics: getPayload(results[2]), costs: getPayload(results[3]), insights: getPayload(results[4]), dailyCosts: getPayload(results[5]), forecast: getPayload(results[6]) })
    setLastUpdated(new Date())
    setLoading(false)
  }
  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [])
  return { data, loading, lastUpdated, reload: load }
}

function DataStatus({ data, loading, lastUpdated, sampleMode = false }) {
  if (sampleMode) return <span className="data-badge"><i className="dot" style={{ background: 'var(--accent)' }} /> Sample measurements</span>
  const connected = Object.values(data).some((item) => item?.status === 'ok' || item?.status === 'healthy')
  const state = loading ? 'loading' : connected ? 'live' : 'offline'
  const label = { loading: 'Loading measurements', live: `Live data${lastUpdated ? ` · ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`, offline: 'Backend data unavailable' }[state]
  return <span className={`data-badge ${state === 'live' ? 'is-live' : state === 'offline' ? 'is-offline' : ''}`}><i className="dot" style={{ background: 'currentColor' }} /> {label}</span>
}

function CostPanel({ costs, dailyCosts, forecast, loading, period = 'monthly' }) {
  const services = costs?.services || []
  const unavailable = costs?.status === 'unavailable' || !costs
  const range = costs?.start && costs?.end_inclusive ? `${costs.start} → ${costs.end_inclusive}` : period === 'monthly' ? 'Current billing period' : 'Rolling 30 days'
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Cost overview</h2>
          <p>{period === 'monthly' ? 'Cost Explorer, month to date' : 'Cost Explorer, rolling 30 days'}. <span className="mono">{range}</span></p>
        </div>
        <CircleDollarSign className="panel-icon" size={18} strokeWidth={1.8} />
      </div>
      {loading ? <EmptyState loading title="Loading cost data" /> : unavailable ? (
        <div className="plot-empty">
          <strong>No measurements recorded</strong>
          <p>Cost Explorer data requires valid AWS access and permissions. The figure stays empty until it can be measured.</p>
        </div>
      ) : services.length ? (
        <>
          <ChartBoard
            series={services.map((item) => ({ label: item.service, label_full: item.service, value: item.cost }))}
            currency={costs.currency}
            caption={`Cost by service · ${costs.currency || 'USD'}`}
            note={`${services.length} services measured`}
          />
          <dl className="service-list">
            {services.slice(0, 6).map((item) => <div className="figure-row" key={item.service}><dt className="figure-key">{item.service}</dt><dd className="figure-value">{formatCurrency(item.cost, costs.currency)}</dd></div>)}
            {period === 'monthly' && <div className="figure-row"><dt className="figure-key">Last 30 days</dt><dd className="figure-value">{formatCurrency(dailyCosts?.total_cost, dailyCosts?.currency)}</dd></div>}
            {period === 'monthly' && <div className="figure-row"><dt className="figure-key">Month-end forecast (AWS)</dt><dd className="figure-value">{forecast?.available ? formatCurrency(forecast.mean, forecast.currency) : DASH}</dd></div>}
          </dl>
        </>
      ) : (
        <div className="plot-empty">
          <strong>No measurements recorded</strong>
          <p>Cost Explorer returned no grouped services for this period.</p>
        </div>
      )}
    </section>
  )
}

const SEVERITY_CHIP = { high: 'chip--red', medium: 'chip--warn', low: '' }
const SEVERITY_WORD = { high: 'High', medium: 'Medium', low: 'Low' }

function FindingRow({ finding, expanded, onToggle }) {
  const severity = finding.severity || 'unclassified'
  const savings = finding.estimated_monthly_savings
  return (
    <>
      <div className="finding-row">
        <span className={`severity-dot ${severity}`} aria-hidden="true" />
        <div className="finding-body">
          <span className="finding-title">{finding.issue || 'Finding'}<span className={`chip ${SEVERITY_CHIP[severity] || ''}`}>{SEVERITY_WORD[severity] || severity}</span></span>
          <span className="finding-resource">{finding.resource_id || 'Resource unavailable'}</span>
        </div>
        <span className="finding-saving" title={savings > 0 ? 'Estimated monthly saving reported by the finding' : 'No saving reported'}>
          {typeof savings === 'number' && savings > 0 ? formatCurrency(savings) : DASH}
        </span>
        <button type="button" className="btn btn--ghost" aria-expanded={expanded} onClick={onToggle}>{expanded ? 'Hide' : 'Review'}</button>
      </div>
      {expanded && (
        <div className="finding-row finding-detail">
          <span />
          <div style={{ flex: 1 }}>
            <dl className="redline-spec">
              <div><dt>Action</dt><dd>{finding.recommendation || DASH}</dd></div>
              <div><dt>Evidence</dt><dd><ul>{(finding.evidence || []).map((line, i) => <li key={i}>{line}</li>)}</ul></dd></div>
              <div><dt>Monthly saving</dt><dd className="mono">{typeof savings === 'number' && savings > 0 ? formatCurrency(savings) : DASH}</dd></div>
              <div><dt>Resource</dt><dd className="mono">{finding.resource_id || DASH}{finding.resource_type ? ` · ${finding.resource_type}` : ''}</dd></div>
            </dl>
          </div>
        </div>
      )}
    </>
  )
}

function FindingsPanel({ findings, loading, fullPage = false }) {
  const [openKey, setOpenKey] = useState(null)
  const shown = fullPage ? findings : findings.slice(0, 5)
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Optimization findings</h2>
          <p>Rules detect, then explain. Every finding is read-only and waits for human review.</p>
        </div>
        <AlertTriangle className="panel-icon" size={18} strokeWidth={1.8} />
      </div>
      {loading ? <EmptyState loading title="Loading findings" /> : !findings.length ? (
        <div className="plot-empty" style={{ minHeight: 180 }}>
          <strong>No findings recorded</strong>
          <p>Findings appear when the decision engine identifies a review opportunity in the measured resource state.</p>
        </div>
      ) : (
        <>
          <div className="findings-list">
            {shown.map((finding, index) => {
              const key = `${finding.resource_id}-${finding.issue}-${index}`
              return <FindingRow key={key} finding={finding} index={index} expanded={openKey === key} onToggle={() => setOpenKey(openKey === key ? null : key)} />
            })}
          </div>
          {!fullPage && findings.length > shown.length && (
            <div className="findings-foot"><button type="button" className="btn btn--text" onClick={() => window.dispatchEvent(new CustomEvent('cloudops:navigate', { detail: 'AI Insights' }))}>Open AI Insights for all {findings.length} findings</button></div>
          )}
        </>
      )}
    </section>
  )
}

// A findings list that owns its own expand state, so every sheet's Review
// button works. The Overview queue is capped and links out; the full sheets
// use this to expand any row.
function FindingsList({ findings = [] }) {
  const [openKey, setOpenKey] = useState(null)
  return (
    <div className="findings-list">
      {findings.map((finding, index) => {
        const key = `${finding.resource_id}-${finding.issue}-${index}`
        return <FindingRow key={key} finding={finding} index={index} expanded={openKey === key} onToggle={() => setOpenKey(openKey === key ? null : key)} />
      })}
    </div>
  )
}

// The review record for one Terraform plan. No plan is ever submitted from
// here (read-only), so every field is an em dash with the reason beside it,
// per the honesty rule.
function IacSection({ heading = true }) {
  const fields = [
    { label: 'Plan received', note: 'No plan submitted yet' },
    { label: 'Resources changed', note: 'Awaits a plan' },
    { label: 'Monthly cost delta', note: 'Awaits Infracost output' },
    { label: 'Metrics', note: 'Awaits a plan' },
    { label: 'Policy findings', note: 'Awaits a plan' },
    { label: 'Review status', note: 'Awaits human review' },
  ]
  return (
    <section className="section-block">
      <div className="section-heading">
        {heading
          ? <div><h2>Infrastructure as Code review</h2><p>Every proposed change moves through cost analysis and human review. CloudOps AI never applies changes automatically.</p></div>
          : <p>Every proposed change moves through cost analysis and human review. CloudOps AI never applies changes automatically.</p>}
      </div>
      <dl className="iac-record">
        {fields.map((field) => (
          <div className="iac-record-row" key={field.label}>
            <dt>{field.label}</dt>
            <dd>
              <span className="iac-record-value">{DASH}</span>
              <span className="iac-record-note">{field.note}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const TITLES = {
  Overview: 'Infrastructure overview',
  Resources: 'Resource inventory',
  'Cost Analysis': 'Cost analysis',
  'AI Insights': 'AI insights',
  'IaC Review': 'Infrastructure as Code review',
  Governance: 'Governance signals',
  Settings: 'Connection settings',
}

const INTROS = {
  Overview: "Here's how your AWS account is doing. Unavailable measurements stay marked, never filled in.",
  Resources: 'The read-only EC2 inventory, with ownership and utilization where they were measured.',
  'Cost Analysis': 'Cost Explorer measurements for the account: spend to date, the rolling 30 days, and the AWS forecast.',
  'AI Insights': 'Rules detect findings. The explanation layer adds context and trade-offs for human review.',
  'IaC Review': 'Submit a Terraform plan and Infracost output for read-only, cost-aware review.',
  Governance: 'Policy and ownership findings, shown when the configured analysis returns them.',
  Settings: 'How this frontend reaches the backend, and where credentials stay.',
}

function CostAnalysis({ data, loading }) {
  const [period, setPeriod] = useState('monthly')
  const costs = period === 'monthly' ? data.costs : data.dailyCosts
  return (
    <>
      <div className="page-heading" style={{ marginBottom: 20 }}>
        <div>
          <h1>{TITLES['Cost Analysis']}</h1>
          <p>{INTROS['Cost Analysis']}</p>
        </div>
        <div className="tabs" role="tablist" aria-label="Cost period">
          <button type="button" role="tab" aria-selected={period === 'monthly'} className={`tab ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>Month to date</button>
          <button type="button" role="tab" aria-selected={period === 'daily'} className={`tab ${period === 'daily' ? 'active' : ''}`} onClick={() => setPeriod('daily')}>Last 30 days</button>
        </div>
      </div>
      <section className="register" aria-label="Cost register">
        <RegisterCell label="Period total" value={formatCurrency(costs?.total_cost, costs?.currency)} unmeasured={costs?.total_cost == null} note={costs?.start && costs?.end_inclusive ? `${costs.start} → ${costs.end_inclusive}` : 'Cost Explorer'} loading={loading} />
        <RegisterCell label="Services measured" value={costs?.services?.length == null ? DASH : String(costs.services.length)} unmeasured={!costs?.services?.length} note="Grouped by AWS service" loading={loading} />
        <RegisterCell label="Largest service" value={costs?.services?.[0] ? formatCurrency(costs.services[0].cost, costs.currency) : DASH} unmeasured={!costs?.services?.[0]} note={costs?.services?.[0]?.service || 'No service costs returned'} loading={loading} />
        <RegisterCell label="Month-end forecast" value={data.forecast?.available ? formatCurrency(data.forecast.mean, data.forecast.currency) : DASH} unmeasured={!data.forecast?.available} note="AWS GetCostForecast" loading={loading} />
      </section>
      <CostPanel costs={costs} dailyCosts={data.dailyCosts} forecast={data.forecast} loading={loading} period={period} />
    </>
  )
}

function Dashboard({ activePage = 'Overview', sampleMode = false }) {
  const { data, loading, lastUpdated, reload } = useDashboardData()
  const resources = data.resources?.instances || []
  const findings = data.insights?.findings || []
  const savings = findings.reduce((total, finding) => total + (typeof finding.estimated_monthly_savings === 'number' ? finding.estimated_monthly_savings : 0), 0)

  return (
    <main className="dashboard-content">
      {sampleMode && (
        <div className="sample-banner" role="status">
          <p><strong>Sample data.</strong> Measurements on this sheet come from a local fixture, not from AWS. <button type="button" className="btn btn--text" onClick={() => { const url = new URL(window.location.href); url.searchParams.delete('sample'); window.location.replace(url.toString()) }}>Load live data</button></p>
        </div>
      )}

      {(activePage === 'Overview' || activePage === 'Cost Analysis') && (
        <div className="page-heading">
          <div>
            <h1>{TITLES[activePage]}</h1>
            <p>{INTROS[activePage]}</p>
          </div>
          {activePage === 'Overview' && (
            <div className="heading-actions">
              <DataStatus data={data} loading={loading} lastUpdated={lastUpdated} sampleMode={sampleMode} />
              <button className="btn btn--secondary" onClick={reload} disabled={loading} title="Refresh backend data"><RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh</button>
            </div>
          )}
        </div>
      )}

      {activePage === 'Overview' && (
        <>
          <section className="register" aria-label="Measurement register">
            <RegisterCell label="Monthly cloud cost" value={formatCurrency(data.costs?.total_cost, data.costs?.currency)} unmeasured={data.costs?.total_cost == null} note="Cost Explorer, month to date" loading={loading} />
            <RegisterCell label="Resources" value={data.resources?.total_instances == null ? DASH : String(data.resources.total_instances)} unmeasured={data.resources?.total_instances == null} note="EC2 instances discovered" loading={loading} />
            <RegisterCell label="Potential savings" value={savings > 0 ? formatCurrency(savings, data.costs?.currency) : DASH} unmeasured={!(savings > 0)} note="Only where a finding reports it" loading={loading} />
            <RegisterCell label="Active findings" value={data.insights?.total_findings == null ? DASH : String(data.insights.total_findings)} unmeasured={data.insights?.total_findings == null} note="Deterministic decision engine" loading={loading} />
          </section>
          <div className="two-column">
            <CostPanel costs={data.costs} dailyCosts={data.dailyCosts} forecast={data.forecast} loading={loading} />
            <FindingsPanel findings={findings} loading={loading} />
          </div>
          <section className="section-block">
            <div className="section-heading">
              <div>
                <h2>Resource summary</h2>
                <p>The inventory the findings above refer to.</p>
              </div>
            </div>
            <ResourceTable resources={resources} metrics={data.metrics?.metrics || []} loading={loading} />
          </section>
          <IacSection />
        </>
      )}

      {activePage === 'Resources' && (
        <>
          <div className="page-heading">
            <div><h1>{TITLES.Resources}</h1><p>{INTROS.Resources}</p></div>
            <div className="heading-actions"><DataStatus data={data} loading={loading} lastUpdated={lastUpdated} sampleMode={sampleMode} /></div>
          </div>
          <ResourceTable resources={resources} metrics={data.metrics?.metrics || []} loading={loading} fullPage />
        </>
      )}

      {activePage === 'Cost Analysis' && <CostAnalysis data={data} loading={loading} />}

      {activePage === 'AI Insights' && (
        <>
          <div className="page-heading">
            <div><h1>{TITLES['AI Insights']}</h1><p>{INTROS['AI Insights']}</p></div>
          </div>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Findings review</h2>
                <p>{data.insights?.explanation || 'Detection runs on deterministic rules; the explanation layer adds context and trade-offs.'}</p>
              </div>
              <Bot className="panel-icon" size={18} strokeWidth={1.8} />
            </div>
            {loading ? <EmptyState loading title="Loading findings" /> : !findings.length ? (
              <div className="plot-empty" style={{ minHeight: 180 }}>
                <strong>No findings recorded</strong>
                <p>Findings appear when the decision engine identifies a review opportunity in the measured resource state.</p>
              </div>
            ) : (
              <FindingsList findings={findings} />
            )}
          </section>
        </>
      )}

      {activePage === 'IaC Review' && (
        <>
          <div className="page-heading">
            <div><h1>{TITLES['IaC Review']}</h1><p>{INTROS['IaC Review']}</p></div>
          </div>
          <IacSection heading={false} />
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Plan analysis</h2>
                <p>Submit a plan with <span className="mono">POST /api/iac/analyze</span> to review proposed infrastructure changes.</p>
              </div>
            </div>
            <div className="plot-empty" style={{ minHeight: 180 }}>
              <strong>No plan submitted</strong>
              <p>A Terraform plan and Infracost output can be analyzed read-only. Nothing is applied, and the review record stays empty until a plan arrives.</p>
            </div>
          </section>
        </>
      )}

      {activePage === 'Governance' && (
        <>
          <div className="page-heading">
            <div><h1>{TITLES.Governance}</h1><p>{INTROS.Governance}</p></div>
          </div>
          <section className="panel">
            <div className="panel-heading">
              <div><h2>Governance signals</h2><p>Findings the analysis tags as policy or ownership issues.</p></div>
              <Tags className="panel-icon" size={18} strokeWidth={1.8} />
            </div>
            {loading ? <EmptyState loading title="Loading findings" /> : (() => {
              const governance = findings.filter((finding) => /tag|policy|owner/i.test(finding.issue || ''))
              return governance.length ? (
                <FindingsList findings={governance} />
              ) : (
                <div className="plot-empty" style={{ minHeight: 180 }}>
                  <strong>No findings recorded</strong>
                  <p>Governance findings appear when a resource is missing ownership or policy tags.</p>
                </div>
              )
            })()}
          </section>
        </>
      )}

      {activePage === 'Settings' && (
        <>
          <div className="page-heading">
            <div><h1>{TITLES.Settings}</h1><p>{INTROS.Settings}</p></div>
          </div>
          <section className="panel settings-page">
            <h2>Connection settings</h2>
            <p>Frontend requests use <span className="mono">VITE_API_URL</span>. Backend credentials remain in the standard AWS credential chain and are never exposed to the browser.</p>
            <dl>
              <div><dt>API base URL</dt><dd>{import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}</dd></div>
              <div><dt>Infrastructure actions</dt><dd>Read-only. Terraform apply is not exposed.</dd></div>
              <div><dt>Sample mode</dt><dd>Append <span style={{ color: 'var(--ink)' }}>?sample=1</span> to the URL to load demonstration measurements.</dd></div>
            </dl>
          </section>
        </>
      )}
    </main>
  )
}

export default Dashboard
