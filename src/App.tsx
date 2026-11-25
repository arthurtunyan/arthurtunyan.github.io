import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {CommandPalette} from '@astryxdesign/core/CommandPalette';
import {Divider} from '@astryxdesign/core/Divider';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Kbd} from '@astryxdesign/core/Kbd';
import {Link} from '@astryxdesign/core/Link';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {createStaticSource} from '@astryxdesign/core/Typeahead';
import {VStack} from '@astryxdesign/core/VStack';
import {AsciiField, BusinessCard, Cursor, Scramble, useClock} from './fx';
import * as C from './content';

const NAV = [
  {id: 'work', label: 'work'},
  {id: 'research', label: 'research'},
  {id: 'building', label: 'building'},
  {id: 'projects', label: 'projects'},
  {id: 'record', label: 'record'},
  {id: 'contact', label: 'contact'},
];

const go = (id: string) => document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});

/** Left rail label + right column body. The rail sticks while the section scrolls. */
function Chapter({id, label, meta, title, children}: {id: string; label: string; meta: string; title: ReactNode; children: ReactNode}) {
  return (
    <section id={id} className="chapter gutter">
      <VStack gap={1} className="rail">
        <Text type="code" color="primary">/{label}</Text>
        <Text type="code" color="secondary">{meta}</Text>
      </VStack>
      <VStack gap={8} className="chapter-body">
        <Heading level={2} className="chapter-title reveal" textWrap="balance">{title}</Heading>
        {children}
      </VStack>
    </section>
  );
}

export default function App() {
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isFlipped, setFlipped] = useState(false);
  const toast = useToast();
  const clock = useClock('America/Los_Angeles');

  const copyEmail = () => {
    navigator.clipboard.writeText(C.EMAIL).then(
      () => toast({body: 'Email copied'}),
      () => {
        const el = document.querySelector('.email');
        if (el) window.getSelection()?.selectAllChildren(el);
        toast({body: 'Email selected. Press ⌘C to copy it.'});
      },
    );
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const commands = useMemo(
    () => [
      ...NAV.map((n) => ({id: `go:${n.id}`, label: `Go to /${n.label}`, run: () => go(n.id)})),
      {id: 'copy', label: 'Copy email address', run: copyEmail},
      {id: 'flip', label: 'Flip the business card', run: () => { go('contact'); setFlipped((f) => !f); }},
      {id: 'top', label: 'Back to top', run: () => window.scrollTo({top: 0, behavior: 'smooth'})},
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const source = useMemo(() => createStaticSource(commands), [commands]);

  return (
    <>
      <Cursor />
      <span className="progress" aria-hidden="true" />

      <header className="topbar gutter">
        <HStack gap={4} align="center" justify="between">
          <Link href="#top" color="primary" className="mark" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <Text type="code" color="inherit" weight="semibold">AT/</Text>
            <Text type="code" color="secondary" className="hide-sm">arthur tunyan</Text>
          </Link>
          <HStack as="nav" gap={4} align="center" className="nav hide-md" aria-label="Sections">
            {NAV.map((n) => (
              <Link key={n.id} href={`#${n.id}`} color="secondary" className="nav-link" onClick={(e) => { e.preventDefault(); go(n.id); }}>
                <Text type="code" color="inherit">/<Scramble text={n.label} onHover /></Text>
              </Link>
            ))}
          </HStack>
          <HStack gap={3} align="center">
            <Text type="code" color="secondary" hasTabularNumbers className="hide-sm">BUR {clock}</Text>
            <Button label="Menu" size="sm" variant="secondary" onClick={() => setPaletteOpen(true)}>
              <HStack gap={1} align="center">
                <Text type="code" color="inherit">menu</Text>
                <Kbd keys="mod+k" />
              </HStack>
            </Button>
          </HStack>
        </HStack>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <AsciiField />
          <VStack gap={6} className="hero-inner gutter">
            <HStack gap={3} align="center" className="load load-1">
              <StatusDot variant="accent" isPulsing label="Based in Burbank" tooltip="Based in Burbank" />
              <Text type="code" color="secondary">34.1808° N · 118.3090° W · Burbank, California</Text>
            </HStack>
            <Heading level={1} className="hero-name">
              <Scramble text="Arthur" delay={6} className="hero-line" />{' '}
              <Scramble text="Tunyan" delay={16} className="hero-line hero-line-2" />
            </Heading>
            <HStack gap={2} wrap="wrap" className="headline load load-2">
              {C.headline.map((h) => (
                <Text key={h} type="code" color="primary" className="chip">{h}</Text>
              ))}
            </HStack>
            <Text as="p" type="large" color="secondary" className="intro load load-3" textWrap="pretty">{C.intro}</Text>
            <HStack gap={3} align="center" wrap="wrap" className="load load-4">
              <Button label="See the work" variant="primary" size="lg" onClick={() => go('projects')} />
              <Button label="Now building: Smoke Signal" variant="ghost" size="lg" onClick={() => go('building')} />
            </HStack>
          </VStack>
          <HStack gap={2} align="center" justify="between" className="hero-foot gutter load load-5">
            <Text type="code" color="secondary">scroll</Text>
            <span className="scroll-line" aria-hidden="true" />
            <Text type="code" color="secondary" className="hide-sm">press <Kbd keys="mod+k" /> anywhere</Text>
          </HStack>
        </section>

        {/* WORK */}
        <Chapter id="work" label="work" meta={`${C.roles.length} roles · current`} title="Where I work now">
          <VStack gap={0} className="ledger">
            {C.roles.map((r) => (
              <Grid key={r.title} columns={3} gap={6} className="ledger-row reveal">
                <Text type="code" color="secondary" hasTabularNumbers>{r.when}</Text>
                <VStack gap={1}>
                  <Text type="large" weight="medium">{r.title}</Text>
                  <Text type="supporting">{r.org} · {r.where}</Text>
                </VStack>
                <Text as="p" color="secondary" textWrap="pretty">{r.text}</Text>
              </Grid>
            ))}
          </VStack>
        </Chapter>

        {/* RESEARCH */}
        <Chapter id="research" label="research" meta="cal state la · 2026" title={C.research.question}>
          <VStack gap={0} className="ledger">
            {C.research.steps.map((s) => (
              <Grid key={s.tag} columns={2} gap={6} className="ledger-row ledger-2 reveal">
                <Text type="code" color="secondary">{s.tag}</Text>
                <Text as="p" type="large" textWrap="pretty">{s.text}</Text>
              </Grid>
            ))}
          </VStack>
        </Chapter>

        {/* BUILDING */}
        <Chapter id="building" label="building" meta="in development" title={<>{C.building.name}</>}>
          <VStack gap={6}>
            <HStack gap={2} align="center">
              <StatusDot variant="accent" isPulsing label="In development" tooltip="In development" />
              <Text type="code" color="secondary">{C.building.status} · planned architecture</Text>
            </HStack>
            <Text as="p" type="large" textWrap="pretty" className="measure">{C.building.line}</Text>

            <Grid columns={3} gap={0} className="pipe reveal" aria-label="Planned model pipeline">
              <VStack gap={1} className="pipe-col">
                <Text type="code" color="secondary">inputs</Text>
                {C.building.inputs.map((i) => (
                  <Text key={i} type="code" className="pipe-node">{i}</Text>
                ))}
              </VStack>
              <VStack gap={1} className="pipe-col">
                <Text type="code" color="secondary">model</Text>
                {C.building.model.map((m) => (
                  <Text key={m} type="code" className="pipe-node pipe-node-strong">{m}</Text>
                ))}
              </VStack>
              <VStack gap={1} className="pipe-col">
                <Text type="code" color="secondary">output</Text>
                <Text type="code" className="pipe-node pipe-node-out">{C.building.output}</Text>
              </VStack>
            </Grid>

            <Grid columns={4} gap={0} className="plan">
              {C.building.plan.map((p, i) => (
                <VStack key={p.k} gap={2} className="plan-step reveal">
                  <Text type="code" color="secondary" hasTabularNumbers>step {String(i + 1).padStart(2, '0')}</Text>
                  <Text type="large" weight="medium">{p.k}</Text>
                  <Text as="p" color="secondary" textWrap="pretty">{p.text}</Text>
                </VStack>
              ))}
            </Grid>
          </VStack>
        </Chapter>

        {/* STACK MARQUEE */}
        <section className="marquee" aria-label="Tools I use">
          <HStack gap={0} className="marquee-track">
            {[0, 1].map((copy) => (
              <HStack key={copy} gap={0} className="marquee-set" aria-hidden={copy === 1 || undefined}>
                {C.stack.map((s) => (
                  <Text key={s} className="marquee-item">{s}</Text>
                ))}
              </HStack>
            ))}
          </HStack>
        </section>

        {/* PROJECTS */}
        <Chapter id="projects" label="projects" meta={`${C.projects.length} selected`} title="Things I’ve built">
          <VStack gap={0} className="projects">
            {C.projects.map((p, i) => (
              <Collapsible
                key={p.name}
                defaultIsOpen={false}
                className="project reveal"
                trigger={
                  <Grid columns={4} gap={4} align="center" className="project-row">
                    <Text type="code" color="inherit" hasTabularNumbers>{String(i + 1).padStart(2, '0')}</Text>
                    <Text color="inherit" className="project-name">{p.name}</Text>
                    <Text color="inherit" className="project-line hide-md">{p.kind}</Text>
                    <Text type="code" color="inherit" className="project-year">{p.year}</Text>
                  </Grid>
                }
              >
                <Grid columns={2} gap={8} className="project-detail">
                  <VStack gap={3}>
                    <Text as="p" type="large" textWrap="pretty">{p.line}</Text>
                    <HStack gap={1} wrap="wrap">
                      {p.stack.map((s) => (
                        <Text key={s} type="code" className="chip">{s}</Text>
                      ))}
                    </HStack>
                  </VStack>
                  <VStack gap={3}>
                    <VStack gap={2} className="points">
                      {p.points.map((pt) => (
                        <Text key={pt} as="p" color="secondary" className="point" textWrap="pretty">{pt}</Text>
                      ))}
                    </VStack>
                    {p.links && (
                      <HStack gap={4} wrap="wrap">
                        {p.links.map((l) => (
                          <Link key={l.href} href={l.href} isExternalLink color="primary" hasUnderline>{l.label}</Link>
                        ))}
                      </HStack>
                    )}
                  </VStack>
                </Grid>
              </Collapsible>
            ))}
          </VStack>
        </Chapter>

        {/* RECORD */}
        <Chapter id="record" label="record" meta="honors · school · teaching" title="The record">
          <Grid columns={2} gap={10} className="record">
            <VStack gap={4} className="reveal">
              <Text type="code" color="secondary">honors</Text>
              <VStack gap={0}>
                {C.honors.map((h) => (
                  <VStack key={h.what} gap={0.5} className="rec-row">
                    <Text type="large" weight="medium">{h.what}</Text>
                    <Text type="supporting">{h.who}</Text>
                  </VStack>
                ))}
              </VStack>
            </VStack>
            <VStack gap={4} className="reveal">
              <Text type="code" color="secondary">education</Text>
              <VStack gap={0}>
                {C.education.map((e) => (
                  <VStack key={e.school} gap={0.5} className="rec-row">
                    <HStack gap={3} justify="between" align="start" wrap="wrap">
                      <Text type="large" weight="medium">{e.school}</Text>
                      <Text type="code" color="secondary" hasTabularNumbers>{e.when}</Text>
                    </HStack>
                    <Text type="supporting">{e.detail}</Text>
                  </VStack>
                ))}
              </VStack>
            </VStack>
            <VStack gap={4} className="reveal">
              <Text type="code" color="secondary">teaching · volunteer</Text>
              <VStack gap={0}>
                {C.teaching.map((t) => (
                  <VStack key={t.where} gap={0.5} className="rec-row">
                    <HStack gap={3} justify="between" align="start" wrap="wrap">
                      <Text type="large" weight="medium">{t.where}</Text>
                      <Text type="code" color="secondary" hasTabularNumbers>{t.when}</Text>
                    </HStack>
                    <Text type="supporting">{t.what}</Text>
                  </VStack>
                ))}
              </VStack>
            </VStack>
            <VStack gap={4} className="reveal">
              <Text type="code" color="secondary">also</Text>
              <VStack gap={0}>
                {C.also.map((a) => (
                  <VStack key={a.k} gap={0.5} className="rec-row">
                    <Text type="large" weight="medium">{a.k}</Text>
                    <Text type="supporting">{a.v}</Text>
                  </VStack>
                ))}
              </VStack>
            </VStack>
          </Grid>
        </Chapter>

        {/* CONTACT */}
        <Chapter id="contact" label="contact" meta="email · github · linkedin" title="Let’s talk">
          <Grid columns={2} gap={10} align="center" className="contact">
            <VStack gap={6}>
              <VStack gap={2}>
                <Text type="code" color="secondary">email</Text>
                <Text className="email" color="primary">{C.EMAIL}</Text>
              </VStack>
              <HStack gap={3} wrap="wrap" align="center">
                <Button label="Copy email" variant="primary" onClick={copyEmail} />
                <Button label="GitHub" variant="secondary" href={C.GITHUB} target="_blank" rel="noopener noreferrer" />
                <Button label="LinkedIn" variant="secondary" href={C.LINKEDIN} target="_blank" rel="noopener noreferrer" />
              </HStack>
              <Divider />
              <Text type="supporting">Email is the fastest way to reach me.</Text>
            </VStack>
            <VStack gap={3} align="center" className="card-wrap">
              <BusinessCard
                isFlipped={isFlipped}
                onFlip={() => setFlipped((f) => !f)}
                front={
                  <>
                    <Text type="code" color="inherit" className="card-corner card-tl">Class of 2027</Text>
                    <Text type="code" color="inherit" className="card-corner card-tr">USACO Gold</Text>
                    <Text color="inherit" className="card-name">Arthur Tunyan</Text>
                    <Text color="inherit" className="card-title">Machine Learning · Software Engineering</Text>
                    <Text color="inherit" className="card-foot">Burbank · California</Text>
                  </>
                }
                back={
                  <>
                    <Text type="code" color="inherit" className="card-corner card-tl">AT/</Text>
                    <Text type="code" color="inherit" className="card-lines">
                      {C.EMAIL}
                      <br />github.com/arthurtunyan
                      <br />linkedin.com/in/arthur-tunyan
                    </Text>
                    <Text type="code" color="inherit" className="card-foot">ml research · swe · teaching</Text>
                  </>
                }
              />
              <Text type="code" color="secondary" className="card-spec">bone stock · 3.5 × 2 in · raised lettering · click to flip</Text>
            </VStack>
          </Grid>
        </Chapter>
      </main>

      <footer className="footer gutter">
        <HStack gap={4} justify="between" align="center" wrap="wrap">
          <Text type="code" color="secondary">© 2026 Arthur Tunyan · built with React and Astryx</Text>
          <Link href="#top" color="secondary" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <Text type="code" color="inherit">back to top ↑</Text>
          </Link>
        </HStack>
      </footer>

      <CommandPalette
        isOpen={isPaletteOpen}
        onOpenChange={setPaletteOpen}
        searchSource={source}
        label="Jump to"
        emptyBootstrapText="Type a section or an action"
        renderItem={(item) => <Text type="code">{item.label}</Text>}
        onValueChange={(v) => {
          setPaletteOpen(false);
          commands.find((c) => c.id === v)?.run();
        }}
      />
    </>
  );
}
