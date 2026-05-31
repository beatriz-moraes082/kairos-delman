/* global React, Eyebrow, KairosLockup, KMark, ImgPlaceholder, Cross */
// Sections 1: Nav, Hero, Intro, Stats

const { useState: useState1, useEffect: useEffect1 } = React;

/* ------------------------------------------------------------------ */
/* Nav, sticky, scroll-spy                                            */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { id: 'edificio', label: 'Edifício' },
  { id: 'plantas',  label: 'Plantas' },
  { id: 'galeria',  label: 'Galeria' },
  { id: 'local',    label: 'Localização' },
  { id: 'contato',  label: 'Contato' },
];

function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState1(false);
  useEffect1(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="nav"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
        background: scrolled ? 'rgba(239,235,227,0.82)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 240ms var(--ease-out)',
      }}
    >
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
        gap: 24,
      }}>
        <div style={{
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 220ms var(--ease-out)',
          pointerEvents: scrolled ? 'auto' : 'none',
        }}>
          <KairosLockup compact />
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-links">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: activeSection === item.id ? 'var(--accent)' : 'var(--fg-2)',
                textDecoration: 'none',
                borderBottom: 'none',
                padding: '8px 12px',
                borderRadius: 4,
                position: 'relative',
                transition: 'color 140ms var(--ease-out)',
                letterSpacing: '-0.005em',
              }}
            >
              {item.label}
              {activeSection === item.id && (
                <span style={{
                  position: 'absolute',
                  left: 12, right: 12, bottom: 2,
                  height: 1,
                  background: 'var(--accent)',
                }}/>
              )}
            </a>
          ))}
        </nav>

        <a
          href="#contato"
          className="btn btn--sm"
          style={{ borderBottom: 'none' }}
        >
          Agendar visita
          <span className="arrow">→</span>
        </a>
      </div>
      <style>{`
        @media (max-width: 920px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */
function Hero({ variant = 'scrollytell' }) {
  if (variant === 'scrollytell') return <HeroScrollytell />;
  if (variant === 'split')      return <HeroSplit />;
  if (variant === 'fullbleed')  return <HeroFullbleed />;
  if (variant === 'editorial')  return <HeroEditorial />;
  return <HeroWordmark />;
}

/* Default, giant Kairós wordmark dominating + soft render behind */
function HeroWordmark() {
  return (
    <section
      id="top"
      className="hero hero--wordmark"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--bg-1)',
        paddingTop: 88,
        paddingBottom: 56,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top label band */}
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 24,
        marginTop: 16,
        marginBottom: 32,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="t-eyebrow">
            <span style={{ color: 'var(--fg-3)' }}>Residencial em</span>
          </span>
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--fg-1)' }}>
            Jatiúca · Maceió
          </span>
          <span style={{ fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.04em' }}>
            Entregue em 2025
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 14px',
          background: 'var(--accent)',
          color: 'var(--fg-on-accent)',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          borderRadius: 999,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#fff', boxShadow: '0 0 0 4px rgba(255,255,255,0.25)',
          }}/>
          Pronto para morar
        </div>
      </div>

      {/* The wordmark, fills the canvas */}
      <div style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 var(--gutter)',
      }}>
        {/* Building render behind, faintly */}
        <div style={{
          position: 'absolute',
          right: '6%',
          top: '4%',
          bottom: '8%',
          width: 'clamp(180px, 22vw, 380px)',
          opacity: 0.95,
          zIndex: 1,
        }}>
          <BuildingFacade />
        </div>

        <h1 className="wordmark reveal in" style={{
          fontSize: 'clamp(120px, 26vw, 420px)',
          color: 'var(--fg-1)',
          position: 'relative',
          zIndex: 2,
          margin: 0,
          textAlign: 'center',
          width: '100%',
        }}>
          Kair<span style={{ color: 'var(--accent)' }}>ó</span>s
        </h1>

        {/* Tiny watermark date / version */}
        <div style={{
          position: 'absolute',
          left: 'var(--gutter)',
          top: 0,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontSize: 10,
          letterSpacing: '0.3em',
          color: 'var(--fg-3)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-sans)',
        }}>
          Edifício · 2025 · MCZ-AL
        </div>
      </div>

      {/* Bottom label rail */}
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: 32,
        alignItems: 'end',
        marginTop: 40,
        paddingTop: 24,
        borderTop: '1px solid var(--border)',
      }}>
        <div className="reveal in" style={{ maxWidth: 360 }}>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--fg-2)' }}>
            Rua Aureliano Teixeira de Vasconcelos, 57 · Jatiúca<br/>
            <span style={{ color: 'var(--fg-3)' }}>3 quartos · 87 a 149 m² · Cinco minutos da praia</span>
          </p>
        </div>

        <a href="#plantas" className="btn btn--accent btn--lg" style={{ borderBottom: 'none' }}>
          Escolher unidade
          <span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
}

/* Building facade SVG, placeholder render with architectural feel */
function BuildingFacade() {
  return (
    <svg viewBox="0 0 200 380" preserveAspectRatio="xMidYMax meet"
         style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DEC6"/>
          <stop offset="100%" stopColor="#D9CCB0"/>
        </linearGradient>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5EEDE"/>
          <stop offset="100%" stopColor="#D8C9A7"/>
        </linearGradient>
        <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3530" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#5A4F47" stopOpacity="0.35"/>
        </linearGradient>
      </defs>
      {/* sky */}
      <rect x="0" y="0" width="200" height="380" fill="url(#sky)"/>
      {/* building tower */}
      <rect x="40" y="40" width="120" height="320" fill="url(#bldg)"/>
      {/* side wing */}
      <rect x="20" y="120" width="22" height="240" fill="#C5B58F" opacity="0.85"/>
      {/* windows grid (varanda openings) */}
      {Array.from({ length: 12 }).map((_, row) => (
        Array.from({ length: 4 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={50 + col * 28}
            y={56 + row * 24}
            width="22"
            height="16"
            fill="url(#window)"
            stroke="#A99B7B"
            strokeWidth="0.4"
          />
        ))
      ))}
      {/* rooftop accent */}
      <rect x="40" y="36" width="120" height="6" fill="#982532"/>
      {/* ground / palms suggestion */}
      <rect x="0" y="360" width="200" height="20" fill="#9AA784"/>
      {/* palm-tree stylized */}
      <g opacity="0.6">
        <rect x="170" y="280" width="2" height="80" fill="#5A4F47"/>
        <path d="M171 280 Q 160 270 152 274 M171 280 Q 182 268 192 272 M171 282 Q 160 286 148 280 M171 282 Q 182 286 196 282"
              stroke="#5A6B4E" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </g>
      {/* foreground tint */}
      <rect x="0" y="356" width="200" height="2" fill="#7A1C26" opacity="0.3"/>
    </svg>
  );
}

/* Variation: split */
function HeroSplit() {
  return (
    <section id="top" className="hero hero--split section" style={{
      paddingTop: 120,
      paddingBottom: 'var(--space-9)',
      minHeight: '100vh',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        gap: 'clamp(32px, 5vw, 80px)',
        alignItems: 'center',
      }}>
        <div style={{ height: 'min(72vh, 640px)' }}>
          <ImgPlaceholder subject="Edifício Kairós · fachada" tone="sand" ratio="3/4"
                          src="imagens/hero-torre.jpg" alt="Edifício Kairós visto do alto, em Jatiúca"
                          style={{ height: '100%', width: '100%' }}>
            Edifício Kairós · fachada
          </ImgPlaceholder>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Eyebrow index="00">Residencial Kairós · Jatiúca</Eyebrow>
          <h1 className="wordmark" style={{
            fontSize: 'clamp(80px, 11vw, 180px)',
            color: 'var(--fg-1)',
            margin: 0,
            letterSpacing: '-0.03em',
            lineHeight: 0.86,
          }}>
            Kair<span style={{ color: 'var(--accent)' }}>ó</span>s
          </h1>
          <p className="t-body-lg" style={{ color: 'var(--fg-2)', maxWidth: 480 }}>
            Cinco tipologias de 3 quartos, de 87 a 149 m². A cinco minutos da praia de Jatiúca, com lazer completo e chaves na hora.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <a href="#plantas" className="btn btn--accent" style={{ borderBottom: 'none' }}>
              Escolher unidade <span className="arrow">→</span>
            </a>
            <a href="#contato" className="btn btn--ghost" style={{ borderBottom: 'none' }}>
              Agendar visita
            </a>
          </div>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)',
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              ['87–149', 'm²'],
              ['3', 'quartos'],
              ['5min', 'da praia'],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--fg-1)' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Variation: fullbleed */
function HeroFullbleed() {
  return (
    <section id="top" style={{ position: 'relative', minHeight: '100vh', color: '#fff', overflow: 'hidden' }}>
      <ImgPlaceholder subject="Vista do edifício" tone="dark" ratio="auto"
                      src="imagens/hero-mar.jpg" alt="Jatiúca e o mar de Maceió, onde fica o Edifício Kairós"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 0 }}>
        Vista do edifício ao entardecer
      </ImgPlaceholder>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(26,22,18,.45) 0%, rgba(26,22,18,.15) 40%, rgba(26,22,18,.75) 100%)',
        zIndex: 1,
      }}/>
      <div className="container" style={{
        position: 'relative', zIndex: 2,
        paddingTop: 120, paddingBottom: 64,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div>
          <img src="imagens/brand-lockup.png" alt="Delman · Edifício Kairós"
               style={{
                 width: 'clamp(230px, 40vw, 430px)',
                 height: 'auto', display: 'block',
                 filter: 'drop-shadow(0 6px 28px rgba(0,0,0,0.55))',
               }}/>
          <Eyebrow style={{ color: 'rgba(255,255,255,0.85)', marginTop: 28 }}>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Jatiúca · Maceió · Pronto para morar</span>
          </Eyebrow>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <a href="#plantas" className="btn btn--accent btn--lg" style={{ borderBottom: 'none' }}>
              Escolher unidade <span className="arrow">→</span>
            </a>
            <a href="#contato" className="btn btn--light btn--lg" style={{ borderBottom: 'none' }}>
              Agendar visita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Variation: editorial */
function HeroEditorial() {
  return (
    <section id="top" className="section" style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <Eyebrow index="00">Edifício Kairós · 2025</Eyebrow>
            <h1 className="wordmark" style={{
              fontSize: 'clamp(110px, 18vw, 280px)',
              margin: '32px 0 32px',
              color: 'var(--fg-1)',
              lineHeight: 0.84,
            }}>
              Kair<span style={{ color: 'var(--accent)' }}>ó</span>s
            </h1>
            <p className="t-quote" style={{ maxWidth: 540, marginTop: 16 }}>
              O momento certo de morar bem<br/>é agora.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 80 }}>
            <ImgPlaceholder subject="Varanda Kairós" tone="cream" ratio="4/5"
                            src="imagens/gourmet.jpg" alt="Espaço gourmet do Edifício Kairós"
                            style={{ width: '100%' }}>Varanda gourmet</ImgPlaceholder>
            <div>
              <p className="t-body" style={{ color: 'var(--fg-2)', maxWidth: 320 }}>
                Rua Aureliano Teixeira de Vasconcelos, 57 · Jatiúca · 3 quartos · 87 a 149 m² · A cinco minutos da praia.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <a href="#plantas" className="btn btn--accent" style={{ borderBottom: 'none' }}>
                  Escolher unidade <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* INTRO                                                               */
/* ------------------------------------------------------------------ */
function Intro() {
  return (
    <section className="section" style={{ paddingTop: 'var(--space-9)', paddingBottom: 'var(--space-8)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.9fr',
          gap: 'clamp(32px, 5vw, 72px)',
          alignItems: 'center',
        }} className="intro-grid">
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <Eyebrow>O Edifício Kairós</Eyebrow>
            <p className="t-body-lg" style={{ color: 'var(--fg-2)', maxWidth: 560 }}>
              Empreendimento já entregue a cinco minutos da Praia de Jatiúca, com
              apartamentos amplos com até 3 suítes, lazer completo, parcelamento em
              qualquer banco ou em até 100 meses, direto com a{' '}
              <strong style={{ color: 'var(--accent)', fontWeight: 700 }}>Construtora Delman</strong>.
            </p>
            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 24 }}>
              <h2 className="t-display-2" style={{ color: 'var(--fg-1)', lineHeight: 1.05 }}>
                Qualidade de quem constrói há <span className="t-serif" style={{ color: 'var(--accent)' }}>40 anos</span> em Maceió.
              </h2>
            </div>
          </div>
          <div className="reveal reveal--delay-1">
            <ImgPlaceholder subject="Construtora Delman" tone="sand" ratio="4/5"
                            src="imagens/construtora-delman.jpg"
                            alt="Fundador da Construtora Delman"
                            style={{ width: '100%' }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .intro-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* STATS, ficha rápida                                                */
/* ------------------------------------------------------------------ */
function Stats() {
  const rows = [
    { label: 'Tipologia',    main: '3 quartos',         sub: '87 a 149 m²' },
    { label: 'Localização',  main: '5 min',             sub: 'da praia de Jatiúca' },
    { label: 'Status',       main: 'Pronto',            sub: 'Entrega imediata' },
    { label: 'Construtora',  main: '40 anos',           sub: 'Delman, em Maceió' },
  ];
  return (
    <section className="section" style={{
      paddingTop: 'var(--space-7)',
      paddingBottom: 'var(--space-9)',
    }}>
      <div className="container">
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          borderTop: '1px solid var(--fg-1)',
          borderBottom: '1px solid var(--border)',
        }}>
          {rows.map((r, i) => (
            <div key={r.label} className="reveal" style={{
              padding: '24px 24px 28px',
              borderRight: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', flexDirection: 'column', gap: 12,
              transitionDelay: `${i * 80}ms`,
            }}>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--fg-3)',
                fontWeight: 500,
              }}>{r.label}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(28px, 3.4vw, 48px)',
                color: 'var(--fg-1)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>{r.main}</div>
              <div className="t-serif" style={{ fontSize: 14, color: 'var(--fg-2)' }}>
                {r.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div:nth-child(2n) { border-right: none !important; }
          .stats-grid > div:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </section>
  );
}

Object.assign(window, { Nav, Hero, Intro, Stats, NAV_ITEMS });
