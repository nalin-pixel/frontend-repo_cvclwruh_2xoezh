import { useState } from 'react'
import Hero from './components/Hero'
import Analyzer from './components/Analyzer'
import ClipDesigner from './components/ClipDesigner'

function App() {
  const [job, setJob] = useState(null)

  // We will lift state from Analyzer by intercepting fetch, but to keep simple, we let user copy moments.
  // Provide a simple prop handoff via custom event pattern using window, to avoid over-coupling.
  if (typeof window !== 'undefined' && !window.__setJobFromAnalyzer) {
    window.__setJobFromAnalyzer = (j) => setJob(j)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white">
      <Hero />
      <Analyzer />
      {/* Hint to connect analyzer result to designer */}
      <HintConnector />
      {job && <ClipDesigner job={job} />}
    </div>
  )
}

function HintConnector(){
  const [hasJob, setHasJob] = useState(false)
  if (typeof window !== 'undefined') {
    window.addEventListener('message', (e) => {
      if (e?.data?.type === 'job'){ setHasJob(true) }
    })
  }
  return (
    <div className="max-w-4xl mx-auto px-6">
      {!hasJob && (
        <div className="mt-6 bg-blue-500/10 border border-blue-400/20 text-blue-200 rounded-2xl p-4">
          Setelah analisis, pembuat klip akan muncul di bawah untuk mengatur teks, animasi, dan emoji.
        </div>
      )}
    </div>
  )
}

export default App
