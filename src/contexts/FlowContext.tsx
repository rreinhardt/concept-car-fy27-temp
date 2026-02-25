import { createContext, useContext, useState, type ReactNode } from 'react'

type FlowPhase = 'onboarding' | 'main'

interface FlowState {
  phase: FlowPhase
  currentStep: number
  setPhase: (phase: FlowPhase) => void
  setCurrentStep: (step: number) => void
}

const FlowContext = createContext<FlowState | null>(null)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<FlowPhase>('onboarding')
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <FlowContext.Provider value={{ phase, currentStep, setPhase, setCurrentStep }}>
      {children}
    </FlowContext.Provider>
  )
}

export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within FlowProvider')
  return ctx
}
