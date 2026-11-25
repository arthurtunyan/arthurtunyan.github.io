// The effects layer: things Astryx has no component for (canvas field, glyph decode, cursor, the card).
import {useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const GLYPHS = '!<>-_\\/[]{}=+*^?#01░▒';

/** Text that decodes from random glyphs into the real string. Screen readers get the real string only. */
export function Scramble({text, delay = 0, onHover = false, className}: {text: string; delay?: number; onHover?: boolean; className?: string}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(
    (wait: number) => {
      if (reduced()) return setOut(text);
      cancelAnimationFrame(raf.current);
      const settle = [...text].map((_, i) => wait + i * 1.6 + Math.random() * 7);
      let frame = 0;
      const tick = () => {
        frame++;
        let done = true;
        setOut(
          [...text]
            .map((ch, i) => {
              if (ch === ' ' || frame >= settle[i]) return ch;
              done = false;
              return GLYPHS[(Math.random() * GLYPHS.length) | 0];
            })
            .join(''),
        );
        if (!done) raf.current = requestAnimationFrame(tick);
      };
      tick();
    },
    [text],
  );

  useEffect(() => {
    if (!onHover) run(delay);
    return () => cancelAnimationFrame(raf.current);
  }, [run, delay, onHover]);

  return (
    <span className={className} onPointerEnter={onHover ? () => run(0) : undefined}>
      <VisuallyHidden>{text}</VisuallyHidden>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

/** Live clock for a time zone, e.g. Burbank. */
export function useClock(timeZone: string) {
  const fmt = useRef(new Intl.DateTimeFormat('en-US', {timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}));
  const [now, setNow] = useState(() => fmt.current.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.current.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * ASCII depth field: a slow interference pattern drawn in monospace glyphs.
 * The cursor sends a ripple through it. Pauses off screen; one still frame under reduced motion.
 */
export function AsciiField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const RAMP = ' .·:-=+*#%@';
    const CELL = 14;
    const LINE = 16;
    let w = 0, h = 0, cols = 0, rows = 0, ink = '#ECE8DF';
    let visible = true, raf = 0, last = 0;
    const mouse = {x: -9999, y: -9999, t: 0};

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 11px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / LINE);
      ink = getComputedStyle(canvas).color || ink;
    };

    const draw = (ms: number) => {
      const t = ms / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink;
      const since = t - mouse.t;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL, y = r * LINE;
          let v =
            Math.sin(c * 0.07 + t * 0.35) * Math.cos(r * 0.12 - t * 0.27) +
            Math.sin((c + r) * 0.04 - t * 0.22) +
            0.6 * Math.sin(Math.hypot(c - cols * 0.72, (r - rows * 0.45) * 1.6) * 0.32 - t * 0.9);
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          if (d < 260) v += (1 - d / 260) * 1.4 * Math.sin(d * 0.07 - t * 5) * Math.max(0, 1 - since * 0.35);
          // Map to contour bands: glyphs bunch along iso-lines, leaving dark water between them.
          const band = Math.abs(((v * 1.5) % 1 + 1) % 1 - 0.5) * 2;
          const k = band < 0.5 ? 0 : Math.pow((band - 0.5) * 2, 1.6);
          const ch = RAMP[Math.min(RAMP.length - 1, (k * RAMP.length) | 0)];
          if (ch !== ' ') ctx.fillText(ch, x, y);
        }
      }
    };

    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || ms - last < 33) return; // ~30fps is plenty for this
      last = ms;
      draw(ms);
    };

    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
      mouse.t = performance.now() / 1000;
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduced()) draw(4000); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    document.fonts?.ready.then(resize);

    if (reduced()) draw(4000);
    else {
      raf = requestAnimationFrame(loop);
      window.addEventListener('pointermove', onMove, {passive: true});
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="ascii-field" aria-hidden="true" />;
}

/** A small square cursor that inverts what it sits on. Fine pointers only. */
export function Cursor() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const hot = (e.target as Element | null)?.closest('a, button, [role="button"], .card-scene');
      el.dataset.hot = hot ? '1' : '';
    };
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const leave = () => (el.dataset.gone = '1');
    const enter = () => (el.dataset.gone = '');
    window.addEventListener('pointermove', move, {passive: true});
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerenter', enter);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerenter', enter);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);
  return <span ref={ref} className="cursor" aria-hidden="true" />;
}

/** Bone card stock with raised lettering. Tilts toward the pointer; click or Enter flips it. */
export function BusinessCard({front, back, isFlipped, onFlip}: {front: ReactNode; back: ReactNode; isFlipped: boolean; onFlip: () => void}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({rx: 0, ry: 0, gx: 50, gy: 30});

  const onMove = (e: React.PointerEvent) => {
    if (reduced() || e.pointerType !== 'mouse') return;
    const b = ref.current!.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width;
    const py = (e.clientY - b.top) / b.height;
    setTilt({rx: (0.5 - py) * 14, ry: (px - 0.5) * 18, gx: px * 100, gy: py * 100});
  };

  const style = {
    '--rx': `${tilt.rx}deg`,
    '--ry': `${tilt.ry}deg`,
    '--gx': `${tilt.gx}%`,
    '--gy': `${tilt.gy}%`,
  } as CSSProperties;

  return (
    <button
      ref={ref}
      type="button"
      className="card-scene"
      data-flipped={isFlipped || undefined}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({rx: 0, ry: 0, gx: 50, gy: 30})}
      onClick={onFlip}
      aria-label={isFlipped ? 'Business card, back side. Activate to show the front.' : 'Business card, front side. Activate to show the back.'}
    >
      <span className="card-body">
        <span className="card-face card-front">{front}<span className="card-glare" /></span>
        <span className="card-face card-back">{back}<span className="card-glare" /></span>
      </span>
    </button>
  );
}
