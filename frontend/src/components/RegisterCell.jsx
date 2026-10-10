// Measurement register cell: a mono label, a mono tabular measurement, and an
// honest em dash for anything unmeasured.
function RegisterCell({ label, value, unmeasured = false, note, loading = false }) {
  return (
    <div className="register-cell">
      <span className="register-label">{label}</span>
      {loading
        ? <span className="register-value skeleton" aria-hidden="true">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        : <span className={`register-value ${unmeasured ? 'is-unmeasured' : ''}`}>{value}</span>}
      {note && <span className="register-note">{note}</span>}
    </div>
  )
}

export default RegisterCell
