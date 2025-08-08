import React from 'react'
import { Settings } from '../types'

interface Props {
  settings: Settings
  onChange: (s: Settings) => void
}

export default function SettingsPanel({ settings, onChange }: Props) {
  const update = (field: keyof Settings, value: any) => {
    onChange({ ...settings, [field]: value })
  }

  const updateShare = (field: keyof Settings['shares'], value: number) => {
    onChange({ ...settings, shares: { ...settings.shares, [field]: value } })
  }

  const updateLevelFactors = (text: string) => {
    const obj: Record<number, number> = {}
    text.split(',').forEach((pair) => {
      const [lvl, val] = pair.split(':')
      if (lvl && val) obj[Number(lvl.trim())] = Number(val.trim())
    })
    onChange({ ...settings, levelFactors: obj })
  }

  const updateSeniorityFactors = (text: string) => {
    const arr = text
      .split(',')
      .map((part) => {
        const [range, val] = part.split(':')
        if (!range || !val) return null
        if (range.includes('-')) {
          const [min, max] = range.split('-').map((n) => Number(n))
          return { min, max, factor: Number(val) }
        } else if (range.endsWith('+')) {
          const min = Number(range.slice(0, -1))
          return { min, factor: Number(val) }
        }
        return null
      })
      .filter(Boolean) as any
    onChange({ ...settings, seniorityFactors: arr })
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-bold mb-2">Indstillinger</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <label>
          Overskud
          <input
            type="number"
            value={settings.totalProfit}
            onChange={(ev) => update('totalProfit', Number(ev.target.value))}
          />
        </label>
        <label>
          Fællesudgifter
          <input
            type="number"
            value={settings.sharedCosts}
            onChange={(ev) => update('sharedCosts', Number(ev.target.value))}
          />
        </label>
        <label>
          Andel til pulje
          <input
            type="number"
            step="0.01"
            value={settings.totalProfitShare}
            onChange={(ev) => update('totalProfitShare', Number(ev.target.value))}
          />
        </label>
        <label>
          Min. år
          <input
            type="number"
            value={settings.minYears}
            onChange={(ev) => update('minYears', Number(ev.target.value))}
          />
        </label>
        <label>
          Min. timer
          <input
            type="number"
            value={settings.minHours}
            onChange={(ev) => update('minHours', Number(ev.target.value))}
          />
        </label>
        <label>
          Sygegrænse
          <input
            type="number"
            step="0.01"
            value={settings.sickLimit}
            onChange={(ev) => update('sickLimit', Number(ev.target.value))}
          />
        </label>
        <label>
          Timer pr. dag
          <input
            type="number"
            step="0.1"
            value={settings.hoursPerDay}
            onChange={(ev) => update('hoursPerDay', Number(ev.target.value))}
          />
        </label>
        <label>
          Split base/level/ancien
          <input
            value={`${settings.shares.base},${settings.shares.level},${settings.shares.seniority}`}
            onChange={(ev) => {
              const [b, l, s] = ev.target.value.split(',').map(Number)
              onChange({
                ...settings,
                shares: { base: b || 0, level: l || 0, seniority: s || 0 },
              })
            }}
          />
        </label>
        <label>
          Level-faktorer
          <input
            value={Object.entries(settings.levelFactors)
              .map(([k, v]) => `${k}:${v}`)
              .join(',')}
            onChange={(ev) => updateLevelFactors(ev.target.value)}
          />
        </label>
        <label>
          Anc.-faktorer
          <input
            value={settings.seniorityFactors
              .map((f) =>
                f.max ? `${f.min}-${f.max}:${f.factor}` : `${f.min}+:${f.factor}`
              )
              .join(',')}
            onChange={(ev) => updateSeniorityFactors(ev.target.value)}
          />
        </label>
      </div>
    </div>
  )
}
