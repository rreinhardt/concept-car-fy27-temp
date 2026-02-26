import { useState, useEffect, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import './FeedbackOverlay.css'

export default function FeedbackOverlay() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [sending, setSending] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  // Drag state
  const [pos, setPos] = useState({ x: 24, y: 24 })
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Region capture state
  const [region, setRegion] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null)
  const regionRef = useRef<{ startX: number; startY: number } | null>(null)

  // Toggle on 'c' key — but not if typing in an input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Dragging the panel
  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y }

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      setPos({
        x: dragRef.current.origX + (ev.clientX - dragRef.current.startX),
        y: dragRef.current.origY + (ev.clientY - dragRef.current.startY),
      })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos])

  // Region screen capture
  const startCapture = useCallback(() => {
    setCapturing(true)
    setRegion(null)
  }, [])

  useEffect(() => {
    if (!capturing) return

    const onDown = (e: MouseEvent) => {
      regionRef.current = { startX: e.clientX, startY: e.clientY }
      setRegion({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY })
    }
    const onMove = (e: MouseEvent) => {
      if (!regionRef.current) return
      setRegion({
        startX: regionRef.current.startX,
        startY: regionRef.current.startY,
        endX: e.clientX,
        endY: e.clientY,
      })
    }
    const onUp = async () => {
      if (!regionRef.current || !region) {
        setCapturing(false)
        regionRef.current = null
        return
      }

      const x = Math.min(regionRef.current.startX, region.endX)
      const y = Math.min(regionRef.current.startY, region.endY)
      const w = Math.abs(region.endX - regionRef.current.startX)
      const h = Math.abs(region.endY - regionRef.current.startY)

      regionRef.current = null
      setCapturing(false)
      setRegion(null)

      if (w < 10 || h < 10) return

      try {
        // Hide overlay temporarily for clean capture
        if (panelRef.current) panelRef.current.style.display = 'none'
        const canvas = await html2canvas(document.body, {
          x, y, width: w, height: h,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight,
          useCORS: true,
        })
        if (panelRef.current) panelRef.current.style.display = ''
        setScreenshot(canvas.toDataURL('image/png'))
      } catch (err) {
        console.error('Capture failed:', err)
        if (panelRef.current) panelRef.current.style.display = ''
      }
    }

    window.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [capturing, region])

  // Submit feedback
  const submit = async () => {
    if (!text.trim() && !screenshot) return
    setSending(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          url: window.location.pathname,
          screenshot,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setFlash('Saved!')
        setText('')
        setScreenshot(null)
        setTimeout(() => {
          setFlash(null)
          setOpen(false)
        }, 800)
      }
    } catch (err) {
      console.error('Failed to save feedback:', err)
      setFlash('Error saving')
      setTimeout(() => setFlash(null), 2000)
    } finally {
      setSending(false)
    }
  }

  if (!open && !capturing) return null

  // Capture overlay (full screen crosshair with selection rectangle)
  if (capturing) {
    return (
      <div className="fb-capture-overlay">
        {region && (
          <div
            className="fb-capture-region"
            style={{
              left: Math.min(region.startX, region.endX),
              top: Math.min(region.startY, region.endY),
              width: Math.abs(region.endX - region.startX),
              height: Math.abs(region.endY - region.startY),
            }}
          />
        )}
        <div className="fb-capture-hint">Click and drag to capture a region. Release to finish.</div>
      </div>
    )
  }

  return (
    <div
      className="fb-panel"
      ref={panelRef}
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Drag handle */}
      <div className="fb-handle" onMouseDown={onDragStart}>
        <span className="fb-handle-dots">⠿</span>
        <span className="fb-handle-title">Feedback</span>
        <button className="fb-close" onClick={() => { setOpen(false); setText(''); setScreenshot(null) }}>✕</button>
      </div>

      {/* Screenshot preview */}
      {screenshot && (
        <div className="fb-screenshot-preview">
          <img src={screenshot} alt="capture" />
          <button className="fb-screenshot-remove" onClick={() => setScreenshot(null)}>✕</button>
        </div>
      )}

      {/* Capture button */}
      <button className="fb-capture-btn" onClick={startCapture}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {screenshot ? 'Recapture' : 'Capture region'}
      </button>

      {/* Text input */}
      <textarea
        className="fb-textarea"
        placeholder="Describe the feedback..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey) submit()
        }}
      />

      {/* URL badge */}
      <div className="fb-url">{window.location.pathname}</div>

      {/* Submit */}
      <div className="fb-footer">
        {flash && <span className="fb-flash">{flash}</span>}
        <button className="fb-submit" onClick={submit} disabled={sending || (!text.trim() && !screenshot)}>
          {sending ? 'Saving...' : 'Save'} <span className="fb-shortcut">⌘↵</span>
        </button>
      </div>
    </div>
  )
}
