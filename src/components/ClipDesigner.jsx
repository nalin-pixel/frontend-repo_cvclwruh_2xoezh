import { useMemo, useState } from 'react'

export default function ClipDesigner({ job }) {
  const [start, setStart] = useState(job?.detected_moments?.[0]?.start_sec ?? 0)
  const [end, setEnd] = useState(job?.detected_moments?.[0]?.end_sec ?? 10)
  const [text, setText] = useState('Teks highlight di sini')
  const [position, setPosition] = useState('bottom')
  const [style, setStyle] = useState('caption')
  const [animation, setAnimation] = useState('bounce')
  const [emoji, setEmoji] = useState('🔥')
  const [preview, setPreview] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const overlays = useMemo(() => [{ content: text, position, style }], [text, position, style])

  const render = async () => {
    const res = await fetch(`${backend}/api/clip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: job._id,
        start_sec: Number(start),
        end_sec: Number(end),
        overlays,
        animation,
        emoji
      })
    })
    const data = await res.json()
    setPreview(data)
  }

  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6 items-start">
        <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Desain Klip</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-blue-200">Mulai (detik)</label>
              <input type="number" value={start} onChange={e => setStart(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900/70 border border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs text-blue-200">Selesai (detik)</label>
              <input type="number" value={end} onChange={e => setEnd(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900/70 border border-white/10 text-white" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-blue-200">Teks</label>
              <input value={text} onChange={e => setText(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900/70 border border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs text-blue-200">Posisi</label>
              <select value={position} onChange={e => setPosition(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900/70 border border-white/10 text-white">
                <option value="top">Atas</option>
                <option value="center">Tengah</option>
                <option value="bottom">Bawah</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-blue-200">Gaya</label>
              <select value={style} onChange={e => setStyle(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900/70 border border-white/10 text-white">
                <option value="caption">Caption</option>
                <option value="title">Title</option>
                <option value="subtitle">Subtitle</option>
                <option value="emoji">Emoji</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-blue-200">Animasi</label>
              <select value={animation} onChange={e => setAnimation(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900/70 border border-white/10 text-white">
                <option value="bounce">Bounce</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="pop">Pop</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-blue-200">Emoji</label>
              <input value={emoji} onChange={e => setEmoji(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900/70 border border-white/10 text-white" />
            </div>
          </div>
          <button onClick={render} className="mt-4 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold">
            Buat Preview
          </button>
        </div>

        <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 min-h-[260px] flex items-center justify-center">
          {preview ? (
            <div className="w-full">
              <img src={preview.preview_url} alt="Preview" className="w-full rounded-xl border border-white/10" />
              <div className="mt-3 text-blue-200 text-sm">
                <p>Durasi: {preview.start_sec}s - {preview.end_sec}s</p>
                <p>Animasi: {preview.animation} {preview.emoji ? `• ${preview.emoji}` : ''}</p>
                <p>Overlay: {preview.overlays?.[0]?.content}</p>
              </div>
            </div>
          ) : (
            <p className="text-blue-200">Belum ada preview. Atur parameter dan klik Buat Preview.</p>
          )}
        </div>
      </div>
    </section>
  )
}
