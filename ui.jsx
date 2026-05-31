/* global React */
// Shared UI primitives for Edifício Kairós landing

const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

/* ------------------------------------------------------------------ */
/* Eyebrow — small label with index + slash + title                    */
/* ------------------------------------------------------------------ */
function Eyebrow({ index, children, style }) {
  return (
    <div className="t-eyebrow" style={style}>
      {index && <span style={{ color: 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>{index}</span>}
      {index && <span style={{ color: 'var(--fg-4)' }}>/</span>}
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kairós K monogram — serif italic, single glyph                      */
/* ------------------------------------------------------------------ */
function KMark({ size = 28, color }) {
  return (
    <span
      className="k-monogram"
      style={{
        fontSize: size,
        color: color || 'var(--accent)',
        width: size * 0.85,
        height: size,
      }}
      aria-hidden="true"
    >
      K
    </span>
  );
}

/* Full lockup: K + wordmark "Kairós" + tagline "DELMAN" */
function KairosLockup({ light = false, compact = false }) {
  const inkColor = light ? 'var(--fg-on-dark)' : 'var(--fg-1)';
  const accColor = 'var(--accent)';
  return (
    <a href="#top" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none',
      color: inkColor,
      borderBottom: 'none',
    }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: compact ? 26 : 30,
        color: accColor,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        transform: 'translateY(-1px)',
      }}>K</span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 2 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: compact ? 17 : 19,
          letterSpacing: '-0.01em',
          color: inkColor,
        }}>Kairós</span>
        <span style={{
          fontSize: 9,
          letterSpacing: '0.28em',
          color: 'var(--fg-3)',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}>Delman</span>
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal — IntersectionObserver-driven fade-up                        */
/* ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/* Image placeholder — sophisticated, with subject hint                */
/* ------------------------------------------------------------------ */
function ImgPlaceholder({ subject = 'imagem', tone = 'sand', ratio = '4/3', style, children, src, alt, fit = 'cover' }) {
  // tones: sand (default), sky, water, terra, dark, foliage
  const palettes = {
    sand:   ['#E8DAB8', '#C8B287'],
    sky:    ['#C9D6DB', '#9FB4BB'],
    water:  ['#A7C1C4', '#6E8E92'],
    terra:  ['#C89476', '#A56849'],
    dark:   ['#3A322B', '#211C17'],
    foliage:['#A3AB87', '#6E7B5A'],
    cream:  ['#F2EBD9', '#D9CDB1'],
  };
  const [c1, c2] = palettes[tone] || palettes.sand;
  const isDark = tone === 'dark' || tone === 'water' || tone === 'foliage';

  // Real photo mode: when a src is provided, render the image filling the frame.
  if (src) {
    return (
      <div
        className="imgp"
        style={{
          aspectRatio: ratio,
          background: fit === 'contain' ? 'transparent' : 'var(--bg-2)',
          ...style,
        }}
      >
        <img
          src={src}
          alt={alt || (typeof children === 'string' ? children : subject)}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: fit, objectPosition: 'center',
            zIndex: 0,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="imgp"
      style={{
        aspectRatio: ratio,
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        color: isDark ? 'rgba(255,255,255,.85)' : 'var(--k-cocoa)',
        ...style,
      }}
    >
      {/* architectural ghost lines */}
      <svg
        viewBox="0 0 200 150"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <pattern id={`g-${subject}-${tone}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={isDark ? '#fff' : '#2B2622'} strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="200" height="150" fill={`url(#g-${subject}-${tone})`} />
      </svg>
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        textAlign: 'center', padding: 24,
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 14,
          opacity: 0.6,
        }}>{children || subject}</span>
        <span style={{
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: 0.45,
        }}>imagem ilustrativa</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Animated counter (for "+8 services", "12 spaces", etc.)            */
/* ------------------------------------------------------------------ */
function CountUp({ to, prefix = '', suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          setStarted(true);
          const start = performance.now();
          const target = parseInt(to, 10);
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration, started]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{String(val).padStart(2, '0')}{suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Asterisk-as-bullet (echoes the brand) — but architectural cross    */
/* ------------------------------------------------------------------ */
function Cross({ size = 10, color = 'var(--accent)', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      style={{ flexShrink: 0, display: 'inline-block', ...style }}
      aria-hidden="true"
    >
      <path d="M5 0v10M0 5h10" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Expose                                                              */
/* ------------------------------------------------------------------ */
Object.assign(window, {
  Eyebrow, KMark, KairosLockup, useReveal, ImgPlaceholder, CountUp, Cross,
});
