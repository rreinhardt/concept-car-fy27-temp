export interface Company {
  id: number
  name: string
  industry: string
  employees: string
  location: string
  revenue: string
  signals: string[]
  updatedAgo?: string
  trending?: boolean
}

export const mockCompanies: Company[] = [
  { id: 1, name: 'Mayo Clinic', industry: 'Healthcare', employees: '10,001+', location: 'Rochester, MN', revenue: '$16.3B', signals: ['Hiring', 'High ICP fit'], updatedAgo: '5m ago', trending: true },
  { id: 2, name: 'Varian Medical Systems', industry: 'Medical Devices', employees: '5,001-10,000', location: 'Palo Alto, CA', revenue: '$3.2B', signals: ['Funding', 'Tech change'], updatedAgo: '18m ago', trending: true },
  { id: 3, name: 'Cleveland Clinic', industry: 'Healthcare', employees: '10,001+', location: 'Cleveland, OH', revenue: '$12.4B', signals: ['High ICP fit'], updatedAgo: '1h ago' },
  { id: 4, name: 'Elekta', industry: 'Medical Devices', employees: '1,001-5,000', location: 'Stockholm, SE', revenue: '$1.6B', signals: ['Tech change', 'Recent activity'], updatedAgo: '10m ago', trending: true },
  { id: 5, name: 'Siemens Healthineers', industry: 'Medical Devices', employees: '10,001+', location: 'Erlangen, DE', revenue: '$21.7B', signals: ['Hiring'], updatedAgo: '30m ago' },
  { id: 6, name: 'Epic Systems', industry: 'Health IT', employees: '5,001-10,000', location: 'Verona, WI', revenue: '$3.8B', signals: ['High ICP fit', 'Hiring'] },
  { id: 7, name: 'Accuray', industry: 'Medical Devices', employees: '501-1,000', location: 'Sunnyvale, CA', revenue: '$430M', signals: ['Funding'], updatedAgo: '2h ago' },
  { id: 8, name: 'Novalis Health', industry: 'Healthcare', employees: '201-500', location: 'Los Angeles, CA', revenue: '$89M', signals: ['Funding', 'High ICP fit'], updatedAgo: '4m ago', trending: true },
  { id: 9, name: 'UPMC', industry: 'Healthcare', employees: '10,001+', location: 'Pittsburgh, PA', revenue: '$26.0B', signals: ['Tech change'] },
  { id: 10, name: 'Moffitt Cancer Center', industry: 'Healthcare', employees: '5,001-10,000', location: 'Tampa, FL', revenue: '$2.1B', signals: ['Hiring', 'Recent activity'], updatedAgo: '15m ago' },
  { id: 11, name: 'Philips Healthcare', industry: 'Medical Devices', employees: '10,001+', location: 'Cambridge, MA', revenue: '$18.1B', signals: [] },
  { id: 12, name: 'Cerner', industry: 'Health IT', employees: '10,001+', location: 'Kansas City, MO', revenue: '$5.5B', signals: ['Recent activity'], updatedAgo: '50m ago' },
  { id: 13, name: 'Mercy Health', industry: 'Healthcare', employees: '5,001-10,000', location: 'Cincinnati, OH', revenue: '$5.8B', signals: ['High ICP fit', 'Hiring'], updatedAgo: '7m ago' },
]
