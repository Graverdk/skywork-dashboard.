import React, { useState, useEffect, useMemo } from 'react'
import EmployeeTable from './components/EmployeeTable'
import SettingsPanel from './components/SettingsPanel'
import RegionChart from './components/RegionChart'
import { Employee, Settings } from './types'
import { calculateBonuses } from './calc'
import { load, save } from './storage'
import { exportJSON, importJSON, importCSV } from './importExport'

const defaultSettings: Settings = {
  monthlyProfits: Array(12).fill(1000000 / 12),
  sharedCosts: 200000,
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

const defaultEmployees: Employee[] = [
  { name: 'Anna', region: 'JY', level: 1, hireDate: '2019-01-01', hours: 1200, sickDays: 5, breach: false },
  { name: 'Bent', region: 'SJ', level: 2, hireDate: '2017-06-01', hours: 1400, sickDays: 3, breach: false },
  { name: 'Clara', region: 'JY', level: 3, hireDate: '2015-03-10', hours: 1500, sickDays: 2, breach: false },
  { name: 'Dan', region: 'SJ', level: 1, hireDate: '2020-07-15', hours: 1100, sickDays: 4, breach: false },
  { name: 'Eva', region: 'JY', level: 2, hireDate: '2018-02-20', hours: 1600, sickDays: 1, breach: false },
  { name: 'Finn', region: 'SJ', level: 3, hireDate: '2014-11-11', hours: 1700, sickDays: 6, breach: false },
  { name: 'Gitte', region: 'JY', level: 1, hireDate: '2016-05-05', hours: 1000, sickDays: 0, breach: false },
  { name: 'Hans', region: 'SJ', level: 2, hireDate: '2019-09-09', hours: 1300, sickDays: 2, breach: false },
]

function App() {
  const saved = load()
  const [settings, setSettings] = useState<Settings>({
    ...defaultSettings,
    ...(saved?.settings || {}),
  })
  const [employees, setEmployees] = useState<Employee[]>(saved?.employees || defaultEmployees)

  useEffect(() => {
    const t = setTimeout(() => save({ settings, employees }), 300)
    return () => clearTimeout(t)
  }, [settings, employees])

  const result = useMemo(() => calculateBonuses(employees, settings), [employees, settings])

  const exportData = () => {
    const text = exportJSON(settings, employees)
    const blob = new Blob([text], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'skywork-data.json'
    a.click()
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const txt = reader.result as string
      try {
        const { settings: s, employees: emps } = importJSON(txt)
        setSettings({ ...defaultSettings, ...s })
        setEmployees(emps)
      } catch (err) {
        console.error(err)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-gray-800">
      <h1 className="text-2xl font-bold">Sky-Work Bonus — Regioner</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <SettingsPanel settings={settings} onChange={setSettings} />
        <div className="p-4 bg-white rounded-xl shadow-md space-y-2">
          <h2 className="font-bold">Dashboard</h2>
          <p>SJ pulje: {result.regions.SJ.pool.toFixed(0)} kr</p>
          <p>JY pulje: {result.regions.JY.pool.toFixed(0)} kr</p>
          <p>Qualificerede SJ: {result.regions.SJ.employees.filter((e) => e.qualified).length}</p>
          <p>Qualificerede JY: {result.regions.JY.employees.filter((e) => e.qualified).length}</p>
          <p>Udbetaling SJ: {result.regions.SJ.totalPayout.toFixed(0)} kr</p>
          <p>Udbetaling JY: {result.regions.JY.totalPayout.toFixed(0)} kr</p>
          <div className="space-x-2">
            <button
              onClick={exportData}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export JSON
            </button>
            <label className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
              Import JSON
              <input type="file" accept="application/json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>
      </div>
      <EmployeeTable employees={employees} onChange={setEmployees} />
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Jylland</h3>
          <RegionChart data={result.regions.JY.employees} />
        </div>
        <div>
          <h3 className="font-bold mb-2">Sjælland</h3>
          <RegionChart data={result.regions.SJ.employees} />
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h2 className="font-bold mb-2">Om modellen</h2>
        <p className="text-sm">
          Pulje 40% af overskud efter delte udgifter. Krav: min 1 år, 1000 timer, ingen brud, sygefravær ≤5%. Fordeling: 30%
          grund, 50% level, 20% anciennitet.
        </p>
      </div>
    </div>
  )
}

export default App
