import './App.css'

function App({ onNavigate }) {
  return (
    <div className="app-root">
      {/* ── Ambient Blobs ── */}
      <div className="app-blob app-blob-1" />
      <div className="app-blob app-blob-2" />
      <div className="app-blob app-blob-3" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">RealPreis</div>
          <ul className="nav-menu">
            <li><a href="#features">Wie es Funktioniert</a></li>
            <li><a href="#pricing">Im Deutschland</a></li>
            <li><a href="#contact">Unterstützung</a></li>
          </ul>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">Geld neu denken ✦</div>
          <h1 className="hero-title">
            Real<span className="hero-title-accent">Preis</span>
          </h1>
          <p className="hero-tagline">
            Hilft Ihnen dabei, Ihr Geld sinnvoll auszugeben.
          </p>
          <p className="hero-sub">Geld-zu-Arbeitszeit-Umrechner</p>

          <button className="cta-button" onClick={onNavigate}>
            <span>Ausprobieren</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Floating stat cards */}
        <div className="hero-float hero-float-1">
          <div className="float-label">☕ Kaffee</div>
          <div className="float-value">4,50 €</div>
          <div className="float-time">= 21 Minuten</div>
        </div>

        <div className="hero-float hero-float-2">
          <div className="float-label">👟 Sneaker</div>
          <div className="float-value">120 €</div>
          <div className="float-time">= 9,2 Stunden</div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="features" className="features">
        <div className="section-eyebrow">So einfach geht's</div>
        <h2 className="section-title">Wie es Funktioniert</h2>
        <p className="section-sub">Drei Schritte. Keine Ausreden mehr.</p>

        <div className="features-grid">
          {[
            {
              icon: '👤',
              step: '01',
              title: 'Wer bist du?',
              desc: 'Gib deinen Namen und deine Tätigkeit ein — FSJ, Ausbildung, Job, egal.'
            },
            {
              icon: '💶',
              step: '02',
              title: 'Dein Stundenlohn',
              desc: 'Was verdienst du netto pro Stunde? Wir rechnen für dich in Minuten um.'
            },
            {
              icon: '🧾',
              step: '03',
              title: 'Produkt eingeben',
              desc: 'Artikel und Preis — und du siehst sofort, wie viel Lebenszeit es kostet.'
            }
          ].map(({ icon, step, title, desc }) => (
            <div className="feature-card" key={step}>
              <div className="feature-step">{step}</div>
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <div className="features-cta">
          <button className="cta-button cta-outline" onClick={onNavigate}>
            Jetzt ausprobieren →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-brand">RealPreis</div>
        <p className="footer-copy">
         Made By Team RealPreis
         Aswin MJ, Anan Binoy, Alka Jijy, Jyothika Simon, Adithya & Krishnapriya
        </p>
        <p className="footer-tagline">
          Dein Geld. Deine Zeit. Deine Entscheidung.
        </p>
      </footer>
    </div>
  )
}

export default App