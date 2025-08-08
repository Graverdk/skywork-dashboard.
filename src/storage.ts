import { Employee, Settings } from './types'

const KEY = 'skywork-data'

export interface SaveData {
  settings: Settings
  employees: Employee[]
}

export function load(): SaveData | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function save(data: SaveData) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(data))
}
