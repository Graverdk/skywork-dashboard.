import {
  Employee,
  Settings,
  Region,
  CalcResult,
  EmployeeResult,
} from './types'

function yearsBetween(start: string, end: Date = new Date()): number {
  const s = new Date(start)
  const diff = end.getTime() - s.getTime()
  return diff / (1000 * 60 * 60 * 24 * 365.25)
}

export function qualifies(
  emp: Employee,
  settings: Settings,
  refDate: Date = new Date()
): boolean {
  const years = yearsBetween(emp.hireDate, refDate)
  const sickPercent = emp.sickDays / (emp.hours / settings.hoursPerDay)
  return (
    years >= settings.minYears &&
    emp.hours >= settings.minHours &&
    sickPercent <= settings.sickLimit &&
    !emp.breach &&
    emp.level !== null
  )
}

function getSeniorityFactor(
  emp: Employee,
  settings: Settings,
  refDate: Date = new Date()
): number {
  const years = yearsBetween(emp.hireDate, refDate)
  for (const f of settings.seniorityFactors) {
    if (years >= f.min && (f.max === undefined || years <= f.max)) {
      return f.factor
    }
  }
  return 1
}

export function calculateBonuses(
  employees: Employee[],
  settings: Settings,
  refDate: Date = new Date()
): CalcResult {
  const regions: Region[] = ['SJ', 'JY']
  const totalProfit = settings.monthlyProfits.reduce((sum, p) => sum + p, 0)
  const poolPerRegion =
    ((totalProfit / 2) - settings.sharedCosts / 2) *
    settings.totalProfitShare
  const result: CalcResult = { regions: {} as Record<Region, any> }

  for (const region of regions) {
    const regionEmployees = employees.filter((e) => e.region === region)
    const qualified = regionEmployees.filter((e) =>
      qualifies(e, settings, refDate)
    )
    const basePool = poolPerRegion * settings.shares.base
    const levelPool = poolPerRegion * settings.shares.level
    const senPool = poolPerRegion * settings.shares.seniority

    const baseEach = qualified.length > 0 ? basePool / qualified.length : 0
    const levelSum = qualified.reduce(
      (sum, e) => sum + (settings.levelFactors[e.level as number] || 0),
      0
    )
    const senSum = qualified.reduce(
      (sum, e) => sum + getSeniorityFactor(e, settings, refDate),
      0
    )

    const employeeResults: EmployeeResult[] = regionEmployees.map((e) => {
      const qualifiedFlag = qualified.includes(e)
      const levelFactor = qualifiedFlag
        ? settings.levelFactors[e.level as number] || 0
        : 0
      const senFactor = qualifiedFlag
        ? getSeniorityFactor(e, settings, refDate)
        : 0
      const level = levelSum > 0 ? (levelPool * levelFactor) / levelSum : 0
      const seniority = senSum > 0 ? (senPool * senFactor) / senSum : 0
      const base = qualifiedFlag ? baseEach : 0
      const total = base + level + seniority
      return { employee: e, qualified: qualifiedFlag, base, level, seniority, total }
    })

    const totalPayout = employeeResults.reduce((sum, r) => sum + r.total, 0)
    result.regions[region] = {
      region,
      pool: poolPerRegion,
      employees: employeeResults,
      totalPayout,
    }
  }

  return result
}
