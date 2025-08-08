import React from 'react'
import { Employee } from '../types'

interface Props {
  employees: Employee[]
  onChange: (emps: Employee[]) => void
}

export default function EmployeeTable({ employees, onChange }: Props) {
  const update = (index: number, field: keyof Employee, value: any) => {
    const newEmps = employees.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    onChange(newEmps)
  }
  const remove = (index: number) => {
    const newEmps = employees.filter((_, i) => i !== index)
    onChange(newEmps)
  }
  const add = () => {
    onChange([
      ...employees,
      { name: '', region: 'JY', level: null, hireDate: '', hours: 0, sickDays: 0, breach: false },
    ])
  }
  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Navn</th>
            <th>Region</th>
            <th>Level</th>
            <th>Ansat</th>
            <th>Timer</th>
            <th>Sygedage</th>
            <th>Brud</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e, i) => (
            <tr key={i} className="border-b">
              <td>
                <input className="p-1" value={e.name} onChange={(ev) => update(i, 'name', ev.target.value)} />
              </td>
              <td>
                <select value={e.region} onChange={(ev) => update(i, 'region', ev.target.value as any)}>
                  <option value="JY">JY</option>
                  <option value="SJ">SJ</option>
                </select>
              </td>
              <td>
                <select
                  value={e.level ?? ''}
                  onChange={(ev) => update(i, 'level', ev.target.value ? Number(ev.target.value) : null)}
                >
                  <option value="">-</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </td>
              <td>
                <input type="date" value={e.hireDate} onChange={(ev) => update(i, 'hireDate', ev.target.value)} />
              </td>
              <td>
                <input
                  type="number"
                  className="w-20"
                  value={e.hours}
                  onChange={(ev) => update(i, 'hours', Number(ev.target.value))}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="w-16"
                  value={e.sickDays}
                  onChange={(ev) => update(i, 'sickDays', Number(ev.target.value))}
                />
              </td>
              <td className="text-center">
                <input type="checkbox" checked={e.breach} onChange={(ev) => update(i, 'breach', ev.target.checked)} />
              </td>
              <td>
                <button onClick={() => remove(i)} className="text-red-500">
                  Slet
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={add}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tilføj medarbejder
      </button>
    </div>
  )
}
