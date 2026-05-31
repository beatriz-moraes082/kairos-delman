/* global React, Eyebrow, KMark, Cross */
// Sections 4: CTA / Contato (multi-step form), Footer, WhatsApp float

const { useState: useState4, useEffect: useEffect4, useMemo: useMemo4, useRef: useRef4 } = React;

/* ------------------------------------------------------------------ */
/* CTA / CONTATO                                                       */
/* ------------------------------------------------------------------ */
function CTA() {
  return (
    <section id="contato" data-screen-label="Contato" className="section section--dark" style={{
      paddingTop: 'var(--space-9)', paddingBottom: 'var(--space-9)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Giant ghost K monogram */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '-4%',
        bottom: '-10%',
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: 'clamp(400px, 60vw, 880px)',
        lineHeight: 0.8,
        color: 'rgba(152,37,50,0.09)',
        pointerEvents: 'none',
        zIndex: 0,
      }}>K</div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <PriceForm />
        </div>
      </div>
    </section>
  );
}

function ContactChannels() {
  return (
    <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <a
        href="https://wa.me/5582996823219"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'none', borderBottom: 'none',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: 28,
          borderRadius: 6,
          color: 'var(--fg-on-dark)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          transition: 'border-color 200ms, background 200ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--k-terra-glow)'; e.currentTarget.style.background = 'rgba(139,35,50,0.10)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--k-terra-glow)' }}>WhatsApp</span>
          <span style={{ fontSize: 12, color: 'rgba(239,235,227,0.55)' }}>Resposta na hora</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 28, letterSpacing: '-0.01em', marginTop: 8,
        }}>
          (82) 99682-3219
        </div>
      </a>

      <a
        href="tel:+558231311505"
        style={{
          textDecoration: 'none', borderBottom: 'none',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: 28,
          borderRadius: 6,
          color: 'var(--fg-on-dark)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          transition: 'border-color 200ms, background 200ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--k-terra-glow)'; e.currentTarget.style.background = 'rgba(139,35,50,0.10)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--k-terra-glow)' }}>Telefone</span>
          <span style={{ fontSize: 12, color: 'rgba(239,235,227,0.55)' }}>Plantão comercial</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 28, letterSpacing: '-0.01em', marginTop: 8,
        }}>
          (82) 3131-1505
        </div>
      </a>

      <div style={{
        marginTop: 8, paddingTop: 28,
        borderTop: '1px solid rgba(255,255,255,0.12)',
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', color: 'rgba(239,235,227,0.55)', marginBottom: 16 }}>
          STAND DE VENDAS
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(239,235,227,0.85)' }}>
          R. Aureliano Teixeira de Vasconcelos, 57<br/>
          Jatiúca · Maceió · AL
        </div>
        <div className="t-serif" style={{ marginTop: 12, fontSize: 14, color: 'rgba(239,235,227,0.6)' }}>
          Seg a sex 9h–18h · Sáb 9h–13h
        </div>
      </div>
    </div>
  );
}

/* Multi-step price-request form with masked phone and validation */
const TIPOLOGIAS = [
  '87m² 3 quartos 2 suítes',
  '97m² 3 suítes',
  '149m² cobertura',
  'Quero conhecer todas',
];
const PRAZOS = [
  'Nos próximos 3 meses',
  'Entre 3 e 6 meses',
  'Ainda estou pesquisando',
  'Compra para investimento',
];

function maskPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2)  return d.length ? `(${d}` : '';
  if (d.length <= 6)  return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function PriceForm() {
  const [step, setStep] = useState4(0);
  const [data, setData] = useState4({ nome: '', email: '', whats: '', tipo: '', prazo: '' });
  const [errors, setErrors] = useState4({});
  const [submitted, setSubmitted] = useState4(false);

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!data.nome.trim() || data.nome.trim().split(' ').length < 2) e.nome = 'Digite seu nome completo.';
      if (!validEmail(data.email)) e.email = 'E-mail inválido.';
      if (data.whats.replace(/\D/g, '').length < 10) e.whats = 'WhatsApp inválido.';
    } else if (step === 1) {
      if (!data.tipo) e.tipo = 'Escolha uma tipologia.';
    } else if (step === 2) {
      if (!data.prazo) e.prazo = 'Selecione uma opção.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 2) {
      setSubmitted(true);
    } else {
      setStep(step + 1);
    }
  };
  const prev = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="reveal" style={{
      background: 'var(--bg-1)',
      color: 'var(--fg-1)',
      borderRadius: 6,
      padding: 'clamp(28px, 4vw, 48px)',
      position: 'relative',
    }}>
      {submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '24px 0' }}>
          <span style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--k-leaf-soft)', color: 'var(--k-leaf)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>✓</span>
          <h3 className="t-h2" style={{ fontFamily: 'var(--font-display)' }}>
            Obrigado, {data.nome.split(' ')[0]}.
          </h3>
          <p className="t-body-lg" style={{ color: 'var(--fg-2)', maxWidth: 440 }}>
            A tabela com plantas, valores e condições foi enviada para <strong style={{ color: 'var(--fg-1)' }}>{data.email}</strong>.<br/>
            Nosso time entra em contato pelo WhatsApp em até 1h útil.
          </p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => { setSubmitted(false); setStep(0); setData({ nome: '', email: '', whats: '', tipo: '', prazo: '' }); }}
            style={{ alignSelf: 'flex-start', marginTop: 16 }}
          >
            Enviar outra solicitação
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div className="t-eyebrow" style={{ color: 'var(--accent)' }}>Receba a tabela</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28,
                marginTop: 8, color: 'var(--fg-1)',
              }}>
                Receba a tabela de preços.
              </h3>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 6 }}>
                Plantas detalhadas, valores e condições, direto no seu e-mail.
              </p>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.22em', fontWeight: 500 }}>
              ETAPA {step + 1}/3
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= step ? 'var(--accent)' : 'var(--border)',
                transition: 'background 220ms var(--ease-out)',
              }}/>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); next(); }}>
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Field label="Nome completo" error={errors.nome}>
                  <input
                    type="text"
                    value={data.nome}
                    onChange={(e) => update('nome', e.target.value)}
                    placeholder="Como você gostaria de ser chamado(a)?"
                    autoFocus
                  />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="field-row">
                  <Field label="E-mail" error={errors.email}>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="seu@email.com.br"
                    />
                  </Field>
                  <Field label="WhatsApp" error={errors.whats}>
                    <input
                      type="tel"
                      value={data.whats}
                      onChange={(e) => update('whats', maskPhone(e.target.value))}
                      placeholder="(82) 99999-9999"
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Label>Qual tipologia te interessa?</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TIPOLOGIAS.map(opt => (
                    <RadioCard
                      key={opt}
                      checked={data.tipo === opt}
                      onChange={() => update('tipo', opt)}
                      label={opt}
                    />
                  ))}
                </div>
                {errors.tipo && <ErrorText>{errors.tipo}</ErrorText>}
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Label>Quando você gostaria de se mudar?</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PRAZOS.map(opt => (
                    <RadioCard
                      key={opt}
                      checked={data.prazo === opt}
                      onChange={() => update('prazo', opt)}
                      label={opt}
                    />
                  ))}
                </div>
                {errors.prazo && <ErrorText>{errors.prazo}</ErrorText>}
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: 12,
              marginTop: 28,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {step > 0 ? (
                <button type="button" onClick={prev} className="btn btn--ghost btn--sm" style={{ borderBottom: 'none' }}>
                  ← Voltar
                </button>
              ) : <span/>}
              <button type="submit" className="btn btn--accent" style={{ borderBottom: 'none' }}>
                {step === 2 ? 'Quero a tabela e agendar visita' : 'Continuar'}
                <span className="arrow">→</span>
              </button>
            </div>
          </form>

          <p style={{
            marginTop: 24, paddingTop: 16,
            borderTop: '1px solid var(--border)',
            fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.02em',
          }}>
            Seus dados são confidenciais. Não enviamos spam.
          </p>
        </>
      )}

      <style>{`
        @media (max-width: 520px) {
          .field-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Label>{label}</Label>
      <div style={{
        position: 'relative',
        borderBottom: error ? '1.5px solid var(--k-clay)' : '1.5px solid var(--border-strong)',
        transition: 'border-color 140ms var(--ease-out)',
      }}>
        {React.cloneElement(children, {
          style: {
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '12px 0',
            width: '100%',
            fontSize: 16,
            fontFamily: 'inherit',
            color: 'var(--fg-1)',
          },
          onFocus: (e) => { e.target.parentElement.style.borderColor = 'var(--accent)'; },
          onBlur:  (e) => { e.target.parentElement.style.borderColor = error ? 'var(--k-clay)' : 'var(--border-strong)'; },
        })}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  );
}

function Label({ children }) {
  return (
    <span style={{
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--fg-3)',
      fontWeight: 500,
    }}>{children}</span>
  );
}

function ErrorText({ children }) {
  return (
    <span style={{ fontSize: 12, color: 'var(--k-clay)' }}>{children}</span>
  );
}

function RadioCard({ checked, onChange, label }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 18px',
      border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 4,
      cursor: 'pointer',
      background: checked ? 'var(--accent-soft)' : 'transparent',
      transition: 'all 160ms var(--ease-out)',
    }}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border-strong)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}/>}
      </span>
      <span style={{ fontSize: 15, color: 'var(--fg-1)' }}>{label}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* FOOTER                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer style={{
      background: 'var(--k-bone)',
      color: 'var(--fg-1)',
      paddingTop: 80,
      paddingBottom: 32,
      borderTop: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="wordmark reveal" style={{
          fontSize: 'clamp(100px, 22vw, 360px)',
          color: 'var(--fg-1)',
          margin: 0,
          lineHeight: 0.84,
          letterSpacing: '-0.04em',
        }}>
          Kair<span style={{ color: 'var(--accent)' }}>ó</span>s
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: 'clamp(24px, 4vw, 56px)',
          marginTop: 64,
          paddingTop: 40,
          borderTop: '1px solid var(--border)',
        }} className="footer-grid">
          <div>
            <div className="t-eyebrow">Construtora Delman</div>
            <p style={{ fontSize: 14, color: 'var(--fg-2)', maxWidth: 460, marginTop: 12, lineHeight: 1.6 }}>
              Construindo bairros, gerações e relações de confiança em Maceió há mais de 40 anos. O Edifício Kairós faz parte do nosso portfólio de entregas em Jatiúca.
            </p>
          </div>

          <div>
            <div className="t-eyebrow">Visite</div>
            <div style={{ fontSize: 14, color: 'var(--fg-2)', marginTop: 12, lineHeight: 1.65 }}>
              Stand Kairós<br/>
              R. Aureliano Teixeira<br/>de Vasconcelos, 57 · Jatiúca
            </div>
            <div className="t-serif" style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 12 }}>
              Seg a sex 9h–18h · Sáb 9h–13h
            </div>
          </div>

          <div>
            <div className="t-eyebrow">Contato</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <li><a href="tel:+558231311505" style={{ color: 'var(--fg-1)', borderBottom: 'none' }}>(82) 3131-1505</a></li>
              <li><a href="https://wa.me/5582996823219" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fg-1)', borderBottom: 'none' }}>(82) 99682-3219 · WhatsApp</a></li>
              <li><a href="mailto:contato@delman.com.br" style={{ color: 'var(--fg-1)', borderBottom: 'none' }}>contato@delman.com.br</a></li>
              <li><a href="#" style={{ color: 'var(--fg-1)', borderBottom: 'none' }}>@delmanconstrutora</a></li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: 56, paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
          fontSize: 11, letterSpacing: '0.04em', color: 'var(--fg-3)',
        }}>
          <div>© Delman Construtora</div>
          <a href="https://trilhaperformance.com.br" target="_blank" rel="noopener noreferrer"
             style={{
               display: 'inline-flex', alignItems: 'center', gap: 8,
               color: 'var(--fg-3)', borderBottom: 'none', textDecoration: 'none',
             }}>
            <span>Desenvolvido pela</span>
            <img src="imagens/trilha-logo.png" alt="Trilha"
                 style={{ height: 18, width: 'auto', display: 'block' }}
                 onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.insertAdjacentHTML('afterend', '<strong style=\"color:var(--fg-2)\">Trilha</strong>'); }} />
          </a>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Floating WhatsApp                                                    */
/* ------------------------------------------------------------------ */
function FloatZap() {
  return (
    <a
      href="https://wa.me/5582996823219?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20o%20Edif%C3%ADcio%20Kair%C3%B3s."
      target="_blank"
      rel="noopener noreferrer"
      className="float-zap"
      style={{ borderBottom: 'none' }}
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.001 5.333c-5.886 0-10.666 4.776-10.667 10.664a10.62 10.62 0 0 0 1.491 5.435L5.333 26.667l5.439-1.426a10.65 10.65 0 0 0 5.226 1.328h.005c5.886 0 10.665-4.778 10.667-10.665 0-2.85-1.108-5.527-3.121-7.541a10.6 10.6 0 0 0-7.548-3.13zm0 19.55a8.86 8.86 0 0 1-4.503-1.231l-.323-.192-3.347.878.892-3.262-.21-.335a8.85 8.85 0 0 1-1.355-4.726c.002-4.892 3.984-8.872 8.882-8.872a8.83 8.83 0 0 1 6.276 2.6 8.81 8.81 0 0 1 2.598 6.279c-.002 4.893-3.984 8.86-8.91 8.86zm4.86-6.629c-.265-.135-1.575-.778-1.819-.867-.244-.089-.422-.135-.6.135s-.687.867-.842 1.046c-.155.178-.31.2-.575.067-.265-.134-1.123-.413-2.14-1.318-.79-.704-1.323-1.572-1.478-1.838-.155-.265-.018-.408.115-.541.119-.118.265-.31.4-.465s.178-.265.265-.443c.089-.178.045-.331-.022-.465-.067-.135-.6-1.444-.822-1.976-.215-.519-.434-.448-.6-.456-.156-.008-.334-.01-.512-.01a.98.98 0 0 0-.71.331c-.244.265-.93.911-.93 2.221s.952 2.576 1.085 2.754c.135.178 1.876 2.866 4.547 4.019.635.275 1.131.439 1.518.561.638.203 1.218.174 1.677.106.512-.076 1.575-.643 1.797-1.265s.222-1.154.155-1.265c-.067-.111-.245-.178-.51-.312z"/>
      </svg>
      <span className="label">WhatsApp</span>
    </a>
  );
}

Object.assign(window, { CTA, Footer, FloatZap });
