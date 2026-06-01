/* global React, Eyebrow, ImgPlaceholder, CountUp, Cross */
// Sections 2: Por que agora, Plantas, Lazer

const { useState: useState2, useEffect: useEffect2, useMemo: useMemo2 } = React;

/* ------------------------------------------------------------------ */
/* WHY NOW, 4 cards + banner                                          */
/* ------------------------------------------------------------------ */
function WhyNow() {
  const cards = [
    {
      n: '01',
      title: 'Chaves na hora',
      body: 'Visite, escolha sua unidade e receba as chaves após a assinatura. Sem espera de 36 meses de obra.',
    },
    {
      n: '02',
      title: 'Você vê antes de comprar',
      body: 'Cada acabamento, cada vista, cada andar, tudo o que está no folder existe e está exatamente como você vai receber.',
    },
    {
      n: '03',
      title: 'Financiamento facilitado',
      body: 'Financie em qualquer banco ou direto conosco em até 100 meses.',
    },
    {
      n: '04',
      title: 'Jatiúca a 5 min da praia',
      body: 'O bairro que reúne os melhores restaurantes, escolas e o mar ao alcance de uma caminhada.',
    },
  ];

  return (
    <section id="porque" data-screen-label="Por que agora" className="section section--alt">
      <div className="container">
        <div className="section-head">
          <div className="reveal">
            <Eyebrow index="01">Por que comprar agora</Eyebrow>
            <h2 className="t-display-2" style={{ marginTop: 16 }}>
              Sem espera.<br/>
              <span className="t-serif" style={{ color: 'var(--accent)' }}>Sem obra.</span>
            </h2>
          </div>
          <aside className="reveal reveal--delay-1" style={{ color: 'var(--fg-2)' }}>
            <p className="t-body-lg" style={{ maxWidth: 500 }}>
              Comprar pronto significa receber as chaves na hora, ver tudo antes de assinar, e parcelar direto com a construtora.
            </p>
          </aside>
        </div>

        <div className="why-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'var(--border)',
          border: '1px solid var(--border)',
          marginTop: 24,
        }}>
          {cards.map((c, i) => (
            <article
              key={c.n}
              className="reveal"
              style={{
                background: 'var(--bg-2)',
                padding: 'var(--density-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                minHeight: 280,
                transitionDelay: `${i * 70}ms`,
                position: 'relative',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  color: 'var(--accent)',
                  fontWeight: 500,
                }}>{c.n}</span>
                <Cross size={10} color="var(--fg-3)" />
              </div>
              <h3 className="t-h3" style={{ marginTop: 8, color: 'var(--fg-1)' }}>{c.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-2)', marginTop: 'auto' }}>
                {c.body}
              </p>
            </article>
          ))}
        </div>

        {/* Financiamento banner */}
        <div className="reveal" style={{
          marginTop: 40,
          background: 'var(--k-cocoa)',
          color: 'var(--fg-on-dark)',
          padding: '40px 48px',
          borderRadius: 6,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'center',
        }}>
          <div>
            <div className="t-eyebrow" style={{ color: 'var(--k-terra-glow)' }}>Financiamento</div>
            <h3 className="t-h2" style={{ color: 'var(--fg-on-dark)', marginTop: 12, maxWidth: 700 }}>
              Parcele em até <span className="wordmark" style={{ fontSize: 'inherit', color: 'var(--k-terra-glow)' }}>100</span> meses, direto com a construtora.
            </h3>
          </div>
          <a href="#contato" className="btn btn--accent btn--lg" style={{ borderBottom: 'none', flexShrink: 0 }}>
            Falar com consultor <span className="arrow">→</span>
          </a>
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) {
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PLANTAS                                                             */
/* ------------------------------------------------------------------ */
const PLANTAS = [
  {
    n: '01',
    area: '87m²',
    name: 'Três quartos, duas suítes',
    specs: 'Tipo 01/06 · 2 vagas · varanda',
    status: 'Últimas unidades',
    statusTone: 'warn',
    rooms: ['Living + jantar', 'Cozinha integrada', 'Suíte master + closet', 'Suíte secundária', 'Quarto', 'Varanda 8m²', 'Lavabo · Lavanderia'],
    price: 'A partir de R$ 890 mil',
  },
  {
    n: '02',
    area: '97m²',
    name: 'Três suítes, padrão alto',
    specs: 'Tipo 02/05 · 2 vagas · varanda ampla',
    status: 'Disponível',
    statusTone: 'ok',
    rooms: ['Living ampliado', 'Cozinha gourmet', 'Suíte master + closet', '2 suítes secundárias', 'Varanda gourmet 12m²', 'Lavabo · DCE'],
    price: 'A partir de R$ 1,12 mi',
  },
  {
    n: '03',
    area: '149m²',
    name: 'Cobertura com vista',
    specs: 'Cobertura · 3 vagas · varanda gourmet',
    status: 'Última unidade',
    statusTone: 'rare',
    rooms: ['Living duplo', 'Cozinha gourmet integrada', 'Suíte master + closet duplo', '2 suítes', 'Varanda 28m² com churrasq.', 'Lavabo · DCE · Despensa'],
    price: 'Sob consulta',
  },
];

function Plantas({ layout = 'cards' }) {
  return (
    <section id="plantas" data-screen-label="Plantas" className="section">
      <div className="container">
        <div className="section-head">
          <div className="reveal">
            <Eyebrow index="03">Plantas</Eyebrow>
            <h2 className="t-display-2" style={{ marginTop: 16 }}>
              Cinco plantas,<br/>
              <span className="t-serif" style={{ color: 'var(--accent)' }}>uma é a sua.</span>
            </h2>
          </div>
          <aside className="reveal reveal--delay-1" style={{ color: 'var(--fg-2)' }}>
            <p className="t-body-lg" style={{ maxWidth: 520 }}>
              Apartamentos de 3 quartos, com configurações que vão de 87m² a coberturas amplas de 149m². Todas com varanda, área de serviço, e pelo menos duas suítes.
            </p>
          </aside>
        </div>

        {layout === 'cards' && <PlantasCards />}
        {layout === 'table' && <PlantasTable />}
        {layout === 'compare' && <PlantasCompare />}

        <p style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          fontSize: 13,
          color: 'var(--fg-3)',
          maxWidth: 720,
        }}>
          Plantas detalhadas, ficha técnica completa e tabela de preços disponíveis sob consulta com nosso time comercial.
        </p>
      </div>
    </section>
  );
}

/* Tabs/cards layout, visual planta + tabs */
function PlantasCards() {
  const [active, setActive] = useState2(0);
  const p = PLANTAS[active];

  return (
    <div>
      {/* Tab bar */}
      <div role="tablist" style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid var(--border)',
        marginBottom: 40,
        overflowX: 'auto',
      }} className="scroll-x">
        {PLANTAS.map((pl, i) => (
          <button
            key={pl.n}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            style={{
              flex: '0 0 auto',
              background: 'transparent',
              border: 'none',
              borderBottom: active === i ? '2px solid var(--accent)' : '2px solid transparent',
              padding: '18px 28px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 6,
              cursor: 'pointer',
              color: active === i ? 'var(--fg-1)' : 'var(--fg-3)',
              transition: 'color 140ms var(--ease-out)',
              textAlign: 'left',
              minWidth: 180,
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)' }}>{pl.n}</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.01em',
            }}>{pl.area}</span>
            <span style={{ fontSize: 12, color: active === i ? 'var(--fg-2)' : 'var(--fg-3)' }}>{pl.name}</span>
          </button>
        ))}
      </div>

      {/* Active planta panel */}
      <div key={active} className="reveal in planta-panel" style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 'clamp(32px, 5vw, 80px)',
        alignItems: 'start',
        animation: 'fadeIn 460ms var(--ease-out)',
      }}>
        <div>
          <PlantaSketch type={p.n}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StatusBadge tone={p.statusTone}>{p.status}</StatusBadge>
            <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>{p.specs}</span>
          </div>
          <h3 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>{p.area}</h3>
          <p className="t-h3" style={{ color: 'var(--fg-2)', fontWeight: 400 }}>{p.name}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {p.rooms.map(r => (
              <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--fg-2)' }}>
                <Cross size={8} color="var(--accent)" />
                {r}
              </li>
            ))}
          </ul>
          <div style={{
            marginTop: 8,
            paddingTop: 20,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div className="t-serif" style={{ fontSize: 14, color: 'var(--fg-2)', maxWidth: 360 }}>
              Valores e disponibilidade por unidade na seção 02 · Edifício.
            </div>
            <a href="#edificio" className="btn btn--accent" style={{ borderBottom: 'none' }}>
              Ver disponibilidade <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        @media (max-width: 880px) {
          .planta-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* Table layout */
function PlantasTable() {
  return (
    <div style={{ borderTop: '1px solid var(--fg-1)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px 120px 1.4fr 1.2fr 160px',
        gap: 16,
        padding: '14px 0',
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--fg-3)',
        fontWeight: 500,
        borderBottom: '1px solid var(--border)',
      }} className="planta-table-head">
        <span>#</span>
        <span>Área</span>
        <span>Nome</span>
        <span>Specs</span>
        <span>Status</span>
      </div>
      {PLANTAS.map(p => (
        <a
          href="#contato"
          key={p.n}
          className="planta-table-row"
          style={{
            display: 'grid',
            gridTemplateColumns: '60px 120px 1.4fr 1.2fr 160px',
            gap: 16,
            padding: '24px 0',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            textDecoration: 'none',
            color: 'var(--fg-1)',
            borderBottomColor: 'var(--border)',
            transition: 'background 140ms var(--ease-out)',
          }}
        >
          <span style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: '0.16em' }}>{p.n}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>{p.area}</span>
          <span style={{ fontSize: 15, color: 'var(--fg-1)' }}>{p.name}</span>
          <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{p.specs}</span>
          <span>
            <StatusBadge tone={p.statusTone}>{p.status}</StatusBadge>
          </span>
        </a>
      ))}
      <style>{`
        .planta-table-row:hover { background: var(--bg-2); }
        @media (max-width: 760px) {
          .planta-table-head { display: none !important; }
          .planta-table-row { grid-template-columns: 1fr !important; gap: 8px !important; padding: 20px 0 !important; }
        }
      `}</style>
    </div>
  );
}

/* Compare layout: side-by-side */
function PlantasCompare() {
  return (
    <div className="planta-compare" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      background: 'var(--border)',
      border: '1px solid var(--border)',
    }}>
      {PLANTAS.map(p => (
        <div key={p.n} style={{
          background: 'var(--bg-2)',
          padding: 'var(--density-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)' }}>{p.n}</span>
            <StatusBadge tone={p.statusTone}>{p.status}</StatusBadge>
          </div>
          <PlantaSketch type={p.n} compact/>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, letterSpacing: '-0.02em' }}>{p.area}</div>
            <div style={{ fontSize: 14, color: 'var(--fg-2)', marginTop: 4 }}>{p.name}</div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {p.rooms.slice(0, 5).map(r => (
              <li key={r} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--fg-2)' }}>
                <Cross size={7} color="var(--accent)" style={{ marginTop: 6 }} />
                {r}
              </li>
            ))}
          </ul>
          <div style={{
            marginTop: 'auto',
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            fontSize: 12,
            color: 'var(--fg-3)',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
          }}>
            Valor por unidade · seção 02 Edifício
          </div>
        </div>
      ))}
      <style>{`
        @media (max-width: 900px) {
          .planta-compare { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ children, tone = 'ok' }) {
  const styles = {
    ok:   { bg: 'var(--k-leaf-soft)', fg: 'var(--k-leaf)' },
    warn: { bg: 'var(--accent-soft)', fg: 'var(--accent-press)' },
    rare: { bg: 'var(--k-cocoa)', fg: 'var(--k-cream)' },
  };
  const s = styles[tone] || styles.ok;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      background: s.bg,
      color: s.fg,
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontWeight: 500,
      borderRadius: 999,
    }}>
      {tone === 'rare' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}/>}
      {children}
    </span>
  );
}

/* Stylized planta sketch, architectural floor plan */
function PlantaSketch({ type = '01', compact = false }) {
  // Paleta da planta — alinhada ao design system (cinza-frio + acento vinho)
  const ROOM = '#F4F4F2';      // ambientes (off-white frio)
  const LIVING = '#ECECEA';    // social (um tom abaixo)
  const WET = '#E0E2E4';       // cozinha/áreas molhadas (leve azulado)
  const WALL = '#1A1817';      // paredes externas (carvão)
  const DIV = '#C4C2BC';       // divisórias internas
  const INK = '#4A4744';       // textos
  const VAR = 'rgba(139,35,50,0.12)';   // varanda — tinta vinho suave
  const VARSTROKE = '#8B2332';

  const layouts = {
    '01': (
      <g>
        <rect x="20" y="20" width="160" height="100" fill={ROOM} stroke={WALL} strokeWidth="1.4"/>
        <rect x="20" y="20" width="80" height="60" fill={LIVING} stroke={DIV} strokeWidth="0.6"/>
        <text x="60" y="54" textAnchor="middle" fontSize="6" fill={INK} fontFamily="serif" fontStyle="italic">Living</text>
        <rect x="20" y="80" width="50" height="40" fill={WET} stroke={DIV} strokeWidth="0.6"/>
        <text x="45" y="103" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Cozinha</text>
        <rect x="100" y="20" width="80" height="50" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="140" y="47" textAnchor="middle" fontSize="6" fill={INK} fontFamily="serif" fontStyle="italic">Suíte master</text>
        <rect x="70" y="80" width="60" height="40" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="100" y="103" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Suíte 2</text>
        <rect x="130" y="70" width="50" height="50" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="155" y="98" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Quarto</text>
        <rect x="20" y="120" width="160" height="14" fill={VAR} stroke={VARSTROKE} strokeWidth="0.7"/>
        <text x="100" y="130" textAnchor="middle" fontSize="5" fill={VARSTROKE} fontFamily="serif" fontStyle="italic">Varanda</text>
      </g>
    ),
    '02': (
      <g>
        <rect x="20" y="20" width="160" height="100" fill={ROOM} stroke={WALL} strokeWidth="1.4"/>
        <rect x="20" y="20" width="100" height="60" fill={LIVING} stroke={DIV} strokeWidth="0.6"/>
        <text x="70" y="54" textAnchor="middle" fontSize="6" fill={INK} fontFamily="serif" fontStyle="italic">Living amplo</text>
        <rect x="120" y="20" width="60" height="40" fill={WET} stroke={DIV} strokeWidth="0.6"/>
        <text x="150" y="43" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Cozinha</text>
        <rect x="120" y="60" width="60" height="50" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="150" y="87" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Suíte master</text>
        <rect x="20" y="80" width="60" height="40" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="50" y="103" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Suíte 2</text>
        <rect x="80" y="80" width="40" height="40" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="100" y="103" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Suíte 3</text>
        <rect x="20" y="120" width="160" height="16" fill={VAR} stroke={VARSTROKE} strokeWidth="0.7"/>
        <text x="100" y="131" textAnchor="middle" fontSize="5" fill={VARSTROKE} fontFamily="serif" fontStyle="italic">Varanda ampla</text>
      </g>
    ),
    '03': (
      <g>
        <rect x="10" y="20" width="180" height="100" fill={ROOM} stroke={WALL} strokeWidth="1.4"/>
        <rect x="10" y="20" width="120" height="60" fill={LIVING} stroke={DIV} strokeWidth="0.6"/>
        <text x="70" y="54" textAnchor="middle" fontSize="6" fill={INK} fontFamily="serif" fontStyle="italic">Living duplo</text>
        <rect x="130" y="20" width="60" height="40" fill={WET} stroke={DIV} strokeWidth="0.6"/>
        <text x="160" y="43" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Cozinha</text>
        <rect x="130" y="60" width="60" height="60" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="160" y="93" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Suíte master</text>
        <rect x="10" y="80" width="55" height="40" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="38" y="103" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Suíte 2</text>
        <rect x="65" y="80" width="65" height="40" fill={ROOM} stroke={DIV} strokeWidth="0.6"/>
        <text x="97" y="103" textAnchor="middle" fontSize="5" fill={INK} fontFamily="serif" fontStyle="italic">Suíte 3</text>
        <rect x="10" y="120" width="180" height="24" fill={VAR} stroke={VARSTROKE} strokeWidth="0.9"/>
        <text x="100" y="135" textAnchor="middle" fontSize="6" fill={VARSTROKE} fontFamily="serif" fontStyle="italic">Varanda gourmet 28m²</text>
      </g>
    ),
  };

  return (
    <div style={{
      background: 'linear-gradient(160deg, var(--k-cream) 0%, var(--bg-2) 100%)',
      border: '1px solid var(--border)',
      padding: compact ? 14 : 'clamp(24px, 3vw, 40px)',
      borderRadius: 'var(--radius-md)',
      boxShadow: compact ? 'none' : 'var(--shadow-2)',
      position: 'relative',
    }}>
      {/* cantos de moldura técnica */}
      {!compact && ['tl','tr','bl','br'].map(c => (
        <span key={c} aria-hidden="true" style={{
          position: 'absolute', width: 14, height: 14,
          borderColor: 'var(--accent)', borderStyle: 'solid',
          borderWidth: c==='tl' ? '1px 0 0 1px' : c==='tr' ? '1px 1px 0 0' : c==='bl' ? '0 0 1px 1px' : '0 1px 1px 0',
          top: c[0]==='t' ? 14 : 'auto', bottom: c[0]==='b' ? 14 : 'auto',
          left: c[1]==='l' ? 14 : 'auto', right: c[1]==='r' ? 14 : 'auto',
          opacity: 0.5,
        }}/>
      ))}
      <svg viewBox="0 0 200 160" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <pattern id="planta-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#000" strokeWidth="0.2" opacity="0.04"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="200" height="160" fill="url(#planta-grid)"/>
        {/* compass */}
        <g transform="translate(184,12)">
          <circle r="6" fill="none" stroke="#8B2332" strokeWidth="0.5"/>
          <path d="M0 -6 L 0 6 M -6 0 L 6 0" stroke="#8B2332" strokeWidth="0.4" opacity="0.6"/>
          <text x="0" y="-7.5" textAnchor="middle" fontSize="3.5" fill="#8B2332" fontWeight="700">N</text>
        </g>
        {layouts[type]}
      </svg>
      {!compact && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 18, marginTop: 12,
          borderTop: '1px solid var(--border)',
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)',
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Tipo {type}</span>
          <span className="t-serif" style={{ fontSize: 13, letterSpacing: 0, color: 'var(--fg-2)', textTransform: 'none', fontStyle: 'italic' }}>
            Planta esquemática · medidas no memorial
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LAZER, counters + categorized cards                                */
/* ------------------------------------------------------------------ */
const LAZER_COUNTERS = [
  { value: 4,  label: 'Piscinas e áreas molhadas', plus: false },
  { value: 12, label: 'Espaços de convívio',       plus: false },
  { value: 6,  label: 'Áreas fitness e bem-estar', plus: false },
  { value: 8,  label: 'Serviços e comodidades',    plus: true  },
];

const LAZER_CATS = [
  {
    n: '01',
    title: 'Água & relaxamento',
    items: ['Piscina adulto com prainha', 'Piscina infantil', 'Hidromassagem', 'Sauna e ofurô', 'Spa com sala de massagem', 'Espaço beleza feminino'],
  },
  {
    n: '02',
    title: 'Fitness & bem-estar',
    items: ['Academia / crossfit', 'Estúdio de yoga e pilates', 'Mini quadra de futebol', 'Mini muro de escalada', 'Mini golfe', 'Garagem band (música)'],
  },
  {
    n: '03',
    title: 'Convívio & família',
    items: ['Espaço gourmet com churrasqueira', 'Salão de festas', 'Sports bar', 'Coworking', 'Sala de estudos e jogos', 'Brinquedoteca', 'Berçário / sala bebê', 'Ateliê de artes', 'Lounge de jogos ao ar livre', 'Playground'],
  },
  {
    n: '04',
    title: 'Serviços & praticidade',
    items: ['Concierge na entrada', 'Sala de e-commerce / encomendas', 'Compartilhamento de bikes', 'Compartilhamento de patinetes', 'Pranchas, SUPs e caiaques compartilhados', 'Lavagem a seco para carros', 'Bicicletário e oficina', 'Pet place'],
  },
];

function Lazer() {
  const [openIdx, setOpenIdx] = useState2(0); // first card open by default

  return (
    <section id="lazer" data-screen-label="Lazer" className="section section--dark">
      <div className="container">
        <div className="section-head">
          <div className="reveal">
            <Eyebrow index="04" style={{ color: 'var(--k-terra-glow)' }}>Lazer</Eyebrow>
            <h2 className="t-display-2" style={{ marginTop: 16, color: 'var(--fg-on-dark)' }}>
              Mais de 30 espaços<br/>
              <span className="t-serif" style={{ color: 'var(--k-terra-glow)' }}>para não querer sair.</span>
            </h2>
          </div>
          <aside className="reveal reveal--delay-1" style={{ color: 'rgba(239,235,227,0.75)' }}>
            <p className="t-body-lg" style={{ maxWidth: 520 }}>
              O Kairós tem um lazer pensado para que a vida não acabe na porta do apartamento. Aqui, sua família tem mais quintal, sua agenda tem mais opções, e seu fim de semana cabe inteiro no condomínio.
            </p>
          </aside>
        </div>

        {/* Counters */}
        <div className="lazer-counters" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          marginTop: 24,
          marginBottom: 56,
          borderTop: '1px solid rgba(255,255,255,0.12)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}>
          {LAZER_COUNTERS.map((c, i) => (
            <div key={c.label} style={{
              padding: '32px 24px',
              borderRight: i < LAZER_COUNTERS.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(48px, 7vw, 96px)',
                lineHeight: 1,
                color: 'var(--k-cream)',
                letterSpacing: '-0.03em',
              }}>
                {c.plus ? '+' : ''}<CountUp to={c.value}/>
              </div>
              <div style={{
                marginTop: 12,
                fontSize: 13,
                color: 'rgba(239,235,227,0.7)',
                maxWidth: 200,
              }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Expandable category cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.08)' }}>
          {LAZER_CATS.map((cat, i) => {
            const open = openIdx === i;
            return (
              <div key={cat.n} style={{ background: 'var(--bg-invert)' }}>
                <button
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '28px 0',
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 60px auto',
                    gap: 24,
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--fg-on-dark)',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--k-terra-glow)' }}>{cat.n}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(22px, 2.6vw, 36px)',
                    letterSpacing: '-0.015em', color: 'var(--fg-on-dark)',
                  }}>{cat.title}</span>
                  <span style={{ fontSize: 13, color: 'rgba(239,235,227,0.5)', textAlign: 'right' }}>
                    {String(cat.items.length).padStart(2, '0')} espaços
                  </span>
                  <span style={{
                    width: 36, height: 36,
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '50%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 240ms var(--ease-out), background 140ms',
                    transform: open ? 'rotate(45deg)' : 'none',
                    background: open ? 'var(--accent)' : 'transparent',
                  }}>
                    <Cross size={12} color={open ? 'white' : 'var(--k-cream)'} />
                  </span>
                </button>
                <div style={{
                  maxHeight: open ? 600 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 480ms var(--ease-out), opacity 360ms var(--ease-out)',
                  opacity: open ? 1 : 0,
                }}>
                  <div style={{
                    padding: '0 0 32px 80px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '14px 32px',
                  }} className="lazer-items">
                    {cat.items.map(item => (
                      <div key={item} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        fontSize: 14, color: 'rgba(239,235,227,0.85)',
                      }}>
                        <Cross size={8} color="var(--k-terra-glow)" style={{ marginTop: 6 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {i < LAZER_CATS.length - 1 && (
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}/>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .lazer-counters { grid-template-columns: repeat(2, 1fr) !important; }
          .lazer-counters > div:nth-child(2n) { border-right: none !important; }
          .lazer-counters > div:nth-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,0.12); }
          .lazer-items { padding-left: 0 !important; }
        }
      `}</style>
    </section>
  );
}

Object.assign(window, { WhyNow, Plantas, Lazer, PlantaSketch, StatusBadge });
