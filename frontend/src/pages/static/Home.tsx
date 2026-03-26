import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Helpers ──────────────────────────────────────────────

function getCsrfToken(): string {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : '';
}

// ── Decrypted Text Effect ────────────────────────────────
// Inline implementation — chars scramble from random to real

function DecryptedHeadline({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [trigger, setTrigger] = useState(0);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_./';
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    const speed = 40;
    const target = text;

    intervalRef.current = setInterval(() => {
      setDisplayed(
        target
          .split('')
          .map((char, i) => {
            if (char === ' ' || char === '\n') return char;
            if (i < iteration) return target[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      iteration += 0.5;
      if (iteration >= target.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayed(target);
      }
    }, speed);
  };

  useEffect(() => {
    runScramble();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text, trigger]);

  const handleHover = () => setTrigger(t => t + 1);

  return <span className={className} onMouseEnter={handleHover} style={{ cursor: 'default' }}>{displayed}</span>;
}

// ── Corner Brackets ──────────────────────────────────────

function CornerBrackets({ color = '#3656CE', delay = 0, interactive = false }: { color?: string; delay?: number; interactive?: boolean }) {
  const bracketStyle = (pos: string) => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 12,
      height: 12,
      borderColor: color,
      borderWidth: 1,
      borderStyle: 'solid',
    };
    if (pos === 'tl') return { ...base, top: -1, left: -1, borderRight: 0, borderBottom: 0 };
    if (pos === 'tr') return { ...base, top: -1, right: -1, borderLeft: 0, borderBottom: 0 };
    if (pos === 'bl') return { ...base, bottom: -1, left: -1, borderRight: 0, borderTop: 0 };
    return { ...base, bottom: -1, right: -1, borderLeft: 0, borderTop: 0 };
  };

  const hoverOffset: Record<string, { x: number; y: number }> = {
    tl: { x: -6, y: -6 },
    tr: { x: 6, y: -6 },
    bl: { x: -6, y: 6 },
    br: { x: 6, y: 6 },
  };

  return (
    <>
      {['tl', 'tr', 'bl', 'br'].map((pos, i) => (
        <motion.div
          key={pos}
          style={bracketStyle(pos)}
          className={interactive ? 'cursor-pointer z-20' : ''}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + i * 0.08, duration: 0.3, type: 'spring', stiffness: 300 }}
          {...(interactive ? {
            whileHover: { ...hoverOffset[pos], scale: 1.8, borderColor: '#3656CE' },
          } : {})}
        />
      ))}
    </>
  );
}

// ── TB Emblem SVG ────────────────────────────────────────

function TBEmblem({ size = 32, fill = '#3656CE' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 447.04 431.61" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M338.74,225.24l-14.88-24.64h-122.64s78.04,126.82,78.04,126.82H123.2l-46.85,76.07-17.36,28.13h284.81l12.48-23.13,45.3-81.07-23.7-38.58-39.15-63.6Z" fill={fill} />
      <polygon points="122.34 327.99 260.63 103.85 383.83 103.85 447.04 0 324.7 0 203.1 0 63.27 0 .06 103.85 138.8 103.85 0 327.99 122.34 327.99" fill={fill} />
    </svg>
  );
}

function TBWireframe() {
  return (
    <svg width={120} height={120} viewBox="0 0 447.04 431.61" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
      <path d="M338.74,225.24l-14.88-24.64h-122.64s78.04,126.82,78.04,126.82H123.2l-46.85,76.07-17.36,28.13h284.81l12.48-23.13,45.3-81.07-23.7-38.58-39.15-63.6Z" stroke="#3656CE" strokeWidth="3" />
      <polygon points="122.34 327.99 260.63 103.85 383.83 103.85 447.04 0 324.7 0 203.1 0 63.27 0 .06 103.85 138.8 103.85 0 327.99 122.34 327.99" stroke="#3656CE" strokeWidth="3" />
    </svg>
  );
}

// ── Stagger wrapper ──────────────────────────────────────

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
});

// ── Noise overlay (CSS-only, lightweight) ────────────────

function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    />
  );
}

// ── Main Component ───────────────────────────────────────

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/v1/csrf_token/', { credentials: 'include' }).catch(() => {});
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/v1/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage("You're in. We'll keep you posted.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || data.email?.[0] || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Connection failed. Try again.');
    }
  };

  // ── Mosaic background pattern ──
  const mosaicBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='%23F7F7F5'/%3E%3Cpath d='M100 0H0v100h100V0zM1 1h98v98H1V1z' fill='none' stroke='%233A3A38' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
    backgroundSize: '100px 100px',
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#1A1A1A] relative overflow-x-hidden" style={mosaicBg}>
      <NoiseOverlay />

      {/* ── NAV ── */}
      <motion.nav
        className="fixed top-0 left-0 w-full h-16 bg-[#F7F7F5]/95 backdrop-blur-sm border-b border-[#3A3A38]/20 flex items-center justify-between px-6 md:px-12 z-50"
        {...stagger(0)}
      >
        <div className="flex items-center gap-3">
          <img src="/static/images/truebuilder-logo.png" alt="TrueBuilder.ai" className="h-6 w-auto" />
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.15em] text-[#6E7185]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <div className="hover:text-[#3656CE] transition-colors duration-200 cursor-default"><span className="text-[#3656CE]">01.</span> STATUS: COMING SOON</div>
          <div className="opacity-30">//</div>
          <div className="hover:text-[#3656CE] transition-colors duration-200 cursor-default"><span className="text-[#3656CE]">02.</span> ACCESS: EARLY</div>
          <div className="opacity-30">//</div>
          <div className="hover:text-[#3656CE] transition-colors duration-200 cursor-default"><span className="text-[#3656CE]">03.</span> BUILD: 001</div>
        </div>

        <motion.button
          onClick={scrollToForm}
          className="px-5 py-2 border border-[#3656CE] text-[#3656CE] text-[11px] uppercase tracking-[0.15em] hover:bg-[#3656CE] hover:text-white transition-all duration-300"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          [ Request Access ]
        </motion.button>
      </motion.nav>

      {/* ── HERO ── */}
      <main className="pt-16 min-h-screen flex flex-col md:flex-row relative z-10">
        {/* Left — Headline */}
        <section className="w-full md:w-3/5 p-8 md:p-20 flex flex-col justify-center">
          <div className="max-w-4xl relative">
            {/* Blue accent line */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#3656CE]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top' }}
            />

            <div className="pl-8 md:pl-12">
              <motion.h1
                className="text-5xl sm:text-6xl md:text-[96px] font-bold leading-[0.9] tracking-tighter mb-8"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                {...stagger(1)}
              >
                <DecryptedHeadline text="The Future" className="block" />
                <DecryptedHeadline text="Is Coming." className="block" />
              </motion.h1>

              <motion.p
                className="text-[11px] uppercase tracking-[0.2em] text-[#6E7185]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                {...stagger(2)}
              >
                TrueBuilder.ai — Artificial Intelligence for Construction
              </motion.p>
            </div>
          </div>
        </section>

        {/* Right — Wireframe */}
        <motion.section
          className="w-full md:w-2/5 p-8 md:p-20 flex items-center justify-center bg-white/10"
          {...stagger(3)}
        >
          <motion.div
            className="relative w-full max-w-[400px] aspect-square border border-[#3A3A38]/10 flex items-center justify-center p-12 cursor-pointer"
            whileHover={{ borderColor: 'rgba(54, 86, 206, 0.25)', backgroundColor: 'rgba(54, 86, 206, 0.02)' }}
            transition={{ duration: 0.4 }}
            onClick={scrollToForm}
          >
            <CornerBrackets delay={0.6} interactive />

            {/* Orbit circle 1 — outer */}
            <motion.div
              className="absolute inset-4 rounded-full border border-dashed border-[#3656CE]/40 cursor-pointer"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.08, borderColor: 'rgba(54, 86, 206, 0.9)' }}
              style={{ transition: 'border-color 0.3s' }}
            />
            {/* Orbit circle 2 — middle */}
            <motion.div
              className="absolute inset-12 rounded-full border border-dashed border-[#3656CE]/25 cursor-pointer"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.12, borderColor: 'rgba(54, 86, 206, 0.8)' }}
              style={{ transition: 'border-color 0.3s' }}
            />
            {/* Orbit circle 3 — inner */}
            <motion.div
              className="absolute inset-24 rounded-full border border-dashed border-[#3656CE]/15 cursor-pointer"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.18, borderColor: 'rgba(54, 86, 206, 0.7)' }}
              style={{ transition: 'border-color 0.3s' }}
            />

            {/* TB Emblem — center */}
            <motion.div
              className="relative z-10 cursor-pointer"
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <TBWireframe />
            </motion.div>

            {/* Reference code — top left */}
            <motion.span
              className="absolute top-4 left-4 text-[9px] text-[#3656CE]/60 uppercase cursor-pointer select-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ color: '#3656CE', x: 4, scale: 1.1 }}
            >
              SGN_PRC_01
            </motion.span>
            {/* Reference code — bottom right */}
            <motion.span
              className="absolute bottom-4 right-4 text-[9px] text-[#3656CE]/60 uppercase cursor-pointer select-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              whileHover={{ color: '#3656CE', x: -4, scale: 1.1 }}
            >
              REF_002.9X
            </motion.span>
          </motion.div>
        </motion.section>
      </main>

      {/* ── EMAIL FORM ── */}
      <motion.section
        ref={formRef}
        className="border-t border-[#3A3A38]/20 bg-[#F7F7F5] py-24 px-8 flex justify-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="w-full max-w-[640px] relative p-10 md:p-16 border border-[#3A3A38]/10 bg-white/40 backdrop-blur-sm hover:border-[#3656CE]/20 hover:bg-white/60 transition-colors duration-500"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <CornerBrackets delay={0.2} />

          <div className="mb-8">
            <span
              className="text-[10px] uppercase tracking-[0.2em] text-[#3656CE] block mb-2 font-bold"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Request Early Access
            </span>
            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Secure your position in the private beta.
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 py-4"
              >
                <div className="w-5 h-5 bg-[#3656CE] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span
                  className="text-sm font-bold uppercase tracking-wider text-[#3656CE]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {message}
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-0 border border-[#3A3A38]/30"
                exit={{ opacity: 0, y: -10 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL ADDRESS..."
                  required
                  disabled={status === 'loading'}
                  className="flex-1 bg-white px-6 py-4 text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#3656CE] disabled:opacity-50"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
                <motion.button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="bg-[#3656CE] text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-black transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {status === 'loading' ? (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      PROCESSING...
                    </motion.span>
                  ) : (
                    'Submit'
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {status === 'error' && message && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-xs text-red-500 uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          <p
            className="mt-6 text-[#6E7185] text-xs uppercase tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            We build the tools that build the future.
          </p>
        </motion.div>
      </motion.section>

      {/* ── FOOTER ── */}
      <motion.footer
        className="fixed bottom-0 left-0 w-full h-12 bg-[#F7F7F5]/95 backdrop-blur-sm border-t border-[#3A3A38]/20 flex items-center justify-between px-6 md:px-12 z-50 text-[10px]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 bg-[#3656CE]"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="uppercase tracking-[0.15em] font-bold">Batch 001 — Now Accepting</span>
        </div>
        <div className="text-[#B0BFC0] uppercase tracking-[0.15em]">© 2026 TrueBuilder.ai</div>
      </motion.footer>

      {/* Spacer for fixed footer */}
      <div className="h-12" />
    </div>
  );
}
