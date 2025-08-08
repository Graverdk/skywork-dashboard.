import { describe, it, expect } from 'vitest'
import { calculateBonuses, qualifies } from './calc'
import { Employee, Settings } from './types'

const settings: Settings = {
  totalProfit: 100000,
  sharedCosts: 20000,
  totalProfitShare: 0.4,
  minYears: 1,
  minHours: 1000,
  sickLimit: 0.05,
  hoursPerDay: 7.4,
  levelFactors: { 1: 1, 2: 1.5, 3: 2 },
  seniorityFactors: [
    { min: 1, max: 2, factor: 1 },
    { min: 3, max: 4, factor: 1.3 },
    { min: 5, factor: 1.6 },
  ],
  shares: { base: 0.3, level: 0.5, seniority: 0.2 },
}

describe('qualifies', () => {
  it('fails when hours too low', () => {
    const emp: Employee = {
      name: 'Test',
      region: 'JY',
      level: 1,
      hireDate: '2010-01-01',
      hours: 900,
      sickDays: 0,
      breach: false,
    }
    expect(qualifies(emp, settings)).toBe(false)
  })
})

describe('calculateBonuses', () => {
  it('distributes pools', () => {
    const emps: Employee[] = [
      {
        name: 'A',
        region: 'JY',
        level: 1,
        hireDate: '2010-01-01',
        hours: 1200,
        sickDays: 0,
        breach: false,
      },
      {
        name: 'B',
        region: 'JY',
        level: 2,
        hireDate: '2010-01-01',
        hours: 1200,
        sickDays: 0,
        breach: false,
      },
    ]
    const res = calculateBonuses(emps, settings)
    const jy = res.regions.JY
    expect(jy.pool).toBeCloseTo(((100000 / 2) - 20000 / 2) * 0.4)
    expect(jy.employees.filter((e) => e.qualified).length).toBe(2)
    const total = jy.employees.reduce((s, e) => s + e.total, 0)
    expect(total).toBeCloseTo(jy.pool)
  })
})
