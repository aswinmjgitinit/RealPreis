import { useState } from 'react';
import './Rechner.css';

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'Euro (DE)' },
  { code: 'INR', symbol: '₹', label: 'Rupie (IN)' },
  { code: 'USD', symbol: '$', label: 'Dollar (US)' },
  { code: 'GBP', symbol: '£', label: 'Pfund (UK)' },
  { code: 'CHF', symbol: '₣', label: 'Franken (CH)' },
];

function formatTime(minutes) {
  if (minutes < 1) {
    const secs = Math.round(minutes * 60);
    return { value: secs, unit: secs === 1 ? 'Sekunde' : 'Sekunden', raw: minutes };
  }
  if (minutes < 60) {
    const m = Math.round(minutes);
    return { value: m, unit: m === 1 ? 'Minute' : 'Minuten', raw: minutes };
  }
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return { value: h, unit: h === 1 ? 'Stunde' : 'Stunden', extra: m > 0 ? `${m} Min.` : null, raw: minutes };
}

function Rechner({ onBack }) {
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [hourlyWage, setHourlyWage] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState(null);

  const goToStep = (next) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 480);
  };

  const handleCalculate = () => {
    const wage = parseFloat(hourlyWage);
    const cost = parseFloat(price);
    if (!wage || !cost) return;
    const minutes = (cost / wage) * 60;
    setResult(formatTime(minutes));
    goToStep(4);
  };

  const reset = () => {
    setName('');
    setJob('');
    setHourlyWage('');
    setItem('');
    setPrice('');
    setResult(null);
    goToStep(1);
  };

  const selectedCurrency = currency;

  return (
    <div className="rechner-root">
      <nav className="navbar">
        <div className="nav-container">
          <button className="back-button" onClick={onBack}>← Startseite</button>
          <div className="nav-brand">RealPreis</div>
          <ul className="nav-menu">
            <li><a href="#features">Wie es Funktioniert</a></li>
            <li><a href="#pricing">Im Deutschland</a></li>
            <li><a href="#contact">Unterstützung</a></li>
          </ul>
        </div>
      </nav>

      <div className="rechner-stage">
        {/* Floating ambient blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Step progress */}
        <div className={`step-indicator ${animating ? 'fade-out' : 'fade-in'}`}>
          {[1, 2, 3].map(s => (
            <div key={s} className={`step-dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`} />
          ))}
        </div>

        {/* STEP 1 — Name & Job */}
        {step === 1 && (
          <div className={`card-panel ${animating ? 'slide-out' : 'slide-in'}`}>
            <div className="card-eyebrow">Schritt 1 von 3</div>
            <h2 className="card-title">Wer bist du?</h2>
            <p className="card-sub">Damit RealPreis persönlich mit dir sprechen kann.</p>

            <div className="input-group">
              <label>Dein Name</label>
              <input
                type="text"
                placeholder="z.B. Aswin MJ"
                value={name}
                onChange={e => setName(e.target.value)}
                className="rp-input"
                autoFocus
              />
            </div>

            <div className="input-group">
              <label>Deine Tätigkeit</label>
              <input
                type="text"
                placeholder="z.B. Hausmeister FSJ / Ausbildung"
                value={job}
                onChange={e => setJob(e.target.value)}
                className="rp-input"
              />
            </div>

            <button
              className="rp-next"
              disabled={!name.trim() || !job.trim()}
              onClick={() => goToStep(2)}
            >
              Weiter →
            </button>
          </div>
        )}

        {/* STEP 2 — Stundenlohn */}
        {step === 2 && (
          <div className={`card-panel ${animating ? 'slide-out' : 'slide-in'}`}>
            <div className="card-eyebrow">Schritt 2 von 3</div>
            <div className="card-persona">
              <span className="persona-name">{name}</span>
              <span className="persona-dot">·</span>
              <span className="persona-job">{job}</span>
            </div>
            <h2 className="card-title">Dein Stundenlohn</h2>
            <p className="card-sub">Was verdienst du pro Stunde (netto)?</p>

            <div className="wage-row">
              <div className="currency-select-wrap">
                <label>Währung</label>
                <div className="currency-pills">
                  {CURRENCIES.map(c => (
                    <button
                      key={c.code}
                      className={`currency-pill ${currency.code === c.code ? 'selected' : ''}`}
                      onClick={() => setCurrency(c)}
                    >
                      {c.symbol} {c.code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group wage-input-group">
                <label>Betrag pro Stunde</label>
                <div className="wage-input-wrap">
                  <span className="currency-badge">{selectedCurrency.symbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="13,00"
                    value={hourlyWage}
                    onChange={e => setHourlyWage(e.target.value)}
                    className="rp-input wage-num"
                  />
                  <span className="per-hour-label">/ Std.</span>
                </div>
              </div>
            </div>

            {hourlyWage && (
              <div className="wage-preview">
                💡 Du verdienst <strong>{selectedCurrency.symbol}{(parseFloat(hourlyWage) / 60).toFixed(2)}</strong> pro Minute.
              </div>
            )}

            <button
              className="rp-next"
              disabled={!hourlyWage || parseFloat(hourlyWage) <= 0}
              onClick={() => goToStep(3)}
            >
              Weiter →
            </button>
          </div>
        )}

        {/* STEP 3 — Was kaufst du? */}
        {step === 3 && (
          <div className={`card-panel ${animating ? 'slide-out' : 'slide-in'}`}>
            <div className="card-eyebrow">Schritt 3 von 3</div>
            <div className="card-persona">
              <span className="persona-name">{name}</span>
              <span className="persona-dot">·</span>
              <span className="persona-job">{job}</span>
              <span className="persona-dot">·</span>
              <span className="persona-wage">{selectedCurrency.symbol}{hourlyWage}/Std.</span>
            </div>
            <h2 className="card-title">Was willst du kaufen?</h2>
            <p className="card-sub">Gib den Artikel und seinen Preis ein.</p>

            <div className="input-group">
              <label>Artikel / Produkt</label>
              <div className="quick-pills">
                {['☕ Kaffee', '🍕 Pizza', '👟 Sneaker', '📱 Handy', '🎟 Kino'].map(q => (
                  <button
                    key={q}
                    className={`quick-pill ${item === q.replace(/^\S+\s/, '') ? 'selected' : ''}`}
                    onClick={() => setItem(q.replace(/^\S+\s/, ''))}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="oder eigenen Artikel eingeben..."
                value={item}
                onChange={e => setItem(e.target.value)}
                className="rp-input"
              />
            </div>

            <div className="input-group">
              <label>Preis ({selectedCurrency.code})</label>
              <div className="wage-input-wrap">
                <span className="currency-badge">{selectedCurrency.symbol}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="4,50"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="rp-input wage-num"
                />
              </div>
            </div>

            <button
              className="rp-next rp-cta"
              disabled={!item.trim() || !price || parseFloat(price) <= 0}
              onClick={handleCalculate}
            >
              Zeig mir, was ich ausgebe ✦
            </button>
          </div>
        )}

        {/* STEP 4 — Ergebnis */}
        {step === 4 && result && (
          <div className={`card-panel result-panel ${animating ? 'slide-out' : 'slide-in'}`}>
            <div className="result-eyebrow">Dein RealPreis</div>
            <div className="result-persona">
              {name} · {job}
            </div>

            <div className="result-item-label">
              <span className="result-item-name">„{item}"</span>
              <span className="result-price-tag">{selectedCurrency.symbol}{parseFloat(price).toFixed(2)}</span>
            </div>

            <div className="result-equals">kostet dich wirklich</div>

            <div className="result-time-big">
              <span className="result-time-value">{result.value}</span>
              <span className="result-time-unit">{result.unit}</span>
              {result.extra && <span className="result-time-extra">+ {result.extra}</span>}
            </div>
            <div className="result-sub">deiner Arbeitszeit</div>

            <div className="result-bar-wrap">
              <div className="result-bar">
                <div
                  className="result-bar-fill"
                  style={{ width: `${Math.min(100, (result.raw / 480) * 100)}%` }}
                />
              </div>
              <div className="result-bar-label">
                {result.raw < 480
                  ? `${Math.round((result.raw / 480) * 100)}% eines 8-Stunden-Tages`
                  : `Mehr als ein ganzer Arbeitstag!`}
              </div>
            </div>

            <div className="result-wisdom">
              {result.raw < 5
                ? '✅ Klingt fair — gönn es dir!'
                : result.raw < 30
                ? '🤔 Überlege kurz, ob es sich lohnt.'
                : result.raw < 120
                ? '⚠️ Das ist ein erheblicher Teil deiner Zeit.'
                : '🚨 Bist du dir wirklich sicher?'}
            </div>

            <div className="result-actions">
              <button className="rp-next rp-reset" onClick={reset}>
                Neues Produkt berechnen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rechner;
