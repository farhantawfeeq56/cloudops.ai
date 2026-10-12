import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import EmptyState from './EmptyState'

const SERVICE_SHORT = {
  'amazon elastic compute cloud': 'EC2',
  'amazon simple storage service': 'S3',
  'amazon relational database service': 'RDS',
  'aws lambda': 'Lambda',
  'amazon cloudwatch': 'CloudWatch',
  'amazon virtual private cloud': 'VPC',
  'amazon dynamodb': 'DynamoDB',
  'amazon elastic kubernetes service': 'EKS',
  'amazon elastic container service': 'ECS',
  'amazon elastic container registry': 'ECR',
  'amazon simple queue service': 'SQS',
  'amazon simple notification service': 'SNS',
  'aws key management service': 'KMS',
  'amazon cloudfront': 'CloudFront',
  'amazon route 53': 'Route 53',
}

const shortName = (name) => SERVICE_SHORT[(name || '').toLowerCase()] || (name || '').slice(0, 12)

const compact = (value, currency) => {
  const symbol = currency === 'USD' ? '$' : `${currency} `
  if (Math.abs(value) >= 1000) return `${symbol}${(value / 1000).toFixed(1)}k`
  return `${symbol}${Math.round(value)}`
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

// The signature: the signal curve. A thin accent stroke with a soft fill that
// draws itself in when data lands. Reduced motion gets the complete frame.
export default function ChartBoard({ series = [], currency = 'USD', caption, note, loading }) {
  const [animate] = useState(() => !prefersReducedMotion())

  if (loading) return <EmptyState loading title="Loading measurements" />
  if (!series.length) {
    return (
      <div className="plot-empty">
        <strong>No measurements recorded</strong>
        <p>Cost by service appears here once Cost Explorer answers. The figure stays empty until it can be measured.</p>
      </div>
    )
  }

  const data = series.slice(0, 6).map((item) => ({ ...item, label: shortName(item.label) }))
  const gradientId = 'signal-curve'

  return (
    <div>
      <div style={{ width: '100%', height: 236 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 2 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              axisLine={{ stroke: 'var(--line)' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => compact(v, currency)}
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              cursor={{ stroke: 'var(--brand-line)' }}
              content={({ active, payload }) => (active && payload?.length ? (
                <div className="chart-tip">
                  {payload[0].payload.label_full || payload[0].payload.label}
                  <span className="mono">{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(payload[0].value)}</span>
                </div>
              ) : null)}
            />
            <Area
              type="step"
              dataKey="value"
              stroke="var(--brand)"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive={animate}
              animationDuration={900}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--surface)', stroke: 'var(--brand)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-legend">
        <span>{caption}</span>
        <span className="mono">{note}</span>
      </p>
    </div>
  )
}
