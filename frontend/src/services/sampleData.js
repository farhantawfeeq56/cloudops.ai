// Sample payloads shaped exactly like the FastAPI responses, used only when the
// URL carries ?sample=1. Every number is invented for demonstration and the UI
// marks it as sample data; nothing here is ever presented as account data.

export const sample = {
  overview: {
    status: 'ok',
    resources: { status: 'ok', total_instances: 12, by_state: { running: 8, stopped: 4 } },
    insights: { status: 'ok', metrics_status: 'ok', total_findings: 5, by_severity: { high: 1, medium: 3, low: 1 } },
  },
  resources: {
    status: 'ok',
    total_instances: 12,
    instances: [
      { instance_id: 'i-0a91c4e7d2b5f3180', instance_type: 'm6i.2xlarge', state: 'running', availability_zone: 'us-east-1a', launch_time: '2026-08-14T09:12:00+00:00', tags: { Name: 'checkout-api', Environment: 'production', Owner: 'payments-team' } },
      { instance_id: 'i-04f2b8a1c9e7d6032', instance_type: 'm6i.2xlarge', state: 'running', availability_zone: 'us-east-1b', launch_time: '2026-08-14T09:40:00+00:00', tags: { Name: 'checkout-api', Environment: 'production', Owner: 'payments-team' } },
      { instance_id: 'i-07c5d3e2f8a1b4960', instance_type: 'c7g.xlarge', state: 'running', availability_zone: 'us-east-1a', launch_time: '2026-06-02T14:05:00+00:00', tags: { Name: 'search-worker', Environment: 'production', Owner: 'discovery-team' } },
      { instance_id: 'i-0d18e7b4a2c9f5035', instance_type: 't3.medium', state: 'stopped', availability_zone: 'us-east-1a', launch_time: '2025-11-27T18:22:00+00:00', tags: { Name: 'reporting-batch', Environment: 'staging' } },
      { instance_id: 'i-0e6f1a9d4b7c2808', instance_type: 'r7g.large', state: 'running', availability_zone: 'us-east-1b', launch_time: '2026-03-19T11:47:00+00:00', tags: { Name: 'ledger-db', Environment: 'production', Owner: 'finance-platform' } },
      { instance_id: 'i-0f34b7c2e5a8d1976', instance_type: 't3.small', state: 'running', availability_zone: 'us-east-1c', launch_time: '2026-01-08T07:31:00+00:00', tags: { Name: 'staging-jump', Environment: 'staging', Owner: 'platform-team' } },
    ],
  },
  metrics: {
    status: 'ok',
    total_instances: 12,
    period_hours: 24,
    metrics: [
      { instance_id: 'i-0a91c4e7d2b5f3180', cpu_average: 61.4, cpu_max: 88.2, data_points: 288 },
      { instance_id: 'i-04f2b8a1c9e7d6032', cpu_average: 58.9, cpu_max: 84.7, data_points: 288 },
      { instance_id: 'i-07c5d3e2f8a1b4960', cpu_average: 12.6, cpu_max: 31.5, data_points: 288 },
      { instance_id: 'i-0e6f1a9d4b7c2808', cpu_average: 44.1, cpu_max: 71.3, data_points: 288 },
    ],
  },
  costs: {
    status: 'ok',
    period: 'monthly',
    total_cost: 4281.36,
    currency: 'USD',
    start: '2026-10-01',
    end: '2026-10-24',
    end_inclusive: '2026-10-24',
    services: [
      { service: 'Amazon Elastic Compute Cloud', cost: 1902.44 },
      { service: 'Amazon Simple Storage Service', cost: 684.1 },
      { service: 'Amazon Relational Database Service', cost: 512.3 },
      { service: 'AWS Lambda', cost: 188.92 },
      { service: 'Amazon CloudWatch', cost: 97.14 },
      { service: 'Amazon Virtual Private Cloud', cost: 63.2 },
    ],
  },
  // The rolling-30-day window carries its own grouped services: Cost Explorer
  // returns a service breakdown for every period, so the tab must render a
  // real chart rather than the empty frame.
  dailyCosts: { status: 'ok', period: 'daily', total_cost: 3896.05, currency: 'USD', start: '2026-09-25', end: '2026-10-24', end_inclusive: '2026-10-24', services: [
    { service: 'Amazon Elastic Compute Cloud', cost: 1644.68 },
    { service: 'Amazon Simple Storage Service', cost: 597.44 },
    { service: 'Amazon Relational Database Service', cost: 461.20 },
    { service: 'AWS Lambda', cost: 174.31 },
    { service: 'Amazon CloudWatch', cost: 88.62 },
    { service: 'Amazon Virtual Private Cloud', cost: 57.18 },
    { service: 'Amazon DynamoDB', cost: 51.40 },
    { service: 'AWS Key Management Service', cost: 24.05 },
  ] },
  forecast: { available: true, mean: 4612.88, currency: 'USD', period: 'MONTHLY' },
  insights: {
    status: 'ok',
    metrics_status: 'ok',
    total_findings: 5,
    by_severity: { high: 1, medium: 3, low: 1 },
    explanation: 'Five findings from the deterministic engine. One high-severity finding estimates the largest saving; the remainder are tagging and scheduling hygiene. Review each before acting: the engine proposes, it does not apply.',
    findings: [
      {
        resource_id: 'i-07c5d3e2f8a1b4960',
        resource_type: 'EC2',
        severity: 'high',
        issue: 'Underutilized instance, 24h CPU average 12.6%',
        recommendation: 'Review with the owning team and consider downsizing to c7g.large during the next maintenance window.',
        estimated_monthly_savings: 84.2,
        tags: { Name: 'search-worker', Environment: 'production', Owner: 'discovery-team' },
        evidence: ['Average CPUUtilization is 12.6% over the last 24 hours (288 datapoints).', 'Instance type c7g.xlarge is provisioned for sustained high utilization.'],
      },
      {
        resource_id: 'i-0d18e7b4a2c9f5035',
        resource_type: 'EC2',
        severity: 'medium',
        issue: 'Stopped instance with no recent activity',
        recommendation: 'Confirm the reporting-batch workload is retired, then schedule termination with the owning team.',
        estimated_monthly_savings: 31.0,
        tags: { Name: 'reporting-batch', Environment: 'staging' },
        evidence: ['Instance state is stopped.', 'No CloudWatch datapoints returned in the last 24 hours.'],
      },
      {
        resource_id: 'i-0f34b7c2e5a8d1976',
        resource_type: 'EC2',
        severity: 'medium',
        issue: 'Missing ownership tag',
        recommendation: 'Assign an Owner tag so the resource has a responsible team.',
        estimated_monthly_savings: 0,
        tags: { Name: 'staging-jump', Environment: 'staging', Owner: 'platform-team' },
        evidence: ['No Owner tag present on the resource.'],
      },
      {
        resource_id: 'i-04f2b8a1c9e7d6032',
        resource_type: 'EC2',
        severity: 'low',
        issue: 'Untagged resource discovered',
        recommendation: 'Add Environment and Owner tags to keep the inventory governable.',
        estimated_monthly_savings: 0,
        tags: {},
        evidence: ['Resource carries no tags.'],
      },
    ],
  },
}
