export interface Sequence {
  id: number
  name: string
  goal: 'Book meeting' | 'Nurture' | 'Reactivate'
  steps: number
  days: number
  description: string
}

export const mockSequences: Sequence[] = [
  {
    id: 1,
    name: 'Cold Outbound — Decision Makers',
    goal: 'Book meeting',
    steps: 5,
    days: 14,
    description: 'Multi-touch sequence targeting C-suite and VP-level contacts with personalized outreach focused on pain points.',
  },
  {
    id: 2,
    name: 'Warm Nurture — Recent Engagement',
    goal: 'Nurture',
    steps: 4,
    days: 21,
    description: 'Gentle follow-up sequence for contacts who have shown intent signals but haven\'t booked a meeting.',
  },
  {
    id: 3,
    name: 'Win-Back — Stale Leads',
    goal: 'Reactivate',
    steps: 3,
    days: 10,
    description: 'Re-engagement sequence for contacts who went cold after initial outreach.',
  },
  {
    id: 4,
    name: 'Event Follow-Up',
    goal: 'Book meeting',
    steps: 4,
    days: 7,
    description: 'Quick cadence for contacts met at conferences and events.',
  },
  {
    id: 5,
    name: 'Product Launch Announcement',
    goal: 'Nurture',
    steps: 3,
    days: 14,
    description: 'Share new product capabilities with existing contacts in your pipeline.',
  },
  {
    id: 6,
    name: 'Competitive Displacement',
    goal: 'Book meeting',
    steps: 5,
    days: 18,
    description: 'Target contacts using competing solutions with comparison-focused messaging.',
  },
]
