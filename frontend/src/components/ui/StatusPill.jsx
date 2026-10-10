import './ui.css'

const TONES = ['ok', 'warn', 'amber', 'danger', 'red', 'info', 'blue', 'neutral']

function StatusPill({ tone = 'neutral', className = '', children, ...rest }) {
  const classes = ['chip', TONES.includes(tone) ? `chip--${tone}` : 'chip--neutral', className].filter(Boolean).join(' ')
  return (
    <span className={classes} {...rest}>
      <i className="dot" aria-hidden="true" />
      {children}
    </span>
  )
}

export default StatusPill
