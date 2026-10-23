import React from 'react'

export default function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.055] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09] sm:p-5">
      <div className="flex items-center gap-2 text-sm text-slate-300"><Icon size={17} strokeWidth={1.7} /><span>{label}</span></div>
      <div className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</div>
      {detail && <div className="mt-1 text-xs text-slate-400">{detail}</div>}
    </div>
  )
}