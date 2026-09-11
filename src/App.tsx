import { Routes, Route, Link } from 'react-router-dom'
import AnaSayfa from './AnaSayfa'
import RoadmapDetay from './RoadmapDetay'
import AkisGorunumu from './AkisGorunumu'
import RoadmapAcik from './RoadmapAcik'
import KayitOl from './KayitOl'
import GirisYap from './GirisYap'
import { useTemaStore } from './temaStore'
import { useKullaniciStore } from './kullaniciStore'

function App() {
  const tema = useTemaStore((state) => state.tema);
  const temaDegistir = useTemaStore((state) => state.temaDegistir);
  const kullanici = useKullaniciStore((state) => state.kullanici);
  const cikisYap = useKullaniciStore((state) => state.cikisYap);

  return (
    <div className={tema === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">

        <header className="sticky top-0 z-10 backdrop-blur bg-stone-50/80 dark:bg-stone-950/80 border-b border-stone-200 dark:border-stone-800">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-display font-semibold text-sm group-hover:opacity-80 transition">
                    R
                  </div>
                  <span className="font-display font-semibold text-lg text-stone-900 dark:text-stone-100 group-hover:text-[var(--accent)] transition">
                    Roadmaps
                  </span>
            </Link>

            <div className="flex items-center gap-3">
              {kullanici ? (
                <>
                  <span className="text-sm text-stone-500 dark:text-stone-400 hidden sm:inline">
                    Merhaba, {kullanici.ad}
                  </span>
                  <button
                    onClick={cikisYap}
                    className="text-sm text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link to="/giris" className="text-sm text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition">
                    Giriş Yap
                  </Link>
                  <Link to="/kayit-ol" className="text-sm text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition">
                    Kayıt Ol
                  </Link>
                </>
              )}

              <button
                onClick={temaDegistir}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                aria-label="Tema değiştir"
              >
                {tema === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<AnaSayfa />} />
            <Route path="/roadmap/:id" element={<RoadmapDetay />} />
            <Route path="/akis/:id" element={<AkisGorunumu />} />
            <Route path="/ac/:id" element={<RoadmapAcik />} />
            <Route path="/kayit-ol" element={<KayitOl />} />
            <Route path="/giris" element={<GirisYap />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App