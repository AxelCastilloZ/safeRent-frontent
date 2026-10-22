export interface DisplayPrice {
  status: 'converted' | 'unchanged' | 'unavailable'
  original: { amount: string; currency: string }
  converted: { amount: string; currency: string } | null
  targetCurrency: string
  ratesUpdatedAt: string | null
  stale: boolean
  approximate: boolean
  batchId: number | null
  reason: string | null
}
