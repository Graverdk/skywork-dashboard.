import { Employee, Settings } from './types'

export function exportJSON(settings: Settings, employees: Employee[]): string {
  return JSON.stringify({ settings, employees }, null, 2)
}

export function importJSON(text: string): {
  settings: Settings
  employees: Employee[]
} {
  const data = JSON.parse(text)
  return data
}

export function importCSV(csv: string): Employee[] {
  return csv
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [name, region, level, hireDate, hours, sickDays, breach] = line.split(',')
      return {
        name,
        region: region as 'SJ' | 'JY',
        level: level ? (Number(level) as 1 | 2 | 3) : null,
        hireDate,
        hours: Number(hours),
        sickDays: Number(sickDays),
        breach: breach === 'true',
      }
    })
}
