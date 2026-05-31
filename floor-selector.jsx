/* global React, Cross, Eyebrow, StatusBadge */
// Edifício, elevação interativa com 13 andares × 6 unidades

const { useState: useStateFS, useMemo: useMemoFS } = React;

/* Unit catalog, 13 floors × 6 units. Top = cobertura (3 large units).
   Status codes: 'avail' | 'reserved' | 'sold' */
const FLOOR_COUNT = 13;
function buildInventory() {
  const inv = [];
  for (let f = 1; f <= FLOOR_COUNT; f++) {
    if (f === FLOOR_COUNT) {
      // Cobertura: 3 unidades grandes
      [['01', '149m²', 'avail'], ['02', '149m²', 'sold'], ['03', '149m²', 'reserved']]
        .forEach(([n, area, status]) => inv.push({
          floor: f, n, area, type: 'cobertura', status, label: `${f}0${n}`,
        }));
    } else {
      // Pisos 1–12: 6 unidades, alternando tipologias 01/06 (87m²) e 02/05 (97m²)
      const seed = f * 7;
      [
        ['01', '87m²',  '87m² 3q · 2 suítes'],
        ['02', '97m²',  '97m² 3 suítes'],
        ['03', '97m²',  '97m² 3 suítes'],
        ['04', '97m²',  '97m² 3 suítes'],
        ['05', '97m²',  '97m² 3 suítes'],
        ['06', '87m²',  '87m² 3q · 2 suítes'],
      ].forEach(([n, area, type], i) => {
        // Deterministic pseudo-random status, most available, some sold/reserved
        const rnd = (seed * (i + 1) * 13) % 100;
        let status = 'avail';
        if (rnd < 18) status = 'sold';
        else if (rnd < 30) status = 'reserved';
        // 1st floor = mostly sold
        if (f <= 2 && rnd < 80) status = 'sold';
        if (f === 12 && rnd < 50) status = 'reserved';
        inv.push({
          floor: f, n, area, type, status,
          label: `${f}${f < 10 ? '0' : ''}${n}`,
        });
      });
    }
  }
  return inv;
}

const INVENTORY = buildInventory();

function FloorSelector() {
  const [hover, setHover] = useStateFS(null);
  const [selected, setSelected] = useStateFS(null);

  const counts = useMemoFS(() => {
    const c = { avail: 0, reserved: 0, sold: 0, total: INVENTORY.length };
    INVENTORY.forEach(u => c[u.status]++);
    return c;
  }, []);

  const activeUnit = selected || hover;

  return (
    <section id="edificio" data-screen-label="Edifício" className="section section--alt">
      <div className="container">
        <div className="section-head">
          <div className="reveal">
            <Eyebrow>Edifício</Eyebrow>
            <h2 className="t-display-2" style={{ marginTop: 16 }}>
              Várias formas<br/>
              <span className="t-serif" style={{ color: 'var(--accent)' }}>pra chamar de seu.</span>
            </h2>
          </div>
          <aside className="reveal reveal--delay-1" style={{ color: 'var(--fg-2)' }}>
            <p className="t-body-lg" style={{ maxWidth: 520 }}>
              {counts.avail} unidades disponíveis · {counts.reserved} reservadas · {counts.sold} vendidas. Toque ou passe o mouse em qualquer apartamento para ver detalhes, vista, tipologia e status.
            </p>
          </aside>
        </div>

        <div className="floor-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 'clamp(24px, 4vw, 56px)',
          marginTop: 24,
          alignItems: 'stretch',
        }}>
          {/* Building elevation */}
          <div className="reveal" style={{
            background: 'var(--bg-3)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: 32,
            position: 'relative',
            minHeight: 640,
          }}>
            <BuildingElevation
              inventory={INVENTORY}
              hover={hover}
              selected={selected}
              onHover={setHover}
              onSelect={setSelected}
            />
            <Legend counts={counts}/>
          </div>

          {/* Unit detail panel */}
          <div className="reveal reveal--delay-1">
            <UnitDetail unit={activeUnit} onClose={() => setSelected(null)} />
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .floor-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

/* The building drawing, SVG elevation, 13 stories */
function BuildingElevation({ inventory, hover, selected, onHover, onSelect }) {
  // Layout constants
  const W = 480;           // total width
  const margin = 40;
  const buildingW = W - margin * 2;
  const floorH = 38;
  const topPad = 50;       // sky padding
  const groundH = 30;
  const H = topPad + floorH * FLOOR_COUNT + groundH + 30;

  // Per-unit cell width
  const unitsPerFloor = 6;
  const cellW = buildingW / unitsPerFloor;

  // Group units by floor for rendering
  const byFloor = {};
  inventory.forEach(u => {
    if (!byFloor[u.floor]) byFloor[u.floor] = [];
    byFloor[u.floor].push(u);
  });

  const statusFill = (status, isActive) => {
    if (isActive) return 'var(--accent)';
    if (status === 'avail') return 'var(--bg-2)';
    if (status === 'reserved') return 'var(--accent-soft)';
    if (status === 'sold') return 'var(--k-cocoa)';
    return 'var(--bg-2)';
  };
  const statusStroke = (status) => {
    if (status === 'avail') return 'var(--border-strong)';
    if (status === 'reserved') return 'var(--accent)';
    if (status === 'sold') return 'var(--k-cocoa)';
    return 'var(--border)';
  };

  const activeKey = (selected && selected.label) || (hover && hover.label);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', maxHeight: 760 }} role="img" aria-label="Elevação do edifício">
      <defs>
        <linearGradient id="bldg-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bg-1)"/>
          <stop offset="100%" stopColor="var(--bg-2)"/>
        </linearGradient>
      </defs>

      {/* Sky / ambient */}
      <rect x="0" y="0" width={W} height={topPad} fill="var(--bg-3)"/>

      {/* Building shell */}
      <rect x={margin} y={topPad} width={buildingW} height={floorH * FLOOR_COUNT}
            fill="url(#bldg-fill)" stroke="var(--border)" strokeWidth="0.6"/>

      {/* Roof accent */}
      <rect x={margin} y={topPad - 4} width={buildingW} height={4}
            fill="var(--accent)" opacity={hover || selected ? 1 : 0.85}/>

      {/* Floors */}
      {Array.from({ length: FLOOR_COUNT }, (_, i) => {
        const f = FLOOR_COUNT - i; // top floor first
        const y = topPad + i * floorH;
        const floorUnits = byFloor[f] || [];
        const isCobertura = f === FLOOR_COUNT;
        return (
          <g key={f}>
            {/* Floor row separator (top edge) */}
            <line x1={margin} y1={y} x2={margin + buildingW} y2={y}
                  stroke="var(--border-soft)" strokeWidth="0.4"/>

            {/* Floor label on the left */}
            <text x={margin - 8} y={y + floorH / 2 + 3} textAnchor="end"
                  fontSize="9" fill="var(--fg-3)" fontFamily="var(--font-sans)"
                  letterSpacing="0.04em">
              {isCobertura ? 'COB' : (f < 10 ? `0${f}` : f)}
            </text>

            {/* Units */}
            {floorUnits.map((u, ui) => {
              const span = isCobertura ? unitsPerFloor / 3 : 1;
              const x = margin + ui * cellW * (isCobertura ? 2 : 1);
              const w = cellW * span;
              const h = floorH;
              const isActive = activeKey === u.label;
              const inset = 2;
              return (
                <g key={u.label}
                   onMouseEnter={() => onHover(u)}
                   onMouseLeave={() => onHover(null)}
                   onClick={() => onSelect(u.status === 'sold' ? null : u)}
                   style={{ cursor: u.status === 'sold' ? 'not-allowed' : 'pointer' }}
                >
                  <rect
                    x={x + inset} y={y + inset}
                    width={w - inset * 2} height={h - inset * 2}
                    fill={statusFill(u.status, isActive)}
                    stroke={isActive ? 'var(--accent)' : statusStroke(u.status)}
                    strokeWidth={isActive ? 1.5 : 0.6}
                    style={{ transition: 'fill 200ms var(--ease-out), stroke 160ms' }}
                  />
                  {/* Window subdivisions */}
                  {!isCobertura && (
                    <>
                      <line x1={x + w * 0.5} y1={y + 5} x2={x + w * 0.5} y2={y + h - 5}
                            stroke="var(--border)" strokeWidth="0.3" opacity={u.status === 'sold' ? 0.2 : 0.4}/>
                      <line x1={x + 5} y1={y + h * 0.5} x2={x + w - 5} y2={y + h * 0.5}
                            stroke="var(--border)" strokeWidth="0.3" opacity={u.status === 'sold' ? 0.2 : 0.4}/>
                    </>
                  )}
                  {/* Unit number inside */}
                  <text
                    x={x + w / 2}
                    y={y + h / 2 + 3}
                    textAnchor="middle"
                    fontSize={isCobertura ? 11 : 8}
                    fontFamily="var(--font-sans)"
                    fontWeight="500"
                    fill={
                      isActive ? 'var(--fg-on-accent)'
                      : u.status === 'sold' ? 'var(--bg-2)'
                      : u.status === 'reserved' ? 'var(--accent-press)'
                      : 'var(--fg-3)'
                    }
                    style={{ pointerEvents: 'none', letterSpacing: '0.05em' }}
                  >
                    {isCobertura ? `COB ${u.n}` : u.n}
                  </text>
                  {/* Cross icon for sold */}
                  {u.status === 'sold' && !isCobertura && (
                    <path
                      d={`M ${x + inset + 4} ${y + inset + 4} L ${x + w - inset - 4} ${y + h - inset - 4}`}
                      stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"
                    />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Ground */}
      <rect x="0" y={topPad + floorH * FLOOR_COUNT} width={W} height={groundH}
            fill="var(--bg-1)"/>
      <line x1="0" y1={topPad + floorH * FLOOR_COUNT}
            x2={W} y2={topPad + floorH * FLOOR_COUNT}
            stroke="var(--fg-1)" strokeWidth="1"/>

      {/* Compass / orientation */}
      <g transform={`translate(${W - 50}, 30)`}>
        <circle r="14" fill="var(--bg-3)" stroke="var(--border)" strokeWidth="0.5"/>
        <path d="M 0 -10 L 3 0 L 0 2 L -3 0 Z" fill="var(--accent)"/>
        <path d="M 0 10 L 3 0 L 0 -2 L -3 0 Z" fill="var(--fg-3)" opacity="0.6"/>
        <text y="-16" textAnchor="middle" fontSize="7" fill="var(--fg-3)"
              letterSpacing="0.18em">N</text>
        <text x="16" y="3" fontSize="7" fill="var(--fg-3)">L</text>
        <text x="-16" y="3" textAnchor="end" fontSize="7" fill="var(--fg-3)">O</text>
      </g>

      {/* Vista hint, beach is to the east */}
      <g transform={`translate(${W - 24}, ${topPad + floorH * 5})`} opacity="0.7">
        <text x="0" y="0" fontSize="8" fill="var(--fg-3)" textAnchor="middle"
              writingMode="tb" letterSpacing="0.2em" style={{ writingMode: 'vertical-rl' }}>
          → mar
        </text>
      </g>

      {/* Address strip */}
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="8"
            fill="var(--fg-4)" letterSpacing="0.2em">
        R. AURELIANO TEIXEIRA DE VASCONCELOS, 57 · JATIÚCA
      </text>
    </svg>
  );
}

function Legend({ counts }) {
  const items = [
    { key: 'avail',    label: 'Disponível', n: counts.avail,    fill: 'var(--bg-2)',     stroke: 'var(--border-strong)' },
    { key: 'reserved', label: 'Reservada',  n: counts.reserved, fill: 'var(--accent-soft)', stroke: 'var(--accent)' },
    { key: 'sold',     label: 'Vendida',    n: counts.sold,     fill: 'var(--k-cocoa)',  stroke: 'var(--k-cocoa)' },
  ];
  return (
    <div style={{
      marginTop: 24,
      paddingTop: 20,
      borderTop: '1px solid var(--border)',
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    }}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {items.map(it => (
          <div key={it.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 14, height: 14,
              background: it.fill,
              border: `1px solid ${it.stroke}`,
              display: 'inline-block',
            }}/>
            <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>
              <strong style={{ color: 'var(--fg-1)', fontFamily: 'var(--font-display)', fontWeight: 700, marginRight: 4 }}>
                {it.n}
              </strong>
              {it.label}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
        Total: {counts.total} unidades
      </div>
    </div>
  );
}

/* Right-side detail panel, shows the unit's specs */
function UnitDetail({ unit, onClose }) {
  if (!unit) return <EmptyHint />;

  const status = unit.status;
  const isCob = unit.type === 'cobertura';
  // synth pricing, varies by andar + tipologia
  const pricing = isCob
    ? 'A partir de R$ 2,4 mi'
    : unit.area === '97m²'
      ? `A partir de R$ ${Math.round(1120 + unit.floor * 12)} mil`
      : `A partir de R$ ${Math.round(890 + unit.floor * 9)} mil`;
  // vista based on n
  const vista = (() => {
    const n = parseInt(unit.n, 10);
    if (isCob) return 'Vista panorâmica · 360°';
    if (n === 1 || n === 6) return 'Vista frontal · mar de Jatiúca';
    if (n === 2 || n === 5) return 'Vista lateral · bairro';
    return 'Vista posterior · interna';
  })();

  return (
    <div style={{
      position: 'sticky',
      top: 100,
      background: 'var(--bg-3)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: 'clamp(24px, 3vw, 36px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)' }}>
            Unidade {unit.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.02em', lineHeight: 1,
            marginTop: 8, color: 'var(--fg-1)',
          }}>
            {unit.area}
          </div>
          <div className="t-serif" style={{ fontSize: 15, color: 'var(--fg-2)', marginTop: 6 }}>
            {unit.type}
          </div>
        </div>
        <StatusPill status={status}/>
      </div>

      <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DetailRow label="Andar" value={isCob ? 'Cobertura · piso 13' : `${unit.floor}º andar`}/>
        <DetailRow label="Vista" value={vista}/>
        <DetailRow label="Vagas" value={isCob ? '3 vagas' : (unit.area === '97m²' ? '2 vagas · ampla' : '2 vagas')}/>
        <DetailRow label="Suítes" value={isCob ? '3 suítes · master + closet duplo' : (unit.area === '97m²' ? '3 suítes' : '2 suítes + 1 quarto')}/>
        <DetailRow label="Varanda" value={isCob ? '28m² · gourmet' : (unit.area === '97m²' ? '12m² · gourmet' : '8m²')}/>
        <DetailRow label="Investimento" value={pricing} accent/>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {status === 'sold' ? (
          <div style={{ fontSize: 13, color: 'var(--fg-3)', padding: 12 }}>
            Unidade vendida. Veja outras opções na elevação.
          </div>
        ) : (
          <>
            <a href="#contato" className="btn btn--accent" style={{ borderBottom: 'none', flex: 1, justifyContent: 'center' }}>
              {status === 'reserved' ? 'Entrar em lista' : 'Reservar visita'}
              <span className="arrow">→</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="btn btn--ghost btn--sm"
              style={{ borderBottom: 'none' }}
            >Limpar</button>
          </>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    avail:    { bg: 'var(--k-leaf-soft)', fg: 'var(--k-leaf)',   text: 'Disponível' },
    reserved: { bg: 'var(--accent-soft)', fg: 'var(--accent-press)', text: 'Reservada' },
    sold:     { bg: 'var(--k-cocoa)',     fg: 'var(--k-cream)',  text: 'Vendida' },
  };
  const s = map[status];
  return (
    <span style={{
      padding: '6px 12px',
      background: s.bg,
      color: s.fg,
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      fontWeight: 500,
      borderRadius: 999,
      whiteSpace: 'nowrap',
    }}>
      {s.text}
    </span>
  );
}

function DetailRow({ label, value, accent }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16, alignItems: 'baseline' }}>
      <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', fontWeight: 500 }}>
        {label}
      </span>
      <span style={{
        fontSize: accent ? 18 : 14,
        color: accent ? 'var(--fg-1)' : 'var(--fg-1)',
        fontFamily: accent ? 'var(--font-display)' : 'var(--font-sans)',
        fontWeight: accent ? 700 : 400,
        letterSpacing: accent ? '-0.01em' : 0,
      }}>{value}</span>
    </div>
  );
}

function EmptyHint() {
  return (
    <div style={{
      position: 'sticky',
      top: 100,
      background: 'var(--bg-3)',
      border: '1px dashed var(--border-strong)',
      borderRadius: 6,
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 16,
      minHeight: 320,
    }}>
      <span style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--accent)' }}>
        Comece pela elevação
      </span>
      <div className="t-serif" style={{
        fontSize: 'clamp(20px, 2.2vw, 28px)',
        lineHeight: 1.3,
        color: 'var(--fg-1)',
        maxWidth: 320,
      }}>
        Passe o mouse em qualquer unidade para ver vista, tipologia e investimento.
      </div>
      <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 'auto' }}>
        Disponíveis em <strong style={{ color: 'var(--accent)' }}>verde</strong> ·{' '}
        Reservadas em <strong style={{ color: 'var(--accent)' }}>bordô claro</strong> ·{' '}
        Vendidas em <strong style={{ color: 'var(--fg-1)' }}>cocoa</strong>.
      </div>
    </div>
  );
}

Object.assign(window, { FloorSelector });
