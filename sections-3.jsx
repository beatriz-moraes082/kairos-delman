/* global React, Eyebrow, ImgPlaceholder, Cross */
// Sections 3: Galeria, Localização, Sustentabilidade

const { useState: useState3, useEffect: useEffect3, useRef: useRef3 } = React;

/* ------------------------------------------------------------------ */
/* GALERIA, lightbox grid                                             */
/* ------------------------------------------------------------------ */
const GALLERY = [
  { caption: 'Espaço gourmet',       tone: 'sand',    ratio: '4/5', src: 'imagens/gourmet.jpg' },
  { caption: 'Academia',             tone: 'dark',    ratio: '1/1', src: 'imagens/academia.jpg' },
  { caption: 'Piscina',              tone: 'water',   ratio: '4/5', src: 'imagens/piscina.jpg' },
  { caption: 'Lounge',               tone: 'dark',    ratio: '1/1', src: 'imagens/lounge.jpg' },
  { caption: 'Quadra poliesportiva', tone: 'foliage', ratio: '4/5', src: 'imagens/quadra.jpg' },
  { caption: 'Vista da torre',       tone: 'sand',    ratio: '4/3', src: 'imagens/hero-torre.jpg' },
  { caption: 'Jatiúca · vista aérea', tone: 'dark',   ratio: '4/3', src: 'imagens/localizacao-aerea.jpg' },
];

function Galeria() {
  const [open, setOpen] = useState3(-1);

  useEffect3(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      else if (e.key === 'ArrowRight') setOpen(i => (i + 1) % GALLERY.length);
      else if (e.key === 'ArrowLeft')  setOpen(i => (i - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <section id="galeria" data-screen-label="Galeria" className="section">
      <div className="container">
        <div className="section-head">
          <div className="reveal">
            <Eyebrow>Galeria e lazer</Eyebrow>
            <h2 className="t-display-2" style={{ marginTop: 16 }}>
              Mais de 30 espaços<br/>
              <span className="t-serif" style={{ color: 'var(--accent)' }}>para não querer sair.</span>
            </h2>
          </div>
          <aside className="reveal reveal--delay-1" style={{ color: 'var(--fg-2)', display: 'flex', alignItems: 'end' }}>
            <p style={{ fontSize: 14, maxWidth: 360, color: 'var(--fg-3)' }}>
              Lazer completo, pronto para visita no stand. Toque em qualquer imagem para ampliar.
            </p>
          </aside>
        </div>

        {/* Asymmetric masonry-like grid */}
        <div className="gal-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 16,
        }}>
          {GALLERY.map((g, i) => {
            const span = GAL_LAYOUT[i] || { col: 4, row: 1, ratio: g.ratio };
            return (
              <button
                key={i}
                onClick={() => setOpen(i)}
                className="reveal"
                style={{
                  gridColumn: `span ${span.col}`,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  transitionDelay: `${i * 50}ms`,
                  overflow: 'hidden',
                  borderRadius: 4,
                }}
              >
                <div style={{
                  transition: 'transform 600ms var(--ease-out)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <ImgPlaceholder
                    subject={g.caption}
                    tone={g.tone}
                    ratio={span.ratio}
                    src={g.src}
                    alt={g.caption + ' · Edifício Kairós'}
                    style={{ width: '100%' }}
                  >
                    {g.caption}
                  </ImgPlaceholder>
                </div>
                <div style={{
                  position: 'absolute',
                  left: 14, bottom: 14,
                  padding: '6px 10px',
                  background: 'rgba(43,38,34,0.78)',
                  color: 'var(--k-cream)',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 3,
                }}>
                  {String(i + 1).padStart(2, '0')} · {g.caption}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {open >= 0 && (
        <div
          onClick={() => setOpen(-1)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26,22,18,0.92)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(16px, 4vw, 56px)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 240ms var(--ease-out)',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(-1); }}
            style={{
              position: 'absolute', top: 24, right: 24,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Fechar"
          >✕</button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(i => (i - 1 + GALLERY.length) % GALLERY.length); }}
            style={{
              position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer', fontSize: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Anterior"
          >←</button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(i => (i + 1) % GALLERY.length); }}
            style={{
              position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer', fontSize: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Próxima"
          >→</button>
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 1200, maxHeight: '85vh', width: '100%' }}
          >
            <ImgPlaceholder
              subject={GALLERY[open].caption}
              tone={GALLERY[open].tone}
              ratio="3/4"
              src={GALLERY[open].src}
              alt={GALLERY[open].caption + ' · Edifício Kairós'}
              fit="contain"
              style={{ width: '100%', maxHeight: '78vh' }}
            >
              {GALLERY[open].caption}
            </ImgPlaceholder>
            <div style={{
              marginTop: 16,
              display: 'flex', justifyContent: 'space-between',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 13,
            }}>
              <span className="t-serif" style={{ fontSize: 16, color: '#fff' }}>{GALLERY[open].caption}</span>
              <span style={{ letterSpacing: '0.16em' }}>{String(open + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 880px) {
          .gal-grid { grid-template-columns: repeat(6, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .gal-grid { grid-template-columns: 1fr !important; }
          .gal-grid > * { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  );
}

// Asymmetric gallery layout (12-col grid)
const GAL_LAYOUT = [
  { col: 7, ratio: '4/3' },  // Living (big)
  { col: 5, ratio: '4/3' },  // Cozinha
  { col: 4, ratio: '4/5' },  // Piscina (tall)
  { col: 4, ratio: '4/5' },  // Lounge
  { col: 4, ratio: '4/5' },  // Varanda
  { col: 5, ratio: '4/3' },  // Suíte
  { col: 7, ratio: '16/9' }, // Fachada (wide)
];

/* ------------------------------------------------------------------ */
/* LOCALIZAÇÃO, interactive map                                       */
/* ------------------------------------------------------------------ */
const POIS = [
  { id: 'praia',     label: 'Praia de Jatiúca',          dist: '5 min',  x: 78, y: 36, type: 'beach' },
  { id: 'shopping',  label: 'Maceió Shopping',           dist: '7 min',  x: 36, y: 28, type: 'shop' },
  { id: 'hospital',  label: 'Hospital Memorial',         dist: '9 min',  x: 28, y: 60, type: 'med' },
  { id: 'paj',       label: 'Pajuçara',                  dist: '10 min', x: 88, y: 76, type: 'beach' },
  { id: 'aero',      label: 'Aeroporto Zumbi dos Palmares', dist: '22 min', x: 12, y: 88, type: 'air' },
];

function Localizacao() {
  const [hover, setHover] = useState3(null);

  return (
    <section id="local" data-screen-label="Localização" className="section section--alt">
      <div className="container">
        <div className="section-head">
          <div className="reveal">
            <Eyebrow index="06">Localização</Eyebrow>
            <h2 className="t-display-2" style={{ marginTop: 16 }}>
              Jatiúca,<br/>
              <span className="t-serif" style={{ color: 'var(--accent)' }}>do jeito que se mora.</span>
            </h2>
          </div>
          <aside className="reveal reveal--delay-1" style={{ color: 'var(--fg-2)' }}>
            <p className="t-body-lg" style={{ maxWidth: 520 }}>
              Cinco minutos de carro até a faixa de areia. Caminhando, em menos de dez. Cercado pelos melhores restaurantes, padarias, academias e escolas do bairro, sem precisar pegar a Mangabeiras.
            </p>
          </aside>
        </div>

        <div className="local-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 'clamp(24px, 3vw, 56px)',
          marginTop: 24,
          alignItems: 'stretch',
        }}>
          {/* Map */}
          <div className="reveal" style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: 24,
            position: 'relative',
            minHeight: 520,
          }}>
            <MapJatiuca pois={POIS} hover={hover} setHover={setHover}/>
            <div style={{
              position: 'absolute',
              top: 24, left: 24,
              background: 'rgba(251,248,241,0.95)',
              backdropFilter: 'blur(8px)',
              padding: '10px 14px',
              borderRadius: 4,
              border: '1px solid var(--border)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--fg-2)',
              fontWeight: 500,
            }}>
              Jatiúca · Maceió · AL
            </div>
            <div style={{
              position: 'absolute', bottom: 24, right: 24,
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 12, color: 'var(--fg-3)',
            }}>
              09°39′52″S · 35°42′24″W
            </div>
          </div>

          {/* Address + distances */}
          <div className="reveal reveal--delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{
              padding: 24,
              background: 'var(--k-cocoa)',
              color: 'var(--fg-on-dark)',
              borderRadius: 6,
            }}>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--k-terra-glow)', marginBottom: 12 }}>
                Endereço
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em' }}>
                Rua Aureliano Teixeira<br/>de Vasconcelos, 57
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: 'rgba(239,235,227,0.7)' }}>
                Jatiúca · Maceió · AL
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 20, fontWeight: 500 }}>
                Distâncias
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {POIS.map(p => (
                  <li
                    key={p.id}
                    onMouseEnter={() => setHover(p.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 12,
                      alignItems: 'baseline',
                      padding: '16px 0',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'color 140ms',
                      color: hover === p.id ? 'var(--accent)' : 'var(--fg-1)',
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 500 }}>{p.label}</span>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                      color: hover === p.id ? 'var(--accent)' : 'var(--fg-1)',
                      letterSpacing: '-0.01em',
                    }}>{p.dist}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .local-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function MapJatiuca({ pois, hover, setHover }) {
  return (
    <svg
      viewBox="0 0 600 500"
      style={{ width: '100%', height: '100%', minHeight: 460, display: 'block' }}
      role="img"
      aria-label="Mapa estilizado de Jatiúca, Maceió"
    >
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9EC2C8"/>
          <stop offset="100%" stopColor="#7AAEB6"/>
        </linearGradient>
        <pattern id="sand" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#E8DAB8"/>
          <circle cx="2" cy="2" r="0.3" fill="#C8B287"/>
          <circle cx="4" cy="4" r="0.3" fill="#C8B287"/>
        </pattern>
      </defs>
      {/* land */}
      <rect x="0" y="0" width="600" height="500" fill="#F5F1E8"/>
      {/* ocean */}
      <path d="M 600 0 L 600 500 L 380 500 Q 410 400 450 320 Q 490 220 540 120 Q 570 60 600 0 Z" fill="url(#ocean)"/>
      {/* beach line */}
      <path d="M 380 500 Q 410 400 450 320 Q 490 220 540 120 Q 570 60 600 0"
            stroke="#E8DAB8" strokeWidth="20" fill="none" opacity="0.7"/>
      {/* streets, grid */}
      <g stroke="#D8CFBE" strokeWidth="1.2" fill="none">
        {[60, 120, 180, 240, 300, 360].map(y => (
          <line key={`h-${y}`} x1="0" y1={y} x2={Math.max(380, 600 - (y * 0.7))} y2={y} />
        ))}
        {[60, 120, 180, 240, 300, 360, 420].map(x => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="500"
                strokeDasharray={x === 240 ? 'none' : 'none'}/>
        ))}
      </g>
      {/* main avenue */}
      <line x1="0" y1="240" x2="600" y2="240" stroke="#B5A990" strokeWidth="3"/>
      <line x1="240" y1="0" x2="240" y2="500" stroke="#B5A990" strokeWidth="3"/>
      {/* labels */}
      <text x="120" y="234" fontSize="9" fill="#8A7E73" fontFamily="serif" fontStyle="italic" letterSpacing="0.1em">Av. Comendador Leão</text>
      <text x="244" y="20" fontSize="9" fill="#8A7E73" fontFamily="serif" fontStyle="italic">Av. Álvaro Otacílio</text>
      <text x="520" y="60" fontSize="14" fill="#5A6B70" fontFamily="serif" fontStyle="italic" opacity="0.7">Atlântico</text>

      {/* Building location, Kairós */}
      <g transform="translate(280, 200)">
        <circle r="18" fill="var(--accent)" opacity="0.18"/>
        <circle r="10" fill="var(--accent)" opacity="0.32"/>
        <rect x="-5" y="-5" width="10" height="10" fill="var(--accent)" stroke="#FBF8F1" strokeWidth="1.5"/>
        <text x="0" y="-22" textAnchor="middle" fontSize="11" fill="#2B2622" fontFamily="serif" fontStyle="italic" fontWeight="700">Kairós</text>
        <text x="0" y="26" textAnchor="middle" fontSize="8" fill="#5A4F47" letterSpacing="0.16em">VOCÊ ESTÁ AQUI</text>
      </g>

      {/* POIs */}
      {pois.map(p => {
        const isHover = hover === p.id;
        const cx = (p.x / 100) * 600;
        const cy = (p.y / 100) * 500;
        return (
          <g
            key={p.id}
            transform={`translate(${cx}, ${cy})`}
            onMouseEnter={() => setHover(p.id)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* connection line to Kairós */}
            <line
              x1={0} y1={0}
              x2={280 - cx} y2={200 - cy}
              stroke="var(--accent)"
              strokeWidth={isHover ? 1.5 : 0.6}
              strokeDasharray="4 4"
              opacity={isHover ? 0.85 : 0.18}
              style={{ transition: 'all 200ms var(--ease-out)' }}
            />
            <circle r={isHover ? 12 : 6} fill="#FBF8F1" stroke="#2B2622" strokeWidth="1.2"
                    style={{ transition: 'all 200ms var(--ease-out)' }}/>
            <circle r={isHover ? 4 : 2.5} fill="#2B2622"/>
            <text x="0" y={-14} textAnchor="middle" fontSize={isHover ? 11 : 10}
                  fill="#2B2622" fontFamily="sans-serif" fontWeight="500"
                  style={{ transition: 'all 200ms var(--ease-out)' }}>
              {p.label}
            </text>
            <text x="0" y={isHover ? 24 : 20} textAnchor="middle" fontSize="9"
                  fill="#982532" fontFamily="serif" fontStyle="italic" fontWeight="700"
                  style={{ transition: 'all 200ms var(--ease-out)', opacity: isHover ? 1 : 0.7 }}>
              {p.dist}
            </text>
          </g>
        );
      })}

      {/* Compass */}
      <g transform="translate(48, 444)">
        <circle r="20" fill="#FBF8F1" stroke="#B5A990" strokeWidth="0.6"/>
        <path d="M 0 -16 L 4 0 L 0 4 L -4 0 Z" fill="#982532"/>
        <path d="M 0 16 L 4 0 L 0 -4 L -4 0 Z" fill="#5A4F47" opacity="0.5"/>
        <text y="-22" textAnchor="middle" fontSize="8" fill="#5A4F47" letterSpacing="0.18em">N</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SUSTENTABILIDADE                                                     */
/* ------------------------------------------------------------------ */
const SUSTAIN = [
  { n: '01', title: 'Energia solar fotovoltaica', body: 'Sistema próprio que abate a conta das áreas comuns do condomínio.', icon: 'sun' },
  { n: '02', title: 'Gerador automático',         body: 'Áreas comuns 100% atendidas, e ainda iluminação + tomada da cozinha em cada apartamento.', icon: 'bolt' },
  { n: '03', title: 'Reuso de água',              body: 'Aproveitamento de água da chuva e do condensador do ar-condicionado.', icon: 'drop' },
  { n: '04', title: 'Hidrômetro individual',      body: 'Você paga só pelo que consome, sem rateio injusto.', icon: 'gauge' },
  { n: '05', title: 'LED em tudo',                body: 'Iluminação de baixo consumo nas áreas comuns e elevadores VVF.', icon: 'led' },
  { n: '06', title: 'Carregador para EV',         body: 'Pontos para carregamento de carro elétrico já instalados na garagem.', icon: 'plug' },
];

function SustainIcon({ name, size = 24, color = 'var(--accent)' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    sun:   <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
    bolt:  <svg {...common}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
    drop:  <svg {...common}><path d="M12 2 C 8 8 5 12 5 16 a 7 7 0 0 0 14 0 c 0-4-3-8-7-14z"/></svg>,
    gauge: <svg {...common}><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 4a8 8 0 0 1 8 8M4 12a8 8 0 0 1 8-8"/><path d="m12 12 4-4"/></svg>,
    led:   <svg {...common}><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 13c0 1 1 2 2 2h4c1 0 2-1 2-2a7 7 0 0 0-4-13z"/></svg>,
    plug:  <svg {...common}><path d="M9 2v4M15 2v4M7 6h10v4a5 5 0 0 1-10 0V6zM12 15v7"/></svg>,
  };
  return icons[name] || null;
}

function Sustentabilidade() {
  return (
    <section data-screen-label="Sustentabilidade" className="section">
      <div className="container">
        <div className="section-head">
          <div className="reveal">
            <Eyebrow index="07">Sustentabilidade</Eyebrow>
            <h2 className="t-display-2" style={{ marginTop: 16 }}>
              Confortável pra você.<br/>
              <span className="t-serif" style={{ color: 'var(--accent)' }}>Leve para o planeta.</span>
            </h2>
          </div>
          <aside className="reveal reveal--delay-1" style={{ color: 'var(--fg-2)' }}>
            <p className="t-body-lg" style={{ maxWidth: 520 }}>
              Energia solar, reuso de água, gerador automático nas áreas comuns. A conta no fim do mês, e o impacto fora dele, são bem menores aqui.
            </p>
          </aside>
        </div>

        <div className="sustain-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'var(--border)',
          border: '1px solid var(--border)',
        }}>
          {SUSTAIN.map((s, i) => (
            <article key={s.n} className="reveal" style={{
              background: 'var(--bg-2)',
              padding: 'var(--density-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              minHeight: 220,
              transitionDelay: `${i * 60}ms`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)' }}>{s.n}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}>
                  <SustainIcon name={s.icon} size={22}/>
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.01em',
                marginTop: 4,
              }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-2)' }}>{s.body}</p>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) {
          .sustain-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .sustain-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

Object.assign(window, { Galeria, Localizacao, Sustentabilidade, MapJatiuca });
