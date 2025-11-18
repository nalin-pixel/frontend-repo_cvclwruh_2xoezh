import { useState, useEffect } from 'react'

export default function Analyzer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [job, setJob] = useState(null)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (job) {
      // expose to App for ClipDesigner
      if (window.__setJobFromAnalyzer) window.__setJobFromAnalyzer(job)
      window.postMessage({ type: 'job', payload: job }, '*')
    }
  }, [job])

  const analyze = async (e) => {
    e.preventDefault()
    setError('')
    setJob(null)
    if (!url) {
      setError('Masukkan link YouTube terlebih dahulu')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_url: url })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Gagal menganalisis video')
      const data = await res.json()
      // normalize id for frontend usage
      const normalized = { ...data, _id: data.id || data._id }
      setJob(normalized)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative z-10 -mt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <form onSubmit={analyze} className="bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-4 md:p-6 shadow-xl">
          <label className="block text-sm text-blue-200 mb-2">Tempel link YouTube</label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900/70 border border-white/10 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Menganalisis...' : 'Cari Momen Penting'}
            </button>
          </div>
          {error && <p className="mt-3 text-red-300 text-sm">{error}</p>}
        </form>

        {job && (
          <div className="mt-6 bg-slate-800/60 backdrop-blur rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-3">Momen terdeteksi</h3>
            <ul className="space-y-3">
              {job.detected_moments?.map((m, i) => (
                <li key={i} className="flex items-center justify-between bg-slate-900/60 border border-white/10 rounded-xl p-3">
                  <div>
                    <p className="text-white font-medium">{m.label}</p>
                    <p className="text-xs text-blue-200/70">{m.start_sec}s - {m.end_sec}s • conf {Math.round(m.confidence*100)}%</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
