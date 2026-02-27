export interface Contact {
  id: number
  name: string
  title: string
  company: string
  location: string
  department: string
  verified: boolean
  freshness: string
  reachability: number
  signals: string[]
  updatedAgo?: string
  trending?: boolean
}

export const mockContacts: Contact[] = [
  { id: 1, name: 'Kenton Jast', title: 'District Manager', company: 'Mercy Health', location: 'Cincinnati, OH', department: 'Operations', verified: true, freshness: '2 days ago', reachability: 92, signals: ['Hiring', 'High ICP fit'], updatedAgo: '3m ago', trending: true },
  { id: 2, name: 'Dandre Kassler', title: 'Marketing Lead', company: 'Varian Medical', location: 'Palo Alto, CA', department: 'Marketing', verified: true, freshness: '1 day ago', reachability: 88, signals: ['Funding', 'Recent activity'], updatedAgo: '12m ago', trending: true },
  { id: 3, name: 'Emil Runolfsson', title: 'Sales Manager', company: 'Elekta', location: 'Atlanta, GA', department: 'Medical & Health', verified: true, freshness: '5 days ago', reachability: 85, signals: ['Tech change'], updatedAgo: '1h ago' },
  { id: 4, name: 'Shea Sanford', title: 'Project Lead', company: 'Mayo Clinic', location: 'Rochester, MN', department: 'Operations', verified: true, freshness: '1 day ago', reachability: 94, signals: ['High ICP fit', 'Hiring'], updatedAgo: '8m ago', trending: true },
  { id: 5, name: 'Eli Bogan', title: 'Team Supervisor', company: 'Cleveland Clinic', location: 'Cleveland, OH', department: 'Medical & Health', verified: false, freshness: '7 days ago', reachability: 76, signals: ['Recent activity'] },
  { id: 6, name: 'Ford Kuhlman', title: 'Sales Associate', company: 'Accuray', location: 'Sunnyvale, CA', department: 'Marketing', verified: true, freshness: '3 days ago', reachability: 91, signals: ['Funding'], updatedAgo: '25m ago' },
  { id: 7, name: 'Kobe Ciona', title: 'Account Executive', company: 'Siemens Healthineers', location: 'Malvern, PA', department: 'Operations', verified: true, freshness: '4 days ago', reachability: 82, signals: ['Tech change', 'High ICP fit'] },
  { id: 8, name: 'Brighton Windler', title: 'Data Analyst', company: 'Epic Systems', location: 'Verona, WI', department: 'Medical & Health', verified: true, freshness: '10 days ago', reachability: 71, signals: [] },
  { id: 9, name: 'Justyn Tremblay', title: 'Researcher', company: 'Moffitt Cancer Center', location: 'Tampa, FL', department: 'Medical & Health', verified: true, freshness: '2 days ago', reachability: 89, signals: ['Hiring', 'Recent activity'], updatedAgo: '5m ago' },
  { id: 10, name: 'Arnulfo Aufderhar', title: 'Software Engineer', company: 'Philips Healthcare', location: 'Cambridge, MA', department: 'Operations', verified: false, freshness: '6 days ago', reachability: 74, signals: [] },
  { id: 11, name: 'Kiel Bernhard', title: 'Financial Advisor', company: 'UPMC', location: 'Pittsburgh, PA', department: 'Operations', verified: true, freshness: '8 days ago', reachability: 68, signals: ['Tech change'] },
  { id: 12, name: 'Eli Williamson', title: 'UX Designer', company: 'Cerner', location: 'Kansas City, MO', department: 'Marketing', verified: true, freshness: '3 days ago', reachability: 86, signals: ['Recent activity'], updatedAgo: '45m ago' },
  { id: 13, name: 'Korey Veum', title: 'Regional Manager', company: 'Novalis', location: 'Los Angeles, CA', department: 'Operations', verified: true, freshness: '1 day ago', reachability: 95, signals: ['High ICP fit', 'Funding'], updatedAgo: '2m ago', trending: true },
]
