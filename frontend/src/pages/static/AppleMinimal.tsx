import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Helpers ──────────────────────────────────────────────

function getCsrfToken(): string {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : '';
}

// ── BlurText — inline implementation ─────────────────────
// Each word fades in from gaussian blur with staggered timing.
// Apple-like: soft, clean, the ONE hero animation effect.

function BlurText({
  text,
  delay = 0,
  className = '',
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ filter: 'blur(12px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{
            delay: delay + i * 0.12,
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {word}
          {i < words.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </span>
  );
}

// ── TB Emblem SVG (Brand Blue) ───────────────────────────

function TBEmblem({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 447.04 431.61"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M338.74,225.24l-14.88-24.64h-122.64s78.04,126.82,78.04,126.82H123.2l-46.85,76.07-17.36,28.13h284.81l12.48-23.13,45.3-81.07-23.7-38.58-39.15-63.6Z"
        fill="#3656CE"
      />
      <polygon
        points="122.34 327.99 260.63 103.85 383.83 103.85 447.04 0 324.7 0 203.1 0 63.27 0 .06 103.85 138.8 103.85 0 327.99 122.34 327.99"
        fill="#3656CE"
      />
    </svg>
  );
}

// ── Floating Brand Elements ──────────────────────────────
// Small outlined TB emblems and "ai" text scattered in background

const FLOAT_ITEMS = [
  { type: 'text', x: '3%', y: '5%', size: 18, rotate: -12, delay: 0 },
  { type: 'text', x: '24%', y: '2%', size: 14, rotate: 8, delay: 0.6 },
  { type: 'text', x: '55%', y: '6%', size: 16, rotate: 15, delay: 0.4 },
  { type: 'text', x: '80%', y: '4%', size: 14, rotate: -6, delay: 0.8 },
  { type: 'text', x: '8%', y: '25%', size: 18, rotate: 6, delay: 0.2 },
  { type: 'text', x: '88%', y: '20%', size: 16, rotate: -15, delay: 0.7 },
  { type: 'text', x: '12%', y: '48%', size: 14, rotate: -20, delay: 0.35 },
  { type: 'text', x: '85%', y: '45%', size: 16, rotate: 10, delay: 0.5 },
  { type: 'text', x: '6%', y: '72%', size: 18, rotate: 18, delay: 0.15 },
  { type: 'text', x: '90%', y: '65%', size: 14, rotate: -8, delay: 0.65 },
  { type: 'text', x: '4%', y: '88%', size: 16, rotate: -10, delay: 0.45 },
  { type: 'text', x: '32%', y: '85%', size: 14, rotate: 12, delay: 0.3 },
  { type: 'text', x: '60%', y: '88%', size: 16, rotate: 5, delay: 0.55 },
  { type: 'text', x: '82%', y: '82%', size: 14, rotate: -18, delay: 0.9 },
  // Near-center — desktop only
  { type: 'text', x: '22%', y: '35%', size: 12, rotate: -14, delay: 0.85, hideOnMobile: true },
  { type: 'text', x: '72%', y: '30%', size: 14, rotate: 9, delay: 1.0, hideOnMobile: true },
  { type: 'text', x: '20%', y: '60%', size: 14, rotate: 13, delay: 0.95, hideOnMobile: true },
  { type: 'text', x: '74%', y: '62%', size: 12, rotate: -7, delay: 1.1, hideOnMobile: true },
];

function TrueBuilderAiOutline({ size, color = '#D5DDE5' }: { size: number; color?: string }) {
  return (
    <span
      style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: size,
        fontWeight: 700,
        color: 'transparent',
        WebkitTextStroke: `1.5px ${color}`,
        letterSpacing: '-0.02em',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      TrueBuilder.ai
    </span>
  );
}

function FloatingItems() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {FLOAT_ITEMS.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute${(item as any).hideOnMobile ? ' hidden md:block' : ''}`}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0.8, rotate: item.rotate }}
          animate={{
            opacity: [0, 0.75, 0.65, 0.75],
            scale: 1,
            rotate: item.rotate,
            y: [0, -10, 0, 6, 0],
          }}
          transition={{
            opacity: { delay: item.delay + 0.8, duration: 1.5 },
            scale: { delay: item.delay + 0.8, duration: 1 },
            y: {
              delay: item.delay + 1.5,
              duration: 6 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <TrueBuilderAiOutline size={item.size} />
        </motion.div>
      ))}
    </div>
  );
}

// ── Stagger config ───────────────────────────────────────
// logo(0) -> badge(1) -> headline(2) -> subtitle(3) -> CTA(4)
// Gentle, Apple-like timing — slow ease, generous spacing.

const fadeUp = (index: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: 0.3 + index * 0.2,
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
  },
});

// ── Main Component ───────────────────────────────────────

export default function AppleMinimal() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusRing, setFocusRing] = useState(false);

  // Fetch CSRF token on mount
  useEffect(() => {
    fetch('/api/v1/csrf_token/', { credentials: 'include' }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/v1/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage("You're on the list.");
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

  return (
    <div
      className="h-screen relative flex flex-col overflow-hidden"
      style={{
        backgroundColor: '#FAFAFA',
        fontFamily: "'Manrope', sans-serif",
        color: '#1A1A1A',
      }}
    >
      {/* Floating construction items */}
      <FloatingItems />

      {/* ── HEADER — Big Logo ── */}
      <motion.header
        className="w-full flex justify-center pt-10 md:pt-14 pb-4 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <img src="/static/images/truebuilder-logo.png" alt="TrueBuilder.ai" className="h-12 md:h-16 w-auto" />
      </motion.header>

      {/* ── HERO ── */}
      <main
        className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 relative z-10"
        style={{ minHeight: 0 }}
      >
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Pill Badge — soft spring drop-in */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 20,
              mass: 0.8,
            }}
          >
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase"
              style={{
                backgroundColor: '#E6EFF1',
                color: '#6E7185',
                letterSpacing: '0.1em',
              }}
            >
              Coming Soon
            </span>
          </motion.div>

          {/* Headline — BlurText effect */}
          <motion.h1
            className="font-semibold text-5xl md:text-6xl lg:text-[64px] tracking-tight leading-[1.1] mb-6"
            style={{ color: '#1A1A1A' }}
            {...fadeUp(1)}
          >
            <BlurText text="The Future Is Coming." delay={0.5} />
          </motion.h1>

          {/* Subtitle */}
          <motion.div className="mb-6 max-w-2xl" {...fadeUp(2)}>
            <p className="text-2xl md:text-3xl font-semibold" style={{ color: '#6E7185' }}>
              AI-powered construction intelligence.
              <br className="hidden md:block" />
              Be the first to know.
            </p>
          </motion.div>

          {/* ── EMAIL FORM ── */}
          <motion.div
            ref={formRef}
            className="w-full max-w-md"
            {...fadeUp(3)}
          >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                className="flex flex-col items-center gap-3 py-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Check icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3656CE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </motion.div>
                <motion.p
                  className="text-sm font-medium"
                  style={{ color: '#6E7185' }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {message}
                </motion.p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-4"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-full">
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    animate={{
                      boxShadow: focusRing
                        ? '0 0 0 2px #3656CE'
                        : '0 0 0 0px transparent',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                    style={{ borderRadius: 8 }}
                  />
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusRing(true)}
                    onBlur={() => setFocusRing(false)}
                    placeholder="Email address"
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-white px-5 py-3.5 rounded-lg outline-none text-base disabled:opacity-50"
                    style={{
                      border: '1px solid #D5DDE5',
                      color: '#1A1A1A',
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="flex items-center gap-1.5 whitespace-nowrap px-4 py-3.5 font-semibold text-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    color: '#3656CE',
                    background: 'none',
                    border: 'none',
                  }}
                  whileHover={{ opacity: 0.7 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === 'loading' ? (
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      Sending...
                    </motion.span>
                  ) : (
                    <>
                      <span>Notify Me</span>
                      <motion.span
                        className="inline-block mt-0.5"
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {status === 'error' && message && (
              <motion.p
                className="mt-3 text-center text-sm"
                style={{ color: '#e53e3e' }}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
          </motion.div>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <motion.footer
        className="w-full flex flex-col items-center gap-4 pb-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        {/* Copyright */}
        <div
          className="text-[11px] md:text-xs uppercase font-medium"
          style={{
            color: 'rgba(110, 113, 133, 0.4)',
            letterSpacing: '0.1em',
          }}
        >
          &copy; 2026 TrueBuilder.ai
        </div>
      </motion.footer>
    </div>
  );
}
