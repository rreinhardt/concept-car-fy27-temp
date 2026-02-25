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
      'Narrow ICP filter — 60% of non-replies were poor fit',
      'Rewrite Step 3 — lowest engagement in the sequence',
      'Add a phone touchpoint for high-fit contacts',
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
