export type Region = 'SJ' | 'JY'

export interface Employee {
  name: string
  region: Region
  level: 1 | 2 | 3 | null
  hireDate: string // YYYY-MM-DD
  hours: number
  sickDays: number
  breach: boolean
}

export interface Shares {
  base: number
  level: number
  seniority: number
}

export interface LevelFactors {
  [level: number]: number
}

export interface SeniorityFactor {
  min: number
  max?: number
  factor: number
}

export interface Settings {
  totalProfit: number
  sharedCosts: number
  totalProfitShare: number
  minYears: number
  minHours: number
  sickLimit: number
  hoursPerDay: number
  levelFactors: LevelFactors
  seniorityFactors: SeniorityFactor[]
  shares: Shares
}

export interface BonusBreakdown {
  base: number
  level: number
  seniority: number
}

export interface EmployeeResult extends BonusBreakdown {
  employee: Employee
  qualified: boolean
  total: number
}

export interface RegionResult {
  region: Region
  pool: number
  employees: EmployeeResult[]
  totalPayout: number
}

export interface CalcResult {
  regions: Record<Region, RegionResult>
}
