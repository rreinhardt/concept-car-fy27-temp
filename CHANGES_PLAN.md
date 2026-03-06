# Prototype Changes — Master Plan

Based on feedback document "Prototype Changes (2).pdf". Each item is a self-contained project. Status tracks planning, staging, and implementation.

---

## 1. Nav Change
**Status:** IN PROGRESS — pending review
**Scope:** Sidebar restructure
**Files:** `Sidebar.tsx`, `Sidebar.css`, `Icons.tsx`

### What to do
Restructure the sidebar nav to match the reference image from the PDF:

**Top section (always visible):**
- Home (existing)
- Assistant (new — needs icon, no route yet, placeholder)
- Tasks (new — needs icon, route: `/tasks`)
- Workflows (new — placeholder)
- Analytics (move from bottom)

**"Prospect & manage records" section:**
- Prospect (collapsible):
  - Find people (existing People → rename, route: `/search`)
  - Find companies (new — placeholder)
- Saved Lists (collapsible):
  - People (placeholder)
  - Companies (placeholder)
  - Deals (placeholder)
- Data enrichment (placeholder)

**"Engage" section:**
- Sequences (existing)
- Emails (placeholder)
- Dialer (placeholder)
- Meetings (placeholder)
- Conversations (placeholder)

**"Recents" section:**
- Empty placeholder area

**Bottom section:**
- Settings (placeholder)
- User: "David Moon" with avatar + chevron (use current user context name instead)

**Collapsed "more" accordion:**
Items that aren't wired into the prototype (Workflows, Data enrichment, Emails, Dialer, Meetings, Conversations, Saved Lists sub-items) go behind a collapsed accordion so the user can see them but the nav stays clean.

### New icons needed
- IconAssistant (sparkle variant or chat bubble)
- IconTasks (checkmark circle — can reuse IconCheck in a circle)
- IconWorkflows (lightning/flow)
- IconSettings (gear)
- IconDialer (phone)
- IconMeetings (calendar)
- IconConversations (chat bubble)
- IconDataEnrich (atom/refresh)
- IconSavedLists (bookmark)
- IconDeals (dollar)

---

## 2. Deliverability / Trust Before Activation
**Status:** PLANNED — needs proposal review
**Scope:** New onboarding step + pre-activation gate
**Files:** New page(s), `App.tsx` routes, possibly `EnrollConfirmPage.tsx`

### Problem
No visibility into sender health or inbox readiness before activating a sequence. No pre-flight checks. Users need trust signals before activation.

### Proposed solution

**A) Onboarding addition — "Connect & verify your email" step:**
- New page after TargetAudience, before the main app
- Route: `/email-setup`
- Shows: Connect email account (Google/Microsoft OAuth buttons)
- After connecting: inbox health check card showing:
  - Inbox connection status (green check)
  - Daily send limit (e.g., "50/day recommended for new accounts")
  - Bounce likelihood: Low/Medium/High
  - Duplicate contact detection status
  - "Safe to send" confidence indicator

**B) Pre-activation gate on EnrollConfirmPage:**
- Before "Activate" button works, show a pre-flight checklist drawer/modal:
  - Inbox health: Connected & healthy
  - Send limit: X/day (within safe range)
  - Contacts validated: No duplicates, no invalid emails
  - Bounce risk: Low
- All green → "Activate" enabled
- Any yellow/red → warning with recommended actions

### Files to create
- `src/pages/onboarding/EmailSetupPage.tsx` + `.css`
- Modify `EnrollConfirmPage.tsx` to add pre-flight check

---

## 3. Non-AI Sequence Step Editing
**Status:** PLANNED — needs proposal review
**Scope:** Sequence editor enhancements
**Files:** `EnrollConfirmPage.tsx`, `EnrollConfirmPage.css`

### Problem
The sequence editor is too AI-first. No clear manual/non-AI path. Need to support:
- AI-generated sequences
- Template-based sequences
- Manual from scratch
- Only ~5% of users use AI sequences; ~50% lower retention than manual

### Proposed changes

**A) On SequencePickerPage — add explicit creation modes:**
- "Create new sequence" button opens a choice modal:
  - "AI-generated" — describe goal, AI builds it (current flow)
  - "Start from template" — browse template library
  - "Build from scratch" — blank sequence editor

**B) On EnrollConfirmPage — make steps directly editable:**
- Each step's subject line becomes an inline editable text field
- Each step's body becomes a rich-ish textarea (not AI-only)
- Add a toolbar above each step body: Bold, Italic, Link, Variable insertion
- "Refine with AI" button becomes optional (not the primary action)
- Add "Write manually" as the default mode, "AI assist" as secondary
- Step format selector: Email / Phone / LinkedIn / Manual task
- Remove length slider (replace with character count)

---

## 4. Search Liveness — Make People Search Feel Dynamic
**Status:** IN PROGRESS — pending review
**Scope:** Search table enhancements
**Files:** `SearchPage.tsx`, `SearchPage.css`, `mockContacts.ts`

### Problem
Search feels like a static database query, not an evolving intelligence layer.

### What to add
- **Intent signal badges** on contacts: "Hiring", "Funding", "Tech change" — small colored pills next to name
- **"Updated X mins ago"** timestamp on some rows
- **"Trending in your industry"** label on 2-3 top contacts
- **Ranking explanation badges**: "High ICP fit", "Recent activity" — shown in a new column or as a tooltip
- **Remove Qualify column** (item #12) — replace with a "Signals" column showing intent/freshness indicators

### Mock data changes
Add to each contact: `signals: string[]`, `updatedAgo?: string`, `trending?: boolean`

---

## 5. Execution Flow — Tasks Page + Blockers
**Status:** IN PROGRESS — pending review
**Scope:** New Tasks page + execution improvements
**Files:** New `TasksPage.tsx` + `.css`, `App.tsx`, `Sidebar.tsx`

### Problem
No visibility into what's high priority, why something is prioritized, what to do next. No handling of stalled states (inbox limit, invalid phone, no remaining tasks).

### Proposed Tasks page
- Route: `/tasks`
- Layout: Single page with prioritized task list
- Each task card shows:
  - Clear "Next Best Action" label for top task
  - Priority reasoning (e.g., "Reply within 2hrs for 3x meeting rate")
  - Task type badge: Reply, Follow-up, Call, Review
  - Contact + company info
  - Action buttons (primary action + skip)

### Blocker handling
- Inline blocker cards in the task list:
  - "Inbox limit reached — here's what to do" (with link to settings)
  - "5 contacts invalid — clean up?" (with action button)
  - Alternate recommended actions when blocked

---

## 6. Credit Consumption
**Status:** ASK — needs direction
**Question:** How should credit consumption be represented? Options:
- Credit meter in topbar/sidebar
- Credits page showing usage breakdown
- Credit warnings on actions that consume credits
- Credit balance on scorecard dashboard
- All of the above?

---

## 7. Waterfall Logic & Enrichments
**Status:** ASK — needs direction
**Question:** How should waterfall enrichment be represented? Options:
- Visual flow diagram showing data source waterfall (e.g., try source A → fall back to B → C)
- Enrichment status badges on contacts (enriched vs pending vs failed)
- Enrichment settings page
- Enrichment step in onboarding
- Inline enrichment triggers on contact detail views

---

## 8. One-off Email Path
**Status:** ASK — needs direction
**Question:** How should one-off emails be added? Options:
- "Send email" action on individual contacts (in search, triage, or contact detail)
- Compose email modal/drawer accessible from anywhere
- Email composer page (route: `/compose`)
- Quick action in topbar or assistant panel

---

## 9. Monetization Paths
**Status:** ASK — needs direction
**Initial thinking:** Filter upgrades + nav item upgrades
**Question:** How to represent this? Options:
- Locked filter sections with "Upgrade" badges
- Locked nav items with premium indicators
- Usage-triggered upgrade prompts
- Pricing/plan comparison modal
- Credit purchase flow
- Combination approach?

---

## 10. Saved View vs Saved Search
**Status:** ASK — needs direction
**Question:** How should the distinction between saved views and saved searches be represented? Options:
- Saved Views = layout/column config, Saved Searches = filter criteria
- Unified concept with different save options
- Dropdown selector at top of search page
- Sidebar section showing both
- Tab approach (Views | Searches)

---

## 11. Assistant Panel
**Status:** ASK — needs direction
**Question:** How should the assistant panel work across pages? Options:
- Slide-out drawer from the right (like current drawer pattern)
- Toggled via topbar "Assistant" button
- Always-visible chat panel on right side
- Floating chat bubble
- Full-page assistant route
- Context-aware suggestions per page

---

## 12. Remove Qualify Column from People Search
**Status:** PLANNED — ready to implement (merged into item #4)
**Files:** `SearchPage.tsx`

Remove the "Qualify" column and replace with signals/liveness indicators per item #4.

---

## Implementation Order

### Phase A — Quick wins (ready to implement now):
1. **Item 1** — Nav change
2. **Item 4 + 12** — Search liveness + remove Qualify column
3. **Item 5** — Tasks page

### Phase B — Proposals to review together:
4. **Item 2** — Deliverability flow (propose → iterate)
5. **Item 3** — Sequence editor non-AI editing (propose → iterate)

### Phase C — Need your direction:
6. **Items 6-11** — Credit consumption, waterfall, one-off email, monetization, saved views, assistant panel

---

## How to work through this

For each item, say the number (e.g., "do 1") and I'll implement it. For items marked ASK, answer the questions and I'll plan + implement. For PROPOSAL items, I'll present my plan and we iterate before I code.
