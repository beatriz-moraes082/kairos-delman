/* global React, ReactDOM,
   Nav, Hero, Intro, Stats, WhyNow, Plantas, Lazer,
   Galeria, Localizacao, Sustentabilidade, CTA, Footer, FloatZap,
   FloorSelector, Concierge,
   NAV_ITEMS, useReveal,
   useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakToggle */

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "hero": "fullbleed",
  "typestyle": "editorial",
  "density": "default",
  "plantas": "cards",
  "bg": "pedra",
  "concierge": false
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULS);
  const [active, setActive] = useState('top');

  // reveal-on-scroll
  useReveal();

  // Apply density + typestyle + bg as body attrs
  useEffect(() => {
    document.body.dataset.density = tweaks.density;
    document.body.dataset.typestyle = tweaks.typestyle;
    document.body.dataset.bg = tweaks.bg;
  }, [tweaks.density, tweaks.typestyle, tweaks.bg]);

  // Scroll-spy
  useEffect(() => {
    const ids = NAV_ITEMS.map(n => n.id);
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      // pick the entry with highest intersection ratio
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.1, 0.3, 0.5] });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Nav activeSection={active} />
      <main>
        <Hero variant={tweaks.hero} />
        <Intro />
        <Stats />
        <FloorSelector />
        <Plantas layout={tweaks.plantas} />
        <Galeria />
        <Localizacao />
        <Sustentabilidade />
        <CTA />
      </main>
      <Footer />
      <FloatZap />
      {tweaks.concierge && <Concierge />}

      <TweaksPanel title="Tweaks · Kairós">
        <TweakSection label="Fundo">
          <TweakSelect
            label="Paleta de fundo"
            value={tweaks.bg}
            onChange={v => setTweak('bg', v)}
            options={[
              { value: 'pedra',   label: 'Pedra, cinza-fria (padrão)' },
              { value: 'algodao', label: 'Algodão, branco puro' },
              { value: 'areia',   label: 'Areia, bege quente' },
              { value: 'blush',   label: 'Blush, eco do bordô' },
              { value: 'grafite', label: 'Grafite, modo escuro' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Hero">
          <TweakSelect
            label="Tratamento"
            value={tweaks.hero}
            onChange={v => setTweak('hero', v)}
            options={[
              { value: 'scrollytell', label: 'Scrollytelling (padrão)' },
              { value: 'wordmark',    label: 'Wordmark gigante estático' },
              { value: 'split',       label: 'Split: foto + texto' },
              { value: 'fullbleed',   label: 'Full-bleed com overlay' },
              { value: 'editorial',   label: 'Editorial: muito branco' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Tipografia">
          <TweakRadio
            label="Estilo"
            value={tweaks.typestyle}
            onChange={v => setTweak('typestyle', v)}
            options={[
              { value: 'editorial', label: 'Editorial' },
              { value: 'serious',   label: 'Sério' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Densidade">
          <TweakRadio
            label="Ritmo"
            value={tweaks.density}
            onChange={v => setTweak('density', v)}
            options={[
              { value: 'compact',  label: 'Compacto' },
              { value: 'default',  label: 'Padrão' },
              { value: 'spacious', label: 'Espaçoso' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Plantas">
          <TweakSelect
            label="Disposição"
            value={tweaks.plantas}
            onChange={v => setTweak('plantas', v)}
            options={[
              { value: 'cards',   label: 'Cards com abas + planta' },
              { value: 'table',   label: 'Tabela editorial' },
              { value: 'compare', label: 'Comparador lado a lado' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Concierge IA">
          <TweakToggle
            label="Mostrar botão"
            value={tweaks.concierge}
            onChange={v => setTweak('concierge', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
