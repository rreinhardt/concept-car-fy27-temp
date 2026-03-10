import { useState, useRef, useEffect, useCallback } from "react";

const IA_SECTIONS = [
  {
    id: "home", label: "Home", color: "#7c7fba",
    desc: "Command center & onboarding hub",
    children: [
      { label: "Control Center", type: "surface", desc: "Tasks due today, open rates, alerts, recent activity" },
      { label: "Cockpit", type: "surface", desc: "Customizable KPI widgets — personalised per user" },
      { label: "Onboarding Hub", type: "surface", desc: "Guided setup tasks for new users and admins" },
    ],
  },
  {
    id: "search", label: "Search", color: "#6b8ec4",
    desc: "People & Company search — one unified surface with two views",
    children: [
      { label: "People", type: "surface", desc: "Search 275M+ contacts", children: [
        { label: "Net New / Saved / Total tabs", type: "sub", desc: "Manage new vs. already-saved records" },
        { label: "Filters panel", type: "sub", desc: "Left-hand filter bar" },
        { label: "Buying Intent filter", type: "sub", desc: "Filter by intent score & topics (Bombora / LeadSift)" },
        { label: "Lookalikes filter", type: "sub", desc: "AI filter — up to 5 seed companies" },
        { label: "Personas filter", type: "sub", desc: "Saved sets of titles/departments" },
        { label: "65+ other filters", type: "sub", desc: "Industry, headcount, tech stack, funding…" },
      ]},
      { label: "Companies", type: "surface", desc: "Account-level search", children: [
        { label: "Net New / Saved / Total tabs", type: "sub", desc: "Manage new vs. already-saved records" },
        { label: "Filters panel", type: "sub", desc: "Left-hand filter bar" },
        { label: "Buying Intent filter", type: "sub", desc: "Intent is always company-level" },
        { label: "Lookalikes filter", type: "sub", desc: "Returns similar companies" },
        { label: "AI Research (qualify)", type: "sub", desc: "AI assesses account fit" },
      ]},
      { label: "Saved Searches", type: "surface", desc: "Persist and share filter combinations" },
      { label: "Lists", type: "surface", desc: "Named lists of saved contacts/accounts" },
      { label: "Chrome Extension", type: "surface", desc: "Overlay on LinkedIn & company sites" },
      { label: "Mobile App", type: "surface", desc: "iOS/Android access" },
    ],
  },
  {
    id: "engage", label: "Engage", color: "#b8875a",
    desc: "All outreach tools",
    children: [
      { label: "Sequences", type: "surface", desc: "Multi-step automated outreach", children: [
        { label: "Steps builder", type: "sub", desc: "Email, call, LinkedIn steps, action items" },
        { label: "A/B testing", type: "sub", desc: "Test subject lines and email variants" },
        { label: "Score prioritisation", type: "sub", desc: "Score-based ordering instead of FIFO" },
      ]},
      { label: "Emails", type: "surface", desc: "Send, track and write AI-assisted emails", children: [
        { label: "Email tracking", type: "sub", desc: "Opens, clicks, replies, bounces" },
        { label: "AI writing assistant", type: "sub", desc: "AI-assisted email composition" },
        { label: "Email Warmup", type: "sub", desc: "Ramp mailbox volume gradually" },
        { label: "Templates & Snippets", type: "sub", desc: "Reusable templates and snippets" },
      ]},
      { label: "Dialer", type: "surface", desc: "Call prospects from within Apollo", children: [
        { label: "Power dialer", type: "sub", desc: "Queue-based calling" },
        { label: "Parallel dialing", type: "sub", desc: "Call multiple prospects simultaneously" },
        { label: "Call recording", type: "sub", desc: "Record and replay calls" },
      ]},
      { label: "Tasks", type: "surface", desc: "Manual to-do items" },
      { label: "Meetings", type: "surface", desc: "Scheduling and pre-meeting intelligence", children: [
        { label: "Scheduling links", type: "sub", desc: "Shareable booking links" },
        { label: "Pre-meeting insights", type: "sub", desc: "Contact/account context" },
        { label: "Calendar sync", type: "sub", desc: "Google Calendar and Outlook" },
      ]},
      { label: "Conversations", type: "surface", desc: "Call & meeting intelligence", children: [
        { label: "Transcriptions", type: "sub", desc: "Auto-transcribe calls and meetings" },
        { label: "AI Meeting Summaries", type: "sub", desc: "Auto-generated summaries" },
        { label: "Conversation Analytics", type: "sub", desc: "Talk ratios, keywords" },
        { label: "Scorecards", type: "sub", desc: "Coaching scores for reps" },
      ]},
      { label: "Analytics", type: "surface", desc: "Performance reporting", children: [
        { label: "Email Analytics", type: "sub", desc: "Open/click/reply/bounce rates" },
        { label: "Sequence Analytics", type: "sub", desc: "Drop-off, A/B results" },
        { label: "Deal Analytics", type: "sub", desc: "Pipeline funnel, revenue trends" },
        { label: "Dashboards & Goals", type: "sub", desc: "Custom dashboards" },
      ]},
    ],
  },
  {
    id: "workflows", label: "Workflows", color: "#9b82c0",
    desc: "Automation engine",
    children: [
      { label: "Workflow Builder", type: "surface", desc: "Visual trigger → condition → action canvas", children: [
        { label: "Triggers", type: "sub", desc: "Form abandon, job change, intent signal…" },
        { label: "Actions", type: "sub", desc: "Enrich, push to CRM, run AI research…" },
        { label: "Credit Controls", type: "sub", desc: "Per-run and lifetime credit limits" },
      ]},
      { label: "Plays", type: "surface", desc: "Pre-built automation templates" },
    ],
  },
  {
    id: "enrich", label: "Enrich", color: "#5a94b0",
    desc: "Data enrichment and hygiene",
    children: [
      { label: "Data Health Center", type: "surface", desc: "Monitor data quality across all records" },
      { label: "CRM Enrichment", type: "surface", desc: "Enrich Salesforce or HubSpot records", children: [
        { label: "Field mapping", type: "sub", desc: "Grouped display of enrichable fields" },
        { label: "Enrichment history", type: "sub", desc: "View history per contact/account" },
      ]},
      { label: "CSV Enrichment", type: "surface", desc: "Upload CSV; Apollo fills missing fields" },
      { label: "API Enrichment", type: "surface", desc: "Programmatic enrichment via Apollo API" },
      { label: "Waterfall Enrichment", type: "surface", desc: "Cascade across multiple data providers" },
      { label: "Form Enrichment", type: "surface", desc: "Enrich web form submissions in real time" },
    ],
  },
  {
    id: "deals", label: "Deals", color: "#b07070",
    desc: "Pipeline and deal management",
    children: [
      { label: "Pipeline View", type: "surface", desc: "Kanban / list view of deals by stage" },
      { label: "Deal Record", type: "surface", desc: "Full deal detail: contacts, activities, notes", children: [
        { label: "File Attachments", type: "sub", desc: "Upload docs/images/videos" },
        { label: "Follow-up Widget", type: "sub", desc: "At-risk deals, inactivity warnings" },
        { label: "Deal Automation", type: "sub", desc: "Auto-update deal stages" },
      ]},
    ],
  },
  {
    id: "settings", label: "Settings", color: "#8a9099",
    desc: "Account config, ICP, team, billing",
    children: [
      { label: "Ideal Customer Profile", type: "surface", desc: "Define ICP; configure Buying Intent topics", children: [
        { label: "Buying Intent topics config", type: "sub", desc: "14,000+ Bombora or 1,600+ LeadSift topics" },
      ]},
      { label: "Domain & Email Setup", type: "surface", desc: "Tracking subdomain, mailbox linking" },
      { label: "User Management", type: "surface", desc: "Invite/manage team members, roles" },
      { label: "Billing & Credits", type: "surface", desc: "Plan management, credit usage" },
      { label: "Integrations", type: "surface", desc: "Salesforce, HubSpot, Zapier, Gmail…" },
      { label: "API Keys", type: "surface", desc: "Generate and manage API keys" },
      { label: "Security & Privacy", type: "surface", desc: "Login alerts, 2FA, GDPR" },
    ],
  },
];

const TYPE_CONFIG = {
  surface: { label: "Surface",     bg: "#e8ede4", color: "#3a5a2a", dot: "#5a8a3a" },
  sub:     { label: "Sub-feature", bg: "#e8e8f0", color: "#2a2a5a", dot: "#5a5aaa" },
};

function Pill({ type }: { type: string }) {
  const c = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.sub;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: c.bg, color: c.color, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.03em", whiteSpace: "nowrap", flexShrink: 0 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {c.label}
    </span>
  );
}

// ─── LIST VIEW ──────────────────────────────────────────────────────────────
function SurfaceCard({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  const hasSubs = item.children?.length > 0;
  return (
    <div style={{ background: "#fff", border: "1px solid #e0ddd6", borderRadius: 8, overflow: "hidden" }}>
      <div onClick={() => hasSubs && setOpen((v: boolean) => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", cursor: hasSubs ? "pointer" : "default" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a14" }}>{item.label}</span>
            <Pill type="surface" />
          </div>
          <div style={{ fontSize: 12, color: "#7a7060", lineHeight: 1.6 }}>{item.desc}</div>
        </div>
        {hasSubs && <span style={{ fontSize: 11, color: "#9a9080", paddingTop: 2, flexShrink: 0 }}>{item.children.length} sub {open ? "▴" : "▾"}</span>}
      </div>
      {open && hasSubs && (
        <div style={{ borderTop: "1px solid #ede9e0" }}>
          {item.children.map((sub: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 20px 12px 36px", borderBottom: i < item.children.length - 1 ? "1px solid #f0ece3" : "none", background: "#faf9f6" }}>
              <div style={{ flexShrink: 0, width: 12, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                <div style={{ width: 1, flex: 1, background: "#d0ccc0", minHeight: 10 }} />
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c0bbb0", flexShrink: 0 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#2a2a20" }}>{sub.label}</span>
                  <Pill type="sub" />
                </div>
                <div style={{ fontSize: 11, color: "#8a8070", lineHeight: 1.6 }}>{sub.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListView({ section, filter }: { section: any; filter: { val: string; set: (v: string) => void } }) {
  const all = section.children;
  const surfaces = all.filter((c: any) => c.type === "surface");
  const subCount = surfaces.reduce((a: number, s: any) => a + (s.children?.length ?? 0), 0);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px 80px" }}>
      <div style={{ fontSize: 11, color: "#9a9080", marginBottom: 12 }}>Apollo.io / {section.label}</div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a14", margin: "0 0 6px", letterSpacing: "-0.02em" }}>{section.label}</h1>
      <p style={{ fontSize: 13, color: "#7a7060", margin: "0 0 24px", lineHeight: 1.6 }}>{section.desc}</p>
      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #d8d4cc", marginBottom: 24 }}>
        {[{ key: "all", label: "All", count: surfaces.length }, { key: "surface", label: "Surfaces", count: surfaces.length }, { key: "sub", label: "Sub-features", count: subCount }].map(tab => (
          <button key={tab.key} onClick={() => filter.set(tab.key)} style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: filter.val === tab.key ? 600 : 400, color: filter.val === tab.key ? "#1a1a14" : "#9a9080", borderBottom: filter.val === tab.key ? "2px solid #1a1a14" : "2px solid transparent", marginBottom: -1 }}>
            {tab.label}<span style={{ marginLeft: 6, fontSize: 11, color: "#b0aa9a" }}>{tab.count}</span>
          </button>
        ))}
      </div>
      {filter.val !== "sub" && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{surfaces.map((item: any, i: number) => <SurfaceCard key={i} item={item} />)}</div>}
      {filter.val === "sub" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {surfaces.filter((s: any) => s.children?.length).map((parent: any, pi: number) => (
            <div key={pi}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a14" }}>{parent.label}</span>
                <Pill type="surface" />
              </div>
              <div style={{ background: "#fff", border: "1px solid #e0ddd6", borderRadius: 8, overflow: "hidden" }}>
                {parent.children.map((sub: any, si: number) => (
                  <div key={si} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 20px", borderBottom: si < parent.children.length - 1 ? "1px solid #f0ece3" : "none" }}>
                    <div style={{ flexShrink: 0, width: 14, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 5 }}>
                      <div style={{ width: 1, height: 6, background: "#d0ccc0" }} /><div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c0bbb0" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#2a2a20" }}>{sub.label}</span><Pill type="sub" />
                      </div>
                      <div style={{ fontSize: 11, color: "#8a8070", lineHeight: 1.6 }}>{sub.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TREE VIEW ──────────────────────────────────────────────────────────────
function TreeNode({ node, depth = 0 }: { node: any; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasSubs = node.children?.length > 0;
  const INDENT = 28;
  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => hasSubs && setOpen((v: boolean) => !v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", marginLeft: depth * INDENT, cursor: hasSubs ? "pointer" : "default", userSelect: "none" }}>
        <div style={{ width: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {hasSubs ? <span style={{ fontSize: 9, color: "#9a9080", fontWeight: 700 }}>{open ? "▾" : "▸"}</span> : <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#d0ccc0", display: "inline-block" }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: node.type === "surface" ? "#fff" : "#faf9f6", border: `1px solid ${node.type === "surface" ? "#d8d4cc" : "#ece8e0"}`, borderRadius: 6, padding: node.type === "surface" ? "8px 14px" : "6px 12px", flex: 1, boxShadow: node.type === "surface" ? "0 1px 3px rgba(0,0,0,0.04)" : "none" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: node.type === "surface" ? 13 : 12, fontWeight: node.type === "surface" ? 600 : 400, color: "#1a1a14" }}>{node.label}</span>
              <Pill type={node.type || "sub"} />
            </div>
            {node.desc && <div style={{ fontSize: 11, color: "#9a9080", marginTop: 2 }}>{node.desc}</div>}
          </div>
          {hasSubs && (
            <span style={{ fontSize: 10, fontWeight: 500, background: "#f0ece3", color: "#8a8070", padding: "1px 8px", borderRadius: 20, marginLeft: 8, whiteSpace: "nowrap", flexShrink: 0 }}>
              {node.children.length} {node.type === "surface" ? "sub-features" : "surfaces"}
            </span>
          )}
        </div>
      </div>
      {open && hasSubs && (
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: depth * INDENT + 8, top: 0, bottom: 0, width: 1, background: "#e0ddd6" }} />
          {node.children.map((child: any, i: number) => <TreeNode key={i} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

function TreeView({ section }: { section: any }) {
  const [key, setKey] = useState(0);
  const [exp, setExp] = useState(false);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px 80px" }}>
      <div style={{ fontSize: 11, color: "#9a9080", marginBottom: 12 }}>Apollo.io / {section.label}</div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a14", margin: 0, letterSpacing: "-0.02em" }}>{section.label}</h1>
        <button onClick={() => { setExp((v: boolean) => !v); setKey((k: number) => k + 1); }} style={{ fontSize: 12, color: "#7a7060", background: "none", border: "1px solid #d8d4cc", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>{exp ? "Collapse all" : "Expand all"}</button>
      </div>
      <p style={{ fontSize: 13, color: "#7a7060", margin: "0 0 24px", lineHeight: 1.6 }}>{section.desc}</p>
      <div key={key}>{section.children.map((n: any, i: number) => <TreeNode key={i} node={n} depth={0} />)}</div>
    </div>
  );
}

// ─── CANVAS VIEW ─────────────────────────────────────────────────────────────
const ROOT_W = 110, ROOT_H = 44, MOD_W = 148, MOD_H = 48, SURF_W = 148, SURF_H = 44, SUB_W = 156, SUB_H = 40;
const COL_GAP = 72, V_GAP_MOD = 20, V_GAP_SURF = 12, V_GAP_SUB = 8;

function bezierPath(x1: number, y1: number, x2: number, y2: number) { const cx = (x1 + x2) / 2; return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`; }

function surfSlotHeight(sf: any, sfId: string, openSurfaces: Set<string>) {
  const isOpen = openSurfaces.has(sfId);
  if (!isOpen || !sf.children?.length) return SURF_H;
  const subBlockH = sf.children.length * (SUB_H + V_GAP_SUB) - V_GAP_SUB;
  return Math.max(SURF_H, subBlockH);
}

function buildGraph(openModules: Set<string>, openSurfaces: Set<string>) {
  const nodes: any[] = [], edges: any[] = [];
  const modX = ROOT_W + COL_GAP;

  const modHeights = IA_SECTIONS.map(s => {
    if (!openModules.has(s.id)) return MOD_H;
    const surfs = s.children.filter((c: any) => c.type === "surface");
    if (!surfs.length) return MOD_H;
    const totalSurfH = surfs.reduce((acc: number, sf: any, i: number) => {
      const sfId = `${s.id}__${sf.label}`;
      return acc + surfSlotHeight(sf, sfId, openSurfaces) + (i < surfs.length - 1 ? V_GAP_SURF : 0);
    }, 0);
    return Math.max(MOD_H, totalSurfH);
  });

  const totalH = modHeights.reduce((a: number, h: number) => a + h, 0) + (IA_SECTIONS.length - 1) * V_GAP_MOD;
  const rootY = totalH / 2 - ROOT_H / 2;
  nodes.push({ id: "__root__", label: "Apollo.io", type: "root", x: 0, y: rootY, w: ROOT_W, h: ROOT_H });

  let curY = 0;
  IA_SECTIONS.forEach((s, si) => {
    const mh = modHeights[si];
    const my = curY + mh / 2 - MOD_H / 2;
    const surfs = s.children.filter((c: any) => c.type === "surface");
    nodes.push({ id: s.id, label: s.label, type: "module", color: s.color, x: modX, y: my, w: MOD_W, h: MOD_H, isOpen: openModules.has(s.id), childCount: surfs.length });
    edges.push({ id: `r-${s.id}`, x1: ROOT_W, y1: rootY + ROOT_H / 2, x2: modX, y2: my + MOD_H / 2, color: s.color });

    if (openModules.has(s.id)) {
      const surfX = modX + MOD_W + COL_GAP;
      let sfY = curY;
      surfs.forEach((sf: any) => {
        const sfId = `${s.id}__${sf.label}`;
        const isOpen = openSurfaces.has(sfId);
        const slot = surfSlotHeight(sf, sfId, openSurfaces);
        const sfNodeY = sfY + slot / 2 - SURF_H / 2;

        nodes.push({ id: sfId, label: sf.label, type: "surface", color: s.color, x: surfX, y: sfNodeY, w: SURF_W, h: SURF_H, desc: sf.desc, isOpen, childCount: sf.children?.length || 0 });
        edges.push({ id: `${s.id}-${sfId}`, x1: modX + MOD_W, y1: my + MOD_H / 2, x2: surfX, y2: sfNodeY + SURF_H / 2, color: s.color });

        if (isOpen && sf.children?.length) {
          const subX = surfX + SURF_W + COL_GAP;
          const subBlockH = sf.children.length * (SUB_H + V_GAP_SUB) - V_GAP_SUB;
          let subY = sfNodeY + SURF_H / 2 - subBlockH / 2;
          sf.children.forEach((sub: any, subi: number) => {
            const subId = `${sfId}__${subi}`;
            nodes.push({ id: subId, label: sub.label, type: "sub", color: s.color, x: subX, y: subY, w: SUB_W, h: SUB_H, desc: sub.desc });
            edges.push({ id: `${sfId}-${subId}`, x1: surfX + SURF_W, y1: sfNodeY + SURF_H / 2, x2: subX, y2: subY + SUB_H / 2, color: s.color, dashed: true });
            subY += SUB_H + V_GAP_SUB;
          });
        }

        sfY += slot + V_GAP_SURF;
      });
    }
    curY += mh + V_GAP_MOD;
  });

  const allY1 = nodes.map((n: any) => n.y), allX2 = nodes.map((n: any) => n.x + n.w), allY2 = nodes.map((n: any) => n.y + n.h);
  const offY = -Math.min(...allY1) + 40;
  nodes.forEach((n: any) => n.y += offY); edges.forEach((e: any) => { e.y1 += offY; e.y2 += offY; });
  return { nodes, edges, W: Math.max(...allX2) + 80, H: Math.max(...allY2) + offY + 40 };
}

function CanvasView() {
  const [openModules, setOpenModules] = useState(new Set<string>());
  const [openSurfaces, setOpenSurfaces] = useState(new Set<string>());
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.9);
  const [animated, setAnimated] = useState(false);
  const dragging = useRef(false), lastPos = useRef({ x: 0, y: 0 }), hasDragged = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);
  const { nodes, edges, W, H } = buildGraph(openModules, openSurfaces);

  const centreOnRoot = useCallback((currentNodes?: any[], currentZoom?: number) => {
    const n = currentNodes || nodes;
    const z = currentZoom || zoom;
    const root = n.find((nd: any) => nd.id === "__root__");
    if (!root || !containerRef.current) return;
    const { offsetWidth: cw, offsetHeight: ch } = containerRef.current;
    const targetX = cw / 2 - (root.x + root.w / 2) * z;
    const targetY = ch / 2 - (root.y + root.h / 2) * z;
    setAnimated(true);
    setPan({ x: targetX, y: targetY });
    setTimeout(() => setAnimated(false), 350);
  }, [nodes, zoom]);

  useEffect(() => {
    if (!initialised.current && containerRef.current) {
      initialised.current = true;
      centreOnRoot(nodes, zoom);
    }
  }, [containerRef.current]);

  const handleNode = useCallback((node: any) => {
    if (node.type === "root") return;
    if (node.type === "module") {
      setOpenModules(prev => {
        const n = new Set(prev);
        if (n.has(node.id)) { n.delete(node.id); setOpenSurfaces(p => { const s = new Set(p); IA_SECTIONS.find(x => x.id === node.id)?.children.forEach((c: any) => s.delete(`${node.id}__${c.label}`)); return s; }); }
        else n.add(node.id);
        return n;
      });
    }
    if (node.type === "surface") {
      setOpenSurfaces(prev => { const n = new Set(prev); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n; });
    }
  }, []);

  const onPD = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    hasDragged.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onPM = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasDragged.current = true;
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onPU = () => { dragging.current = false; };
  const onDblClick = () => centreOnRoot();
  const onW = (e: React.WheelEvent<HTMLDivElement>) => { e.preventDefault(); setZoom(z => Math.min(2, Math.max(0.2, z - e.deltaY * 0.001))); };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onWheel={onW} onDoubleClick={onDblClick}
      style={{ width: "100%", height: "100%", position: "relative", background: "#f7f4ee", backgroundImage: "radial-gradient(#d8d4cc 1px,transparent 1px)", backgroundSize: "24px 24px", cursor: "grab", touchAction: "none" }}
    >
      <div style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", position: "relative", width: W, height: H, transition: animated ? "transform 0.35s cubic-bezier(0.4,0,0.2,1)" : "none" }}>
        <svg style={{ position: "absolute", inset: 0, width: W, height: H, pointerEvents: "none", overflow: "visible" }}>
          {edges.map((e: any) => <path key={e.id} d={bezierPath(e.x1, e.y1, e.x2, e.y2)} fill="none" stroke={e.color || "#c8c4bc"} strokeWidth={e.dashed ? 1 : 1.5} strokeDasharray={e.dashed ? "4 3" : "none"} strokeOpacity={0.45} />)}
        </svg>
        {nodes.map((node: any) => {
          const isRoot = node.type === "root", isMod = node.type === "module", isSurf = node.type === "surface", isSub = node.type === "sub";
          return (
            <div key={node.id} data-node="1" onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
              onClick={() => { if (isMod || isSurf) handleNode(node); }}
              style={{ position: "absolute", left: node.x, top: node.y, width: node.w, height: node.h, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 12px", borderRadius: isRoot ? 8 : isMod ? 10 : 8,
                background: isRoot ? "#1a1a14" : isMod ? "#fff" : isSurf ? "#fff" : "#faf9f6",
                border: isRoot ? "none" : isMod ? `1px solid ${node.color}` : isSurf ? (node.isOpen ? `1px solid ${node.color}` : "1px solid #dedad2") : "1px solid #e8e4dc",
                boxShadow: isRoot ? "0 2px 12px rgba(0,0,0,0.18)" : isMod ? `0 1px 4px ${node.color}18` : isSurf ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                cursor: (isMod || isSurf) ? "pointer" : "default", userSelect: "none" }}>
              <div style={{ fontSize: isRoot ? 12 : isMod ? 13 : isSurf ? 12 : 11, fontWeight: isRoot ? 700 : isMod ? 700 : isSurf ? 600 : 400,
                color: isRoot ? "#fff" : isMod ? node.color : "#1a1a14",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{node.label}</div>
              {(isMod || isSurf) && <div style={{ fontSize: 10, marginTop: 2, color: "#9a9080", whiteSpace: "nowrap" }}>
                {node.isOpen ? `▾ ${node.childCount} ${isMod ? "surfaces" : "sub-features"}` : node.childCount > 0 ? `▸ ${node.childCount} ${isMod ? "surfaces" : "sub-features"}` : "no children"}
              </div>}
              {isSub && <div style={{ fontSize: 10, color: "#9a9080", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{node.desc}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 4 }}>
        {([["＋", () => setZoom((z: number) => Math.min(2, z + 0.15))], ["－", () => setZoom((z: number) => Math.max(0.2, z - 0.15))], ["⊙", centreOnRoot]] as [string, () => void][]).map(([l, f]) => (
          <button key={l} onClick={f} style={{ width: 32, height: 32, background: "#fff", border: "1px solid #d8d4cc", borderRadius: 6, cursor: "pointer", fontSize: 14, color: "#6a6458", display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</button>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 20, left: 20, fontSize: 11, color: "#b0aa9a" }}>Drag to pan · Scroll to zoom · Double-click to recentre</div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function ApolloIA() {
  const [view, setView] = useState("canvas");
  const [activeSection, setActiveSection] = useState("search");
  const [listFilter, setListFilter] = useState("all");
  const section = IA_SECTIONS.find(s => s.id === activeSection);
  const totalSurfaces = IA_SECTIONS.reduce((a, s) => a + s.children.filter((c: any) => c.type === "surface").length, 0);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, sans-serif", background: "#f0ede6" }}>
      {/* Top bar */}
      <div style={{ height: 52, flexShrink: 0, background: "#e8e4dc", borderBottom: "1px solid #d0ccc4", display: "flex", alignItems: "center", padding: "0 24px", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", marginRight: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#9a9080", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1 }}>Fabric</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a14", letterSpacing: "-0.01em", lineHeight: 1.3 }}>Apollo.io IA</span>
        </div>
        <div style={{ width: 1, height: 24, background: "#d0ccc4" }} />
        {view !== "canvas" && (
          <div style={{ display: "flex", gap: 6, flex: 1, overflowX: "auto" }}>
            {IA_SECTIONS.map(s => (
              <button key={s.id} onClick={() => { setActiveSection(s.id); setListFilter("all"); }} style={{ padding: "4px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", background: activeSection === s.id ? s.color : "#d8d4cc", color: activeSection === s.id ? "#fff" : "#6a6458" }}>{s.label}</button>
            ))}
          </div>
        )}
        {view === "canvas" && (
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, color: "#9a9080" }}>{IA_SECTIONS.length} modules · {totalSurfaces} surfaces</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {Object.entries(TYPE_CONFIG).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.dot }} />
              <span style={{ fontSize: 11, color: "#6a6458" }}>{v.label}</span>
            </div>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: "#d0ccc4" }} />
        <div style={{ display: "flex", background: "#d8d4cc", borderRadius: 8, padding: 3, gap: 2 }}>
          {[{ key: "canvas", icon: "◈", label: "Canvas" }, { key: "tree", icon: "⬡", label: "Tree" }].map(v => (
            <button key={v.key} onClick={() => setView(v.key)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: view === v.key ? "#fff" : "transparent", color: view === v.key ? "#1a1a14" : "#9a9080", boxShadow: view === v.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        {view === "canvas" && <CanvasView />}
        {view === "tree" && section && <TreeView section={section} />}
        {view === "list" && section && <ListView section={section} filter={{ val: listFilter, set: setListFilter }} />}
      </div>
    </div>
  );
}
