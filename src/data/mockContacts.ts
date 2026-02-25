export interface Contact {
  id: number
  name: string
  title: string
  company: string
  location: string
  department: string
  fitScore: 'Excellent' | 'Good' | 'Fair'
  verified: boolean
  freshness: string
  reachability: number
}

export const mockContacts: Contact[] = [
  { id: 1, name: 'Kenton Jast', title: 'District Manager', company: 'Mercy Health', location: 'Cincinnati, OH', department: 'Operations', fitScore: 'Excellent', verified: true, freshness: '2 days ago', reachability: 92 },
  { id: 2, name: 'Dandre Kassler', title: 'Marketing Lead', company: 'Varian Medical', location: 'Palo Alto, CA', department: 'Marketing', fitScore: 'Excellent', verified: true, freshness: '1 day ago', reachability: 88 },
  { id: 3, name: 'Emil Runolfsson', title: 'Sales Manager', company: 'Elekta', location: 'Atlanta, GA', department: 'Medical & Health', fitScore: 'Good', verified: true, freshness: '5 days ago', reachability: 85 },
  { id: 4, name: 'Shea Sanford', title: 'Project Lead', company: 'Mayo Clinic', location: 'Rochester, MN', department: 'Operations', fitScore: 'Excellent', verified: true, freshness: '1 day ago', reachability: 94 },
  { id: 5, name: 'Eli Bogan', title: 'Team Supervisor', company: 'Cleveland Clinic', location: 'Cleveland, OH', department: 'Medical & Health', fitScore: 'Good', verified: false, freshness: '7 days ago', reachability: 76 },
  { id: 6, name: 'Ford Kuhlman', title: 'Sales Associate', company: 'Accuray', location: 'Sunnyvale, CA', department: 'Marketing', fitScore: 'Excellent', verified: true, freshness: '3 days ago', reachability: 91 },
  { id: 7, name: 'Kobe Ciona', title: 'Account Executive', company: 'Siemens Healthineers', location: 'Malvern, PA', department: 'Operations', fitScore: 'Good', verified: true, freshness: '4 days ago', reachability: 82 },
  { id: 8, name: 'Brighton Windler', title: 'Data Analyst', company: 'Epic Systems', location: 'Verona, WI', department: 'Medical & Health', fitScore: 'Fair', verified: true, freshness: '10 days ago', reachability: 71 },
  { id: 9, name: 'Justyn Tremblay', title: 'Researcher', company: 'Moffitt Cancer Center', location: 'Tampa, FL', department: 'Medical & Health', fitScore: 'Excellent', verified: true, freshness: '2 days ago', reachability: 89 },
  { id: 10, name: 'Arnulfo Aufderhar', title: 'Software Engineer', company: 'Philips Healthcare', location: 'Cambridge, MA', department: 'Operations', fitScore: 'Good', verified: false, freshness: '6 days ago', reachability: 74 },
  { id: 11, name: 'Kiel Bernhard', title: 'Financial Advisor', company: 'UPMC', location: 'Pittsburgh, PA', department: 'Operations', fitScore: 'Fair', verified: true, freshness: '8 days ago', reachability: 68 },
  { id: 12, name: 'Eli Williamson', title: 'UX Designer', company: 'Cerner', location: 'Kansas City, MO', department: 'Marketing', fitScore: 'Good', verified: true, freshness: '3 days ago', reachability: 86 },
  { id: 13, name: 'Korey Veum', title: 'Regional Manager', company: 'Novalis', location: 'Los Angeles, CA', department: 'Operations', fitScore: 'Excellent', verified: true, freshness: '1 day ago', reachability: 95 },
]
