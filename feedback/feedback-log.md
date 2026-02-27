# Prototype Feedback Log

Feedback items collected during prototype review sessions.

---

## fb-2026-02-26T03-44-54-049Z
- **Date:** 2/25/2026, 7:44:54 PM
- **URL:** `/search`
- **Status:** resolved
- **Resolution:** Fixed layout to use `height: 100vh` + `overflow: hidden` on layout shell. Table header sticky, pagination pinned to bottom, only table body scrolls.
- **Screenshot:** ![](screenshots/fb-2026-02-26T03-44-54-049Z.png)
### Notes
this should be fixed to the bottom, and the table inner contents should be the scroll view. the header area should be fixed in the origin position
---## fb-2026-02-26T04-04-45-056Z
- **Date:** 2/25/2026, 8:04:45 PM
- **URL:** `/diagnostic`
- **Status:** resolved
- **Resolution:** Switched to two-column grid layout pairing each root cause with its recommended fix. Removed narrow max-width constraint.
- **Screenshot:** ![](screenshots/fb-2026-02-26T04-04-45-056Z.png)
### Notes
redo the inner layour of the white area so that it fits better this kind of wide viewport. fixes dont need to be all the way down there. the root cause analysis items should be directly tied to the fixes, so use that in your redo.
---## fb-2026-02-26T04-12-14-853Z
- **Date:** 2/25/2026, 8:12:14 PM
- **URL:** `/home`
- **Status:** resolved
- **Resolution:** Redesigned as full-width dashboard grid — funnel + stacked metrics top row, coaching 2-col middle, CTA full-width bottom.
- **Screenshot:** ![](screenshots/fb-2026-02-26T04-12-14-853Z.png)
### Notes
i dont like how this card is so far on the left. can we come up with a more responsive design? more grid/dashboard? i like the scorecard idea just want it to scale out.
---## fb-2026-02-26T04-16-24-611Z
- **Date:** 2/25/2026, 8:16:24 PM
- **URL:** `/home`
- **Status:** resolved
- **Resolution:** Added time range toggles, industry/historical benchmark overlays, and conversion rates to funnel chart.
- **Screenshot:** ![](screenshots/fb-2026-02-26T04-16-24-611Z.png)
### Notes
this is kind of a boring chart, and lots of white space, there is no benchmarking against historical or my-industry standards... could we have interactivity here. add toggles/comparisons, take up more space. keep it still minimal design tho so be smart about it.
---## fb-2026-02-26T17-13-21-754Z
- **Date:** 2/26/2026, 9:13:21 AM
- **URL:** `/search`
- **Status:** resolved
- **Resolution:** Changed Enroll button in bulk action bar to navigate to `/sequences` (sequence picker) instead of `/enroll`.
- **Screenshot:** ![](screenshots/fb-2026-02-26T17-13-21-754Z.png)
### Notes
This Enroll button should take the user to the sequence picker page instead of directly into the sequence editor page.
---## fb-2026-02-26T18-23-42-749Z
- **Date:** 2/26/2026, 10:23:42 AM
- **URL:** `/knowledge-base`
- **Status:** resolved
- **Resolution:** Changed company logo size from 40px to `var(--avatar-lg)` (48px) to match the person avatar circle.
- **Screenshot:** ![](screenshots/fb-2026-02-26T18-23-42-749Z.png)
### Notes
Fix the alignment of the circle and the round rect for the person and company so that they are the same size.
---## fb-2026-02-26T20-22-46-993Z
- **Date:** 2/26/2026, 12:22:46 PM
- **URL:** `/search`
- **Status:** resolved
- **Resolution:** Removed duplicative "1 - 25 of 126,222" count from the sidebar filters. Pagination info remains in the table footer only.
- **Screenshot:** ![](screenshots/fb-2026-02-26T20-22-46-993Z.png)
### Notes
get rid of the duplicative count on the table that is outside it
---