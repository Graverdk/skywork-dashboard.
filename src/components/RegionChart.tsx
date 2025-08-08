import React from 'react'
import { EmployeeResult } from '../types'

interface Props {
  data: EmployeeResult[]
}

export default function RegionChart({ data }: Props) {
  const globalRecharts = (window as any).Recharts
  if (globalRecharts) {
    const { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar, YAxis } = globalRecharts
    return (
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={data.map((r) => ({ name: r.employee.name, bonus: r.total }))}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bonus" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
  const max = Math.max(...data.map((r) => r.total), 1)
  return (
    <div className="space-y-1">
      {data.map((r) => (
        <div
          key={r.employee.name}
          className="bg-blue-500 text-white"
          style={{ width: `${(r.total / max) * 100}%` }}
        >
          {r.employee.name}: {r.total.toFixed(0)}
        </div>
      ))}
    </div>
  )
}
