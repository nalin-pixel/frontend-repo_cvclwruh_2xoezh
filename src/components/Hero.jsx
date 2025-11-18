import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/ezRAY9QD27kiJcur/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-sm backdrop-blur border border-white/10">
          ✨ AI Video Clipper
        </span>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Edit video otomatis dengan AI
        </h1>
        <p className="mt-4 text-blue-200 text-lg md:text-xl max-w-3xl mx-auto">
          Temukan momen penting dari link YouTube, tambah teks, animasi, dan emoji — dalam hitungan detik.
        </p>
      </div>
    </section>
  )
}
