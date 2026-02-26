# Apollo Vision Prototype

An interactive React prototype for Apollo.io's future product vision, demonstrating the full onboarding-to-engagement loop for a sales engagement platform.

## What this is

A clickthrough prototype built for stakeholder review and user testing. It covers:

- **Onboarding flow** — Sign up, email verification, animated build screen, company knowledge base setup, and target audience configuration
- **Core prospecting loop** — People search with filters, contact review, save to list, sequence picker, and enrollment confirmation
- **Engagement & coaching** — Triage queue for replies/opens/bounces, meeting booked confirmation, sequence diagnostics with root cause analysis, and a weekly scorecard dashboard
- **Feedback annotation system** — Press `c` anywhere to capture screen regions, add notes, and save feedback for iterative review

## Tech stack

- React 19 + TypeScript
- Vite 7 (dev server + build)
- React Router v7 (client-side routing)
- CSS custom properties (no CSS framework)
- No state management beyond React Context

## Getting started

```bash
# Requires Node 18+
npm install
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  components/
    shared/      # Button, Input, Avatar, Tag, Badge, Icons, Tabs
    system/      # Layout, Sidebar, Topbar, FlowBar, FeedbackOverlay
    transient/   # Modal, Drawer, Popover
  contexts/      # UserContext, FlowContext, PrototypeContext
  data/          # Mock data (contacts, metrics, triage items)
  pages/
    onboarding/  # SignUp, Verified, BuildAnimation, KnowledgeBase, TargetAudience
    main/        # Search, ReviewContacts, SaveToList, SequencePicker,
                 # EnrollConfirm, TriageQueue, MeetingBooked, Diagnostic,
                 # ScorecardHome
  tokens/        # Design system tokens (colors, spacing, typography, radii)
feedback/        # Collected annotations and screenshots
```

## Design system

- **Fonts**: Founders Grotesk (display/titles), ABC Diatype (body/captions)
- **Spacing**: 4px / 8px / 16px / 24px grid
- **Border radii**: 0 / 4 / 8 / 12 / 9999px with nesting step-down rule
- **Colors**: Warm off-white backgrounds (#F7F5F0), dark primary actions (#1F2937), green accent (#22C55E)

## Feedback system

Press **`c`** on any screen to open the feedback overlay:

1. Click **Capture region** to screenshot part of the screen
2. Add text notes describing the feedback
3. Hit **Save** (or Cmd+Enter) — saves to `feedback/feedback-log.md` with screenshots

To process collected feedback in Claude Code, say "review feedback" or "process feedback".

## Flow navigation

A persistent flow bar at the bottom of the screen allows jumping between any screen in the prototype sequence for demo purposes.
