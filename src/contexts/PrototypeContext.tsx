import { createContext, useContext, useState, type ReactNode } from 'react'

interface PrototypeState {
  /** Currently selected contacts (by index) in the search table */
  selectedContacts: number[]
  setSelectedContacts: (ids: number[]) => void

  /** Whether the drawer is open and its content key */
  drawerOpen: boolean
  drawerContent: string | null
  openDrawer: (content: string) => void
  closeDrawer: () => void

  /** Whether a modal is open and its content key */
  modalOpen: boolean
  modalContent: string | null
  openModal: (content: string) => void
  closeModal: () => void
}

const PrototypeContext = createContext<PrototypeState | null>(null)

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerContent, setDrawerContent] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<string | null>(null)

  const openDrawer = (content: string) => {
    setDrawerContent(content)
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
    setDrawerContent(null)
  }
  const openModal = (content: string) => {
    setModalContent(content)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setModalContent(null)
  }

  return (
    <PrototypeContext.Provider
      value={{
        selectedContacts,
        setSelectedContacts,
        drawerOpen,
        drawerContent,
        openDrawer,
        closeDrawer,
        modalOpen,
        modalContent,
        openModal,
        closeModal,
      }}
    >
      {children}
    </PrototypeContext.Provider>
  )
}

export function usePrototype() {
  const ctx = useContext(PrototypeContext)
  if (!ctx) throw new Error('usePrototype must be used within PrototypeProvider')
  return ctx
}
