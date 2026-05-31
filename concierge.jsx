/* global React */
// Concierge Kairós — chat com IA via window.claude

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

const KNOWLEDGE = `
# Edifício Kairós — Base de conhecimento para o concierge IA

## Identidade
- Nome: Edifício Kairós
- Construtora: Delman Construtora (+40 anos em Maceió)
- Endereço: R. Aureliano Teixeira de Vasconcelos, 57 · Jatiúca · Maceió · AL
- Coordenadas: 09°39'52"S · 35°42'24"W
- Status: Entregue em 2025. Pronto para morar. Chaves na hora após assinatura.

## Tipologias (todas com 3 quartos, varanda, área de serviço, ≥2 suítes)
- 87m² — 3 quartos, 2 suítes. Tipo 01/06 (frontal/posterior). 2 vagas. Varanda 8m².
  A partir de R$ 890 mil. Status: últimas unidades.
- 97m² — 3 suítes, padrão alto. Tipo 02/05. 2 vagas amplas. Varanda gourmet 12m².
  A partir de R$ 1,12 mi. Status: disponível.
- 149m² — Cobertura. 3 suítes (master + closet duplo). 3 vagas. Varanda gourmet 28m² com churrasqueira.
  Investimento sob consulta. Status: última unidade.

## Edifício (estrutura)
- 13 andares, 78 unidades totais.
- Pisos 1–12: 6 unidades por andar.
- Piso 13: 3 coberturas.
- Vista: unidades 01 e 06 = frente para o mar de Jatiúca. 02 e 05 = lateral / bairro. 03 e 04 = posterior / interna.

## Lazer (mais de 30 espaços)
Água & relaxamento: piscina adulto com prainha, piscina infantil, hidromassagem, sauna e ofurô, spa com sala de massagem, espaço beleza feminino.
Fitness: academia/crossfit, estúdio de yoga e pilates, mini quadra de futebol, mini muro de escalada, mini golfe, garagem band (música).
Convívio: espaço gourmet com churrasqueira, salão de festas, sports bar, coworking, sala de estudos e jogos, brinquedoteca, berçário/sala bebê, ateliê de artes, lounge ao ar livre, playground.
Serviços: concierge na entrada, sala de e-commerce/encomendas, compartilhamento de bikes/patinetes, pranchas/SUPs/caiaques compartilhados, lavagem a seco para carros, bicicletário e oficina, pet place.

## Localização (distâncias)
- Praia de Jatiúca: 5 min de carro (menos de 10 min a pé)
- Maceió Shopping: 7 min
- Hospital Memorial: 9 min
- Pajuçara: 10 min
- Aeroporto Zumbi dos Palmares: 22 min
- Restaurantes, padarias, academias e escolas no entorno imediato — sem precisar pegar a Mangabeiras.

## Sustentabilidade
- Energia solar fotovoltaica (abate conta das áreas comuns)
- Gerador automático: 100% nas áreas comuns + iluminação + tomada da cozinha em cada apto
- Reuso de água da chuva + condensador do ar-condicionado
- Hidrômetro individual (paga só pelo que consome)
- LED em tudo (áreas comuns + elevadores VVF)
- Carregadores para carros elétricos instalados na garagem

## Financiamento e compra
- Financie em qualquer banco (Caixa, Itaú, Bradesco, Santander, etc.) OU direto com a construtora em até 100 meses.
- Chaves entregues na hora após assinatura — não há espera de obra.
- Tabela completa de preços disponível por e-mail ou WhatsApp.

## Contato
- WhatsApp: (82) 99682-3219 — resposta na hora
- Telefone: (82) 3131-1505 — plantão comercial
- E-mail: contato@delman.com.br
- Instagram: @delmanconstrutora
- Stand de vendas no próprio prédio · Seg a sex 9h–18h · Sáb 9h–13h

## Tom da resposta
- Português brasileiro, formal-amigável, usando "você"
- Direto, sem floreios. Números > adjetivos.
- 1–3 parágrafos curtos. NUNCA mais que 120 palavras.
- Se a pergunta for sobre algo fora do escopo (ex: outro prédio, mercado em geral, política), redirecione gentilmente para falar do Kairós ou sugerir contato direto.
- Se não souber, diga "essa não tenho aqui — peça no WhatsApp (82) 99682-3219 que responde na hora".
- Se a pessoa demonstrar interesse claro de compra, sugira sempre agendar visita ou pedir a tabela.
- NÃO use markdown, listas com asterisco, ou negrito — apenas texto corrido natural.
- NÃO invente preços, datas, ou dados que não estão acima.
`;

const SUGESTOES = [
  'Qual a diferença entre o 87 e o 97?',
  'Tem unidade com vista pro mar?',
  'Posso financiar pelo Itaú?',
  'Quanto tempo até a praia?',
  'Tem academia e piscina?',
  'Aceita pet?',
];

const INITIAL = [
  {
    role: 'assistant',
    content: 'Oi! Sou o concierge do Kairós. Pergunte qualquer coisa sobre o edifício — plantas, valores, localização, lazer, financiamento. Respondo na hora.',
  },
];

function Concierge() {
  const [open, setOpen] = useStateC(false);
  const [messages, setMessages] = useStateC(INITIAL);
  const [input, setInput] = useStateC('');
  const [loading, setLoading] = useStateC(false);
  const [error, setError] = useStateC(null);
  const [unread, setUnread] = useStateC(0);
  const scrollRef = useRefC(null);
  const inputRef = useRefC(null);

  // Auto-scroll on new message
  useEffectC(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus on open
  useEffectC(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 80);
      setUnread(0);
    }
  }, [open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setError(null);

    // Build prompt — system context + chat history
    const history = newHistory
      .map(m => `${m.role === 'user' ? 'Pessoa' : 'Concierge'}: ${m.content}`)
      .join('\n\n');
    const prompt = `Você é o concierge digital do Edifício Kairós. Use APENAS o conhecimento abaixo. Responda à última mensagem da pessoa.\n\n${KNOWLEDGE}\n\n---\n\nHistórico da conversa:\n\n${history}\n\nConcierge:`;

    try {
      const reply = await window.claude.complete(prompt);
      setMessages([...newHistory, { role: 'assistant', content: (reply || '').trim() }]);
      if (!open) setUnread(u => u + 1);
    } catch (err) {
      setError('Tive um problema técnico aqui. Tente de novo, ou fale com a gente no WhatsApp: (82) 99682-3219.');
      setMessages([...newHistory, { role: 'assistant', content: 'Tive um problema técnico aqui. Tente de novo, ou fale com a gente no WhatsApp: (82) 99682-3219.' }]);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="concierge-fab"
        aria-label={open ? 'Fechar concierge' : 'Abrir concierge Kairós'}
        style={{
          position: 'fixed',
          right: 24, bottom: 92,
          zIndex: 70,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: open ? 'var(--k-cocoa)' : 'var(--fg-1)',
          color: open ? 'var(--bg-1)' : 'var(--bg-1)',
          padding: '14px 18px',
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 14px 34px rgba(26,24,23,.32)',
          fontWeight: 500,
          fontSize: 14,
          transition: 'all 220ms var(--ease-out)',
          fontFamily: 'inherit',
        }}
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: '50%',
          background: 'var(--accent)', color: '#fff',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700,
          fontSize: 13, letterSpacing: '-0.02em',
        }}>K</span>
        <span className="concierge-label">
          {open ? 'Fechar' : 'Pergunte ao Kairós'}
        </span>
        {!open && unread > 0 && (
          <span style={{
            background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600,
            padding: '2px 7px', borderRadius: 999, marginLeft: 4,
          }}>{unread}</span>
        )}
      </button>

      {/* Chat panel */}
      <div
        role="dialog"
        aria-hidden={!open}
        className="concierge-panel"
        style={{
          position: 'fixed',
          right: 24, bottom: 152,
          zIndex: 69,
          width: 'min(380px, calc(100vw - 32px))',
          height: 'min(560px, calc(100vh - 200px))',
          background: 'var(--bg-3)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: '0 24px 64px rgba(0,0,0,.18), 0 4px 12px rgba(0,0,0,.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.98)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'all 240ms var(--ease-out)',
          transformOrigin: 'bottom right',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--bg-2)',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--accent)', color: '#fff',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 700,
            fontSize: 20, letterSpacing: '-0.02em',
          }}>K</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--fg-1)' }}>
              Kairós · Concierge
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--k-leaf)',
              }}/>
              Online · responde na hora
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--fg-3)', cursor: 'pointer',
              padding: 6, fontSize: 18,
              width: 32, height: 32, borderRadius: '50%',
            }}
            aria-label="Fechar"
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >×</button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            background: 'var(--bg-3)',
            scrollBehavior: 'smooth',
          }}
        >
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>{m.content}</Bubble>
          ))}
          {loading && <TypingBubble/>}
          {messages.length <= 1 && !loading && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                fontSize: 11, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--fg-3)',
                fontWeight: 500, marginBottom: 4,
              }}>Sugestões</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {SUGESTOES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="concierge-chip"
                    style={{
                      textAlign: 'left',
                      background: 'var(--bg-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 999,
                      padding: '8px 14px',
                      fontSize: 13,
                      color: 'var(--fg-1)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'border-color 140ms, background 140ms',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{
          padding: 12,
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-2)',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pergunte algo…"
            disabled={loading}
            style={{
              flex: 1,
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              padding: '11px 16px',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              color: 'var(--fg-1)',
              transition: 'border-color 140ms',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? 'var(--accent)' : 'var(--border-strong)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 40, height: 40,
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              fontSize: 16,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 160ms var(--ease-out)',
            }}
            aria-label="Enviar"
          >↑</button>
        </form>
      </div>

      <style>{`
        @media (max-width: 520px) {
          .concierge-label { display: none; }
          .concierge-fab { padding: 12px !important; }
          .concierge-panel { right: 16px !important; bottom: 140px !important; }
        }
      `}</style>
    </>
  );
}

function Bubble({ role, children }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      animation: 'msg-in 280ms var(--ease-out)',
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '10px 14px',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser ? 'var(--accent)' : 'var(--bg-2)',
        color: isUser ? 'var(--fg-on-accent)' : 'var(--fg-1)',
        border: isUser ? 'none' : '1px solid var(--border)',
        fontSize: 14,
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
      }}>
        {children}
      </div>
      <style>{`
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

function TypingBubble() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{
        padding: '14px 16px',
        borderRadius: '14px 14px 14px 4px',
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        display: 'inline-flex',
        gap: 5,
        alignItems: 'center',
      }}>
        <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-3)', animation: 'typing 1s infinite' }}/>
        <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-3)', animation: 'typing 1s infinite .15s' }}/>
        <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-3)', animation: 'typing 1s infinite .3s' }}/>
      </div>
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { Concierge });
