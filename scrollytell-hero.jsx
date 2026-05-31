/* global React, Cross */
// Scrollytelling hero — wordmark pinned, narrative stages reveal on scroll.

const { useState: useStateSH, useEffect: useEffectSH, useRef: useRefSH } = React;

function HeroScrollytell() {
  const sectionRef = useRefSH(null);
  const [progress, setProgress] = useStateSH(0);

  useEffectSH(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (!sectionRef.current) return;
        const { top, height } = sectionRef.current.getBoundingClientRect();
        // 0 when hero top hits viewport top; 1 when bottom of long section reaches viewport top
        const total = height - window.innerHeight;
        const scrolled = -top;
        const p = Math.max(0, Math.min(1, total > 0 ? scrolled / total : 0));
        setProgress(p);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ramps
  const ramp = (a, b) => Math.max(0, Math.min(1, (progress - a) / (b - a)));
  const opacityIn  = (a, b) => ramp(a, b);
  const opacityOut = (a, b) => 1 - ramp(a, b);
  const opacityBand = (a, b, c, d) => Math.min(ramp(a, b), 1 - ramp(c, d));

  // Wordmark scale stays nearly full but breathes; only at very end does it tuck up
  const wmScale = 1 - 0.06 * progress;
  const wmTransY = -progress * 14; // small upward drift
  const wmLetterSpread = 0; // could spread letters as you scroll

  // Stage 0 (0–0.18): labels visible
  const stage0 = opacityOut(0.0, 0.18);
  // Stage 1 (0.20–0.55): stats float in
  const stage1 = opacityBand(0.20, 0.30, 0.55, 0.65);
  // Stage 2 (0.55–0.85): manifesto
  const stage2 = opacityBand(0.55, 0.65, 0.85, 0.92);
  // Stage 3 (0.85–1.0): CTA
  const stage3 = opacityIn(0.85, 0.95);
  // Progress dot in the top-right shows where you are
  // Stage dots: 4 stages

  return (
    <section
      ref={sectionRef}
      id="top"
      data-screen-label="01 Hero"
      style={{
        position: 'relative',
        height: '300vh',
        background: 'var(--bg-1)',
      }}
    >
      {/* Sticky container that holds everything */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 88,
        paddingBottom: 40,
      }}>
        {/* Top label band */}
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          marginTop: 16,
          opacity: stage0,
          transform: `translateY(${(1 - stage0) * -20}px)`,
          transition: 'transform 200ms var(--ease-out)',
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
          <ReadyBadge />
        </div>

        {/* Wordmark — center stage */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 var(--gutter)',
          position: 'relative',
        }}>
          <h1 className="wordmark" style={{
            fontSize: 'clamp(110px, 24vw, 380px)',
            color: 'var(--fg-1)',
            margin: 0,
            textAlign: 'center',
            width: '100%',
            transform: `translateY(${wmTransY}px) scale(${wmScale})`,
            transformOrigin: 'center center',
            transition: 'transform 90ms linear',
            position: 'relative',
            zIndex: 1,
          }}>
            Kair<span style={{ color: 'var(--accent)' }}>ó</span>s
          </h1>

          {/* Stats orbiting the wordmark — Stage 1 */}
          <FloatingStats opacity={stage1} progress={progress}/>

          {/* Manifesto — Stage 2 */}
          <Manifesto opacity={stage2}/>

          {/* CTA cluster — Stage 3 */}
          <CTACluster opacity={stage3}/>
        </div>

        {/* Stage indicator (bottom right) */}
        <StageIndicator progress={progress}/>

        {/* Scroll hint at start, fade out at stage 1 */}
        <ScrollHint opacity={opacityOut(0, 0.12)} />

        {/* Vertical date watermark */}
        <div style={{
          position: 'absolute',
          left: 'var(--gutter)',
          top: 88,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontSize: 10,
          letterSpacing: '0.3em',
          color: 'var(--fg-3)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-sans)',
          opacity: stage0 * 0.9 + 0.1,
        }}>
          Edifício · 2025 · MCZ-AL
        </div>
      </div>
    </section>
  );
}

function ReadyBadge() {
  return (
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
      <span className="pulse-dot" style={{
        width: 8, height: 8, borderRadius: '50%',
        background: '#fff',
      }}/>
      Pronto para morar
      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.55); }
          70%  { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        .pulse-dot { animation: pulse-ring 2.2s var(--ease-out) infinite; }
      `}</style>
    </div>
  );
}

/* Stats that float in around the wordmark.
   Position each label relative to viewport center, with a small parallax. */
function FloatingStats({ opacity, progress }) {
  // Each stat has anchor (corner) + label + value
  const stats = [
    { pos: 'tl', value: '87 → 149', unit: 'm²',     dx: -42, dy: -32 },
    { pos: 'tr', value: '3',         unit: 'quartos', dx:  42, dy: -32 },
    { pos: 'bl', value: '5 min',     unit: 'da praia',dx: -42, dy:  32 },
    { pos: 'br', value: '13',        unit: 'andares', dx:  42, dy:  32 },
  ];
  // Slight outward drift as progress moves
  const t = progress;
  const driftBase = 6 * t;

  return (
    <>
      {stats.map(s => {
        const px = s.dx;
        const py = s.dy;
        // Compute viewport corner offset
        let style = { position: 'absolute', opacity };
        if (s.pos === 'tl') { style.top   = `calc(${py}% - 0px)`; style.left  = `calc(${50 + px}% - 0px)`; }
        if (s.pos === 'tr') { style.top   = `calc(${py + 50}% + 0px)`; style.left  = `calc(${50 + px}% + 0px)`; }
        // Use simple absolute positioning via percentages
        return null;
      })}
      {/* Simpler: 4 absolute-positioned labels in corners around the wordmark */}
      <Stat label="área da unidade" value="87 → 149" unit="m²"
            style={{ top: '14%', left: '8%' }} opacity={opacity}/>
      <Stat label="tipologia" value="3" unit="quartos · 2 suítes"
            style={{ top: '14%', right: '8%', textAlign: 'right' }} opacity={opacity}/>
      <Stat label="até a faixa de areia" value="5 min" unit="de carro"
            style={{ bottom: '14%', left: '8%' }} opacity={opacity}/>
      <Stat label="torre única" value="13" unit="andares · 78 unidades"
            style={{ bottom: '14%', right: '8%', textAlign: 'right' }} opacity={opacity}/>
    </>
  );
}

function Stat({ label, value, unit, style, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      ...style,
      opacity,
      transform: `translateY(${(1 - opacity) * 12}px)`,
      transition: 'transform 200ms var(--ease-out)',
      zIndex: 2,
      maxWidth: 220,
    }}>
      <div style={{
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--fg-3)',
        marginBottom: 6,
        fontWeight: 500,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'clamp(28px, 3.4vw, 44px)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        color: 'var(--fg-1)',
      }}>{value}</div>
      <div className="t-serif" style={{ fontSize: 14, color: 'var(--fg-2)', marginTop: 4 }}>
        {unit}
      </div>
    </div>
  );
}

function Manifesto({ opacity }) {
  return (
    <div style={{
      position: 'absolute',
      left: '50%', bottom: '14%',
      transform: `translateX(-50%) translateY(${(1 - opacity) * 24}px)`,
      opacity,
      transition: 'transform 240ms var(--ease-out)',
      zIndex: 3,
      textAlign: 'center',
      maxWidth: 720,
      width: '100%',
      padding: '0 var(--gutter)',
    }}>
      <div style={{
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        marginBottom: 16,
        fontWeight: 500,
      }}>
        Edifício Kairós · Jatiúca
      </div>
      <div className="t-serif" style={{
        fontSize: 'clamp(20px, 2.4vw, 32px)',
        lineHeight: 1.3,
        color: 'var(--fg-1)',
      }}>
        O momento certo de morar bem<br/>é agora.
      </div>
    </div>
  );
}

function CTACluster({ opacity }) {
  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0,
      bottom: 48,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      opacity,
      transform: `translateY(${(1 - opacity) * 30}px)`,
      transition: 'transform 240ms var(--ease-out)',
      zIndex: 4,
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <a href="#plantas" className="btn btn--accent btn--lg" style={{ borderBottom: 'none' }}>
          Escolher unidade <span className="arrow">→</span>
        </a>
        <a href="#edificio" className="btn btn--ghost btn--lg" style={{ borderBottom: 'none' }}>
          Conhecer o edifício
        </a>
      </div>
      <div className="t-serif" style={{
        fontSize: 13,
        color: 'var(--fg-3)',
        maxWidth: 480,
        textAlign: 'center',
        marginTop: 8,
      }}>
        Rua Aureliano Teixeira de Vasconcelos, 57 · Jatiúca · 3 quartos · 87 a 149 m² · A cinco minutos da praia.
      </div>
    </div>
  );
}

/* Progress dot indicator — shows which stage you're in */
function StageIndicator({ progress }) {
  const stages = [0.0, 0.25, 0.6, 0.9];
  return (
    <div style={{
      position: 'absolute',
      right: 'var(--gutter)',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      zIndex: 5,
    }} aria-hidden="true">
      {stages.map((s, i) => {
        const active = progress >= s - 0.05;
        return (
          <span key={i} style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: active ? 'var(--accent)' : 'var(--border-strong)',
            transition: 'all 240ms var(--ease-out)',
            transform: active ? 'scale(1)' : 'scale(0.75)',
          }}/>
        );
      })}
    </div>
  );
}

function ScrollHint({ opacity }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      opacity,
      transition: 'opacity 200ms var(--ease-out)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      color: 'var(--fg-3)',
      zIndex: 1,
    }}>
      <span style={{
        fontSize: 10,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        fontWeight: 500,
      }}>Role para descobrir</span>
      <span className="scroll-ind" style={{
        width: 1, height: 32,
        background: 'linear-gradient(180deg, var(--fg-3), transparent)',
        display: 'inline-block',
      }}/>
      <style>{`
        @keyframes scroll-ind {
          0%   { transform: scaleY(0.2); transform-origin: top; }
          50%  { transform: scaleY(1);   transform-origin: top; }
          50.01% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0.2); transform-origin: bottom; }
        }
        .scroll-ind { animation: scroll-ind 1.8s var(--ease-in-out) infinite; }
      `}</style>
    </div>
  );
}

Object.assign(window, { HeroScrollytell });
