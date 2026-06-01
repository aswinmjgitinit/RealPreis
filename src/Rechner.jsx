import { useState } from 'react';
import './Rechner.css';

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'Euro (DE)' },
  { code: 'USD', symbol: '$', label: 'Dollar (US)' },
  { code: 'GBP', symbol: '£', label: 'Pfund (UK)' },
  { code: 'CHF', symbol: '₣', label: 'Franken (CH)' },
];

const HOURS_PER_DAY = [8, 9, 10, 11];

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

// Monatslohn + Std/Tag → Stundenlohn
// Formula: monatslohn / (stunden_pro_tag * 5 * 52 / 12)
function calcHourlyFromMonthly(monthly, hoursPerDay) {
  const monthlyHours = (hoursPerDay * 5 * 52) / 12;
  return monthly / monthlyHours;
}

function Rechner({ onBack }) {
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  // profile
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [profileLocked, setProfileLocked] = useState(false);

  // wage mode: 'monthly' | 'hourly'
  const [wageMode, setWageMode] = useState('monthly');
  const [monthlyWage, setMonthlyWage] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(null); // null = not selected
  const [directHourly, setDirectHourly] = useState('');

  // computed hourly (what the rest of the app uses)
  const [hourlyWage, setHourlyWage] = useState('');

  // per-calculation
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

  // Live preview of computed hourly rate for monthly mode
  const computedHourly = wageMode === 'monthly' && monthlyWage && hoursPerDay
    ? calcHourlyFromMonthly(parseFloat(monthlyWage), hoursPerDay)
    : wageMode === 'hourly' && directHourly
    ? parseFloat(directHourly)
    : null;

  const step2Valid = wageMode === 'monthly'
    ? (monthlyWage && parseFloat(monthlyWage) > 0 && hoursPerDay !== null)
    : (directHourly && parseFloat(directHourly) > 0);

  const handleStep2Next = () => {
    const h = wageMode === 'monthly'
      ? calcHourlyFromMonthly(parseFloat(monthlyWage), hoursPerDay).toFixed(4)
      : parseFloat(directHourly).toFixed(4);
    setHourlyWage(h);
    setProfileLocked(true);
    goToStep(3);
  };

  const handleCalculate = () => {
    const wage = parseFloat(hourlyWage);
    const cost = parseFloat(price);
    if (!wage || !cost) return;
    const minutes = (cost / wage) * 60;
    setResult(formatTime(minutes));
    goToStep(4);
  };

  const resetToProduct = () => {
    setItem('');
    setPrice('');
    setResult(null);
    goToStep(3);
  };

  const changeWage = () => {
    goToStep(2);
  };

  const showDots = step <= 3;

  // display wage in persona pill — show monthly if monthly mode, else hourly
  const personaWageDisplay = wageMode === 'monthly' && monthlyWage
    ? `${currency.symbol}${parseFloat(monthlyWage).toFixed(0)}/Mo.`
    : `${currency.symbol}${parseFloat(hourlyWage).toFixed(2)}/Std.`;

  return (
    <div className="rechner-root">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <button className="back-button" onClick={onBack}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Startseite
            </button>
          </div>
          <div className="nav-brand">RealPreis</div>
          <div className="nav-right">
            <ul className="nav-menu">
              <li><a href="#features">Wie es Funktioniert</a></li>
              <li><a href="#pricing">Im Deutschland</a></li>
              <li><a href="#contact">Unterstützung</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="rechner-stage">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {showDots && (
          <div className={`step-indicator ${animating ? 'fade-out' : 'fade-in'}`}>
            {[1, 2, 3].map(s => (
              <div key={s} className={`step-dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`} />
            ))}
          </div>
        )}

        {/* ── STEP 1 — Name & Job ── */}
        {step === 1 && (
          <div className={`card-panel ${animating ? 'slide-out' : 'slide-in'}`}>
            <div className="card-eyebrow">Schritt 1 von 3</div>
            <h2 className="card-title">Wer bist du?</h2>
            <p className="card-sub">Damit RealPreis persönlich mit dir sprechen kann.</p>

            <div className="input-group">
              <label>Dein Name</label>
              <input
                type="text"
                placeholder="z.B. Steve Harrington"
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
                placeholder="z.B. FSJ / Ausbildung / Arbeit"
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

        {/* ── STEP 2 — Lohn ── */}
        {step === 2 && (
          <div className={`card-panel ${animating ? 'slide-out' : 'slide-in'}`}>
            <div className="card-eyebrow">Schritt 2 von 3</div>
            <div className="card-persona">
              <span className="persona-name">{name}</span>
              <span className="persona-dot">·</span>
              <span className="persona-job">{job}</span>
            </div>
            <h2 className="card-title">Dein Lohn</h2>
            <p className="card-sub">Wie wirst du bezahlt?</p>

            {/* Mode toggle */}
            <div className="wage-mode-toggle">
              <button
                className={`wage-mode-btn ${wageMode === 'monthly' ? 'active' : ''}`}
                onClick={() => setWageMode('monthly')}
              >
                💶 Monatslohn
              </button>
              <button
                className={`wage-mode-btn ${wageMode === 'hourly' ? 'active' : ''}`}
                onClick={() => setWageMode('hourly')}
              >
                ⏱ Stundenlohn
              </button>
            </div>

            {/* Currency */}
            <div className="input-group" style={{ marginTop: '1.4rem' }}>
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

            {/* Monthly mode */}
            {wageMode === 'monthly' && (
              <>
                <div className="input-group">
                  <label>Betrag pro Monat</label>
                  <div className="wage-input-wrap">
                    <span className="currency-badge">{currency.symbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      placeholder="620"
                      value={monthlyWage}
                      onChange={e => setMonthlyWage(e.target.value)}
                      className="rp-input wage-num"
                    />
                    <span className="per-hour-label">/ Mo.</span>
                  </div>
                </div>

                <div className="input-group">
                  <label>Stunden pro Tag</label>
                  <div className="hours-pills">
                    {HOURS_PER_DAY.map(h => (
                      <button
                        key={h}
                        className={`hours-pill ${hoursPerDay === h ? 'selected' : ''}`}
                        onClick={() => setHoursPerDay(h)}
                      >
                        {h} Std.
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Hourly mode */}
            {wageMode === 'hourly' && (
              <div className="input-group">
                <label>Betrag pro Stunde</label>
                <div className="wage-input-wrap">
                  <span className="currency-badge">{currency.symbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="13,00"
                    value={directHourly}
                    onChange={e => setDirectHourly(e.target.value)}
                    className="rp-input wage-num"
                  />
                  <span className="per-hour-label">/ Std.</span>
                </div>
              </div>
            )}

            {/* Live preview */}
            {computedHourly !== null && computedHourly > 0 && (
              <div className="wage-preview">
                💡 Das sind <strong>{currency.symbol}{computedHourly.toFixed(2)}</strong> pro Stunde
                {' '}→ <strong>{currency.symbol}{(computedHourly / 60).toFixed(2)}</strong> pro Minute.
              </div>
            )}

            <button
              className="rp-next"
              disabled={!step2Valid}
              onClick={handleStep2Next}
            >
              Weiter →
            </button>
          </div>
        )}

        {/* ── STEP 3 — Was kaufst du? ── */}
        {step === 3 && (
          <div className={`card-panel ${animating ? 'slide-out' : 'slide-in'}`}>
            <div className="card-eyebrow">
              {profileLocked ? 'Neue Berechnung' : 'Schritt 3 von 3'}
            </div>
            <div className="card-persona">
              <span className="persona-name">{name}</span>
              <span className="persona-dot">·</span>
              <span className="persona-job">{job}</span>
              <span className="persona-dot">·</span>
              <span className="persona-wage">{personaWageDisplay}</span>
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
              <label>Preis ({currency.code})</label>
              <div className="wage-input-wrap">
                <span className="currency-badge">{currency.symbol}</span>
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

            {profileLocked && (
              <button className="rp-next rp-ghost" onClick={changeWage}>
                Stundenlohn ändern
              </button>
            )}
          </div>
        )}

        {/* ── STEP 4 — Ergebnis ── */}
        {step === 4 && result && (
          <div className={`card-panel result-panel ${animating ? 'slide-out' : 'slide-in'}`}>
            <div className="result-eyebrow">Dein RealPreis</div>
            <div className="result-persona">{name} · {job}</div>

            <div className="result-item-label">
              <span className="result-item-name">„{item}"</span>
              <span className="result-price-tag">{currency.symbol}{parseFloat(price).toFixed(2)}</span>
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
              <button className="rp-next rp-reset" onClick={resetToProduct}>
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
