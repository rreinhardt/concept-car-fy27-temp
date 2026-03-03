import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type PromotionPhase = 'idle' | 'expand-more' | 'fly' | 'settle' | 'collapse-more'

interface SidebarState {
  promotedItems: string[]
  highlightItem: string | null
  promotionPhase: PromotionPhase
  animatingItemId: string | null
  promoteItem: (id: string) => void
  advancePhase: () => void
  userCollapsed: boolean
  setUserCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarState>({
  promotedItems: [],
  highlightItem: null,
  promotionPhase: 'idle',
  animatingItemId: null,
  promoteItem: () => {},
  advancePhase: () => {},
  userCollapsed: false,
  setUserCollapsed: () => {},
})

const PHASE_SEQUENCE: PromotionPhase[] = ['expand-more', 'fly', 'settle', 'collapse-more', 'idle']

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [promotedItems, setPromotedItems] = useState<string[]>([])
  const [highlightItem, setHighlightItem] = useState<string | null>(null)
  const [promotionPhase, setPromotionPhase] = useState<PromotionPhase>('idle')
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null)
  const [userCollapsed, setUserCollapsed] = useState(false)

  const advancePhase = useCallback(() => {
    setPromotionPhase((prev) => {
      const idx = PHASE_SEQUENCE.indexOf(prev)
      const next = PHASE_SEQUENCE[idx + 1] ?? 'idle'
      // When we reach idle, commit the item and clear animation state
      if (next === 'idle') {
        setAnimatingItemId(null)
        setTimeout(() => setHighlightItem(null), 1500)
      }
      // When we reach settle, commit the item to promotedItems (ghost has arrived)
      if (next === 'settle') {
        setAnimatingItemId((id) => {
          if (id) {
            setPromotedItems((prev) => (prev.includes(id) ? prev : [...prev, id]))
            setHighlightItem(id)
          }
          return id
        })
      }
      return next
    })
  }, [])

  const promoteItem = useCallback((id: string) => {
    if (promotionPhase !== 'idle') return // ignore if already animating
    setAnimatingItemId(id)
    setPromotionPhase('expand-more')
  }, [promotionPhase])

  return (
    <SidebarContext.Provider value={{
      promotedItems,
      highlightItem,
      promotionPhase,
      animatingItemId,
      promoteItem,
      advancePhase,
      userCollapsed,
      setUserCollapsed,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
