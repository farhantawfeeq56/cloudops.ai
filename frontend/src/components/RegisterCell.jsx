import { Skeleton } from '@/components/ui/skeleton'

// Measurement register cell: a label, a tabular measurement, and an honest em
// dash for anything unmeasured. The register owns the one card; cells are plain.
function RegisterCell({ label, value, unmeasured = false, note, loading = false }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      {loading
        ? <Skeleton className="h-8 w-24" />
        : <span className={`text-3xl font-semibold tracking-tight tabular-nums ${unmeasured ? 'text-muted-foreground' : 'text-foreground'}`}>{value}</span>}
      {note && <span className="text-muted-foreground text-xs">{note}</span>}
    </div>
  )
}

export default RegisterCell
