export const funnelData = {
  '7d': {
    you: { sent: 48, opened: 12, replied: 4, meetings: 1 },
    industry: { sent: 48, opened: 19, replied: 6, meetings: 2 },
    previous: { sent: 36, opened: 8, replied: 2, meetings: 0 },
  },
  '30d': {
    you: { sent: 192, opened: 52, replied: 14, meetings: 4 },
    industry: { sent: 192, opened: 77, replied: 23, meetings: 8 },
    previous: { sent: 155, opened: 38, replied: 9, meetings: 2 },
  },
  'all': {
    you: { sent: 840, opened: 235, replied: 58, meetings: 16 },
    industry: { sent: 840, opened: 336, replied: 101, meetings: 34 },
    previous: { sent: 680, opened: 170, replied: 41, meetings: 9 },
  },
}

export type FunnelPeriod = keyof typeof funnelData
export type FunnelSource = keyof typeof funnelData['7d']

export const weeklyScorecard = {
  funnel: {
    sent: 48,
    opened: 12,
    replied: 4,
    meetings: 1,
  },
  metrics: {
    replyRate: '8%',
    meetingsBooked: 1,
    creditsUsed: 22,
  },
  coaching: {
    whatWorked: [
      'Subject lines under 6 words had 2x open rate',
      'Tuesday AM sends outperformed other slots',
      'Pain-signal personalization drove 3 of 4 replies',
    ],
    whatToChange: [
      { text: 'Narrow ICP filter — 60% of non-replies were poor fit', action: 'Edit filters', route: '/search' },
      { text: 'Rewrite Step 3 — lowest engagement in the sequence', action: 'Edit sequence', route: '/sequences' },
      { text: 'Add a phone touchpoint for high-fit contacts', action: 'Add step', route: '/sequences' },
    ],
    savedSearch: 'Radiation Oncology — VP Ops — 50-500 employees',
    doThisNext: 'Re-run your saved search to find 15 new prospects',
  },
}

export const triageItems = [
  {
    id: 1,
    type: 'reply' as const,
    contact: 'Jane Smith',
    company: 'Acme Corp',
    title: 'VP of Operations',
    sequenceStep: 'Step 2 — Follow-up',
    preview: 'Hi Aaron, thanks for reaching out. I\'d be interested in learning more about how Fuse Oncology could help streamline our workflows. Could we set up a call next week?',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'open' as const,
    contact: 'Marcus Chen',
    company: 'Novalis Health',
    title: 'Director of IT',
    sequenceStep: 'Step 1 — Initial outreach',
    preview: 'Opened your email 3 times in the last 24 hours',
    time: '6 hours ago',
  },
  {
    id: 3,
    type: 'bounce' as const,
    contact: 'Sarah Kim',
    company: 'Elekta Systems',
    title: 'Chief Medical Officer',
    sequenceStep: 'Step 1 — Initial outreach',
    preview: 'Email bounced — address may be outdated',
    time: '1 day ago',
  },
]
