# Prototype Feedback — Claude Processing Instructions

## Overview

This directory contains feedback collected during prototype review sessions. Each item includes annotated notes, optional screenshots, and the URL/route where the feedback was captured.

## How to process feedback

When asked to review and address feedback, follow these steps:

### 1. Read all feedback
- Read `feedback-log.md` to get all pending feedback items
- Review any referenced screenshots in `screenshots/` to understand visual context
- Each item has a unique ID (`fb-YYYY-MM-DDTHH-MM-SS-SSSZ`), a URL, status, optional screenshot, and notes

### 2. Triage and plan
- Group related feedback items (e.g. multiple items about the same page/component)
- Prioritize by impact: layout/interaction bugs > visual polish > copy changes
- Present the plan to the user as a numbered list, mapping each feedback item ID to the proposed change
- Wait for user confirmation before proceeding

### 3. Address each item
- Work through the confirmed plan item by item
- After completing each change, tell the user which feedback ID was addressed and what was changed
- Ask the user to confirm the fix looks correct before marking it done

### 4. Mark items as resolved
- After user confirms a fix, update `feedback-log.md` by changing that item's status from `pending` to `resolved`
- Add a brief resolution note under the item, e.g. `- **Resolution:** Adjusted border-radius on card component`

### 5. Cleanup
- Once all items are resolved, let the user know the feedback queue is clear
- Do NOT delete resolved items — they serve as a changelog

## File structure

```
feedback/
├── FEEDBACK_INSTRUCTIONS.md    ← You are here
├── feedback-log.md             ← Append-only log of all feedback items
└── screenshots/                ← PNG captures referenced by feedback items
    └── fb-*.png
```

## Feedback item format

Each entry in `feedback-log.md` looks like:

```markdown
## fb-2026-02-25T14-30-00-000Z
- **Date:** 2/25/2026, 2:30:00 PM
- **URL:** `/search`
- **Status:** pending
- **Screenshot:** ![](screenshots/fb-2026-02-25T14-30-00-000Z.png)

### Notes
The table header alignment is off — should be left-aligned not centered.

---
```

## Quick start command

When the user says something like "review feedback" or "process feedback", run:

1. `Read feedback/feedback-log.md`
2. For each item with `Status: pending`, read the screenshot if referenced
3. Present the triage plan
4. Execute after confirmation
