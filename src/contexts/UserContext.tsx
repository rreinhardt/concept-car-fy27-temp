import { createContext, useContext, type ReactNode } from 'react'

interface UserProfile {
  firstName: string
  lastName: string
  initials: string
  email: string
  title: string
  company: CompanyProfile
}

interface CompanyProfile {
  name: string
  logo: string
  industry: string
  overview: string
  idealBuyers: string[]
  primaryUsers: string[]
  painSignals: string[]
}

const mockUser: UserProfile = {
  firstName: 'Aaron',
  lastName: 'Pfeiffer',
  initials: 'AP',
  email: 'aaron.pfeiffer@fuse.com',
  title: 'Senior Account Executive',
  company: {
    name: 'Fuse Oncology',
    logo: 'F',
    industry: 'Information Technology & Services',
    overview:
      'Fuse Oncology sells to mid-sized to large radiation oncology practices, hospital systems, and integrated health networks (typically 2-50+ employees)',
    idealBuyers: ['C-suite', 'VP of Operations'],
    primaryUsers: ['Radiation Oncologists', 'Therapists', 'Physicists'],
    painSignals: [
      'Long time-to-treatment after consult',
      'Administrative burden on clinical staff',
      'Data silos across systems',
      'Manual documentation and workflow inefficiencies',
    ],
  },
}

const UserContext = createContext<UserProfile>(mockUser)

export function UserProvider({ children }: { children: ReactNode }) {
  return (
    <UserContext.Provider value={mockUser}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
