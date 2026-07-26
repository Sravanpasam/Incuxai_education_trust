import { useEffect, useState, useMemo, useCallback } from 'react';

interface Props {
  visible: boolean;
  onComplete: () => void;
}

const CONFETTI_COUNT = 60;
const STAR_COUNT = 18;
const PARTICLE_COUNT = 14;
const GLOW_COUNT = 6;

const BRAND = {
  navy: '#15345B',
  gold: '#9B7A3E',
  goldLight: '#C5A059',
  green: '#22C55E',
  white: '#FFFFFF',
};

const CONFETTI_COLORS = ['#15345B', '#9B7A3E', '#C5A059', '#22C55E', '#e94560', '#8b5cf6', '#06b6d4', '#ec4899'];

function sr(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function RegistrationSuccessPopup({ visible, onComplete }: Props) {
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'visible' | 'exiting'>('hidden');
  const [checkDrawn, setCheckDrawn] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);

  const confetti = useMemo(() =>
    Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
      id: i,
      left: sr(i * 7 + 1) * 100,
      delay: sr(i * 11 + 2) * 1.2,
      dur: 2.5 + sr(i * 13 + 3) * 2,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      w: 5 + sr(i * 17 + 5) * 7,
      h: 4 + sr(i * 19 + 7) * 6,
      drift: (sr(i * 23 + 11) - 0.5) * 60,
      rot: sr(i * 29 + 13) * 720,
      shape: i % 5,
    })), []);

  const stars = useMemo(() =>
    Array.from({ length: STAR_COUNT }).map((_, i) => ({
      id: i,
      x: (sr(i * 31 + 17) - 0.5) * 600,
      y: (sr(i * 37 + 19) - 0.5) * 500,
      size: 4 + sr(i * 41 + 23) * 8,
      delay: sr(i * 43 + 29) * 3,
      dur: 1.2 + sr(i * 47 + 31) * 2,
    })), []);

  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: (sr(i * 53 + 37) - 0.5) * 700,
      y: (sr(i * 59 + 41) - 0.5) * 550,
      size: 2 + sr(i * 61 + 43) * 4,
      delay: sr(i * 67 + 47) * 4,
      dur: 2 + sr(i * 71 + 53) * 3,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    })), []);

  const glows = useMemo(() =>
    Array.from({ length: GLOW_COUNT }).map((_, i) => ({
      id: i,
      x: (sr(i * 73 + 59) - 0.5) * 400,
      y: (sr(i * 79 + 61) - 0.5) * 350,
      size: 80 + sr(i * 83 + 67) * 140,
      color: [BRAND.gold, BRAND.green, BRAND.goldLight, BRAND.navy, '#8b5cf6', '#06b6d4'][i],
      delay: sr(i * 89 + 71) * 2,
    })), []);

  useEffect(() => {
    if (!visible) {
      setPhase('hidden');
      setCheckDrawn(false);
      setCheckVisible(false);
      return;
    }
    setPhase('entering');
    const t1 = setTimeout(() => setCheckVisible(true), 350);
    const t2 = setTimeout(() => setCheckDrawn(true), 500);
    const t3 = setTimeout(() => setPhase('visible'), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visible]);

  const handleButton = useCallback(() => {
    setPhase('exiting');
    setTimeout(onComplete, 450);
  }, [onComplete]);

  if (phase === 'hidden') return null;

  const entering = phase === 'entering';
  const exiting = phase === 'exiting';

  return (
    <>
      <style>{`
        @keyframes rspIn {
          0% { opacity: 0; transform: scale(0.7) translateY(30px); }
          60% { opacity: 1; transform: scale(1.03) translateY(-4px); }
          80% { transform: scale(0.99) translateY(1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rspOut {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.92) translateY(-12px); }
        }
        @keyframes rspBadgeIn {
          0% { opacity: 0; transform: scale(0.3); }
          60% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes rspCircleDraw {
          0% { stroke-dashoffset: 220; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes rspCheckDraw {
          0% { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes rspGlow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(34,197,94,0.3)); }
          50% { filter: drop-shadow(0 0 18px rgba(34,197,94,0.6)); }
        }
        @keyframes rspRing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes rspConfetti {
          0% { transform: translateY(-8vh) translateX(0) rotate(0deg); opacity: 1; }
          30% { opacity: 1; }
          100% { transform: translateY(105vh) translateX(calc(var(--cd) * 1.8)) rotate(var(--cr)); opacity: 0; }
        }
        @keyframes rspStar {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes rspParticle {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          20% { opacity: 0.8; transform: translateY(-10px) scale(1); }
          80% { opacity: 0.6; }
        }
        @keyframes rspGlowPulse {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.18; transform: scale(1.15); }
        }
        @keyframes rspShine {
          0% { left: -30%; }
          100% { left: 130%; }
        }
        @keyframes rspBtnShine {
          0% { left: -40%; }
          100% { left: 140%; }
        }
        @keyframes rspCardIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes rspItemIn {
          0% { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes rspFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .rsp-confetti {
          position: fixed; pointer-events: none; z-index: 10003;
          animation: rspConfetti var(--cdur) ease-in var(--cdel) forwards;
        }
        .rsp-star {
          position: fixed; pointer-events: none; z-index: 10003;
          animation: rspStar var(--sdur) ease-in-out var(--sdel) infinite;
        }
        .rsp-particle {
          position: fixed; pointer-events: none; z-index: 10003;
          border-radius: 50%;
          animation: rspParticle var(--pdur) ease-in-out var(--pdel) infinite;
        }
        .rsp-glow {
          position: fixed; pointer-events: none; z-index: 10000;
          border-radius: 50%;
          filter: blur(60px);
          animation: rspGlowPulse 4s ease-in-out var(--gdel) infinite;
        }
        .rsp-btn {
          position: relative; overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .rsp-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 32px -4px rgba(155,122,62,0.45) !important;
        }
        .rsp-btn:active {
          transform: translateY(0) !important;
        }
        .rsp-btn-shine {
          position: absolute; top: 0; left: -40%; width: 20%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: rspBtnShine 2.5s ease-in-out 1s infinite;
          pointer-events: none;
        }
        .rsp-overlay {
          transition: all 0.5s ease;
        }
        .rsp-checklist-item {
          animation: rspItemIn 0.4s ease forwards;
          opacity: 0;
        }
      `}</style>

      {/* === BACKGROUND GLOWS === */}
      {glows.map(g => (
        <div key={g.id} className="rsp-glow" style={{
          left: `calc(50% + ${g.x}px)`, top: `calc(50% + ${g.y}px)`,
          width: g.size, height: g.size, background: g.color,
          ['--gdel' as string]: `${g.delay}s`,
        }} />
      ))}

      {/* === CONFETTI === */}
      {confetti.map(c => (
        <div key={c.id} className="rsp-confetti" style={{
          left: `${c.left}%`, top: '-8px',
          width: c.w, height: c.h,
          background: c.color,
          borderRadius: c.shape === 0 ? '50%' : c.shape === 1 ? '2px' : c.shape === 2 ? '1px' : c.shape === 3 ? '50% 0' : '0 50%',
          ['--cd' as string]: `${c.drift}px`,
          ['--cr' as string]: `${c.rot}deg`,
          ['--cdur' as string]: `${c.dur}s`,
          ['--cdel' as string]: `${c.delay}s`,
        }} />
      ))}

      {/* === STARS === */}
      {stars.map(st => (
        <div key={st.id} className="rsp-star" style={{
          left: `calc(50% + ${st.x}px)`, top: `calc(50% + ${st.y}px)`,
          ['--sdur' as string]: `${st.dur}s`,
          ['--sdel' as string]: `${st.delay}s`,
        }}>
          <svg width={st.size} height={st.size} viewBox="0 0 24 24" fill={BRAND.gold}>
            <path d="M12 2l2.2 5.5L20 9.5l-4.2 3.8L17 20l-5-3-5 3 1.2-6.7L4 9.5l5.8-2z" />
          </svg>
        </div>
      ))}

      {/* === PARTICLES === */}
      {particles.map(p => (
        <div key={p.id} className="rsp-particle" style={{
          left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)`,
          width: p.size, height: p.size, background: p.color,
          ['--pdur' as string]: `${p.dur}s`,
          ['--pdel' as string]: `${p.delay}s`,
        }} />
      ))}

      {/* === OVERLAY + CARD === */}
      <div
        className="rsp-overlay"
        style={{
          position: 'fixed', inset: 0, zIndex: 10001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
          background: exiting ? 'rgba(15,23,42,0)' : 'rgba(15,23,42,0.6)',
          backdropFilter: exiting ? 'blur(0px)' : 'blur(12px)',
          WebkitBackdropFilter: exiting ? 'blur(0px)' : 'blur(12px)',
          pointerEvents: exiting ? 'none' : 'auto',
        }}
      >
        {/* Card */}
        <div style={{
          width: '100%', maxWidth: '540px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: '24px',
          boxShadow: '0 0 0 1px rgba(155,122,62,0.08), 0 8px 40px rgba(155,122,62,0.12), 0 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          position: 'relative',
          animation: exiting
            ? 'rspOut 0.45s cubic-bezier(0.4,0,1,1) forwards'
            : 'rspIn 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}>

          {/* === HEADER GRADIENT === */}
          <div style={{
            background: `linear-gradient(135deg, ${BRAND.navy} 0%, #1a3a5c 50%, ${BRAND.gold} 100%)`,
            padding: '24px 32px 20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle grid pattern */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }} />
            {/* Shine sweep */}
            <div style={{
              position: 'absolute', top: 0, left: '-20%', width: '15%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
              animation: 'rspShine 4s ease-in-out 0.8s 1',
            }} />

            {/* Animated Success Badge */}
            <div style={{
              width: '60px', height: '60px', margin: '0 auto 14px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22C55E, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
              position: 'relative',
              animation: entering ? 'none' : 'rspBadgeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
            }}>
              {/* Pulse rings */}
              <div style={{
                position: 'absolute', inset: '-6px', borderRadius: '50%',
                border: '2px solid rgba(34,197,94,0.3)',
                animation: 'rspRing 2s ease-out 1s infinite',
              }} />
              <div style={{
                position: 'absolute', inset: '-14px', borderRadius: '50%',
                border: '2px solid rgba(34,197,94,0.15)',
                animation: 'rspRing 2s ease-out 1.3s infinite',
              }} />
              {/* Checkmark SVG */}
              <svg width="30" height="30" viewBox="0 0 80 80">
                <circle
                  cx="40" cy="40" r="34"
                  fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3"
                  strokeDasharray="214"
                  strokeDashoffset={checkDrawn ? 0 : 214}
                  style={{
                    transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1) 0.2s',
                    animation: checkDrawn ? 'rspGlow 2.5s ease-in-out infinite' : 'none',
                  }}
                />
                <path
                  d="M24 42 L34 52 L56 28"
                  fill="none" stroke="#FFFFFF" strokeWidth="5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset={checkDrawn ? 0 : 50}
                  style={{ transition: 'stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1) 0.6s' }}
                />
              </svg>
            </div>

            {/* Status text */}
            <p style={{
              margin: '0 0 4px', fontSize: '12px', fontWeight: 700,
              color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase',
            }}>
              Registration Successful
            </p>

            {/* Welcome heading */}
            <h1 style={{
              margin: '0', fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25,
            }}>
              Welcome to
            </h1>
            <h1 style={{
              margin: '2px 0 0', fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.3rem', fontWeight: 800, color: BRAND.goldLight, lineHeight: 1.25,
            }}>
              IncuXAI Education Trust
            </h1>

            {/* Subheading */}
            <p style={{
              margin: '8px 0 0', fontSize: '12.5px',
              color: 'rgba(255,255,255,0.75)', fontWeight: 400,
            }}>
              Your HR Learning Journey Begins Today
            </p>
          </div>

          {/* === BODY === */}
          <div style={{ padding: '20px 32px 18px' }}>

            {/* Thank you message */}
            <p style={{
              margin: '0 0 6px', fontSize: '13px', color: '#475569', lineHeight: 1.6,
              textAlign: 'center',
            }}>
              Thank you for choosing IncuXAI Education Trust.
            </p>
            <p style={{
              margin: '0 0 6px', fontSize: '13px', color: '#475569', lineHeight: 1.6,
              textAlign: 'center',
            }}>
              Your registration has been completed successfully.
            </p>
            <p style={{
              margin: '0 0 6px', fontSize: '13px', color: '#475569', lineHeight: 1.6,
              textAlign: 'center',
            }}>
              You are now part of a community dedicated to developing skilled and industry-ready HR professionals.
            </p>
            <p style={{
              margin: '0 0 6px', fontSize: '13px', color: '#475569', lineHeight: 1.6,
              textAlign: 'center',
            }}>
              We're excited to support your learning with expert guidance, practical training, and career-focused programs.
            </p>
            <p style={{
              margin: '0 0 16px', fontSize: '13px', color: '#475569', lineHeight: 1.6,
              textAlign: 'center',
            }}>
              We wish you great success throughout your learning journey.
            </p>

            {/* === HIGHLIGHT CARD === */}
            <div style={{
              background: 'linear-gradient(135deg, #FDF8F0 0%, #F8F6F1 50%, #F0FDF4 100%)',
              border: '1px solid rgba(155,122,62,0.15)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '16px',
              animation: entering ? 'none' : 'rspCardIn 0.5s ease 0.4s both',
            }}>
              {/* Card header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '12px', paddingBottom: '10px',
                borderBottom: '1px solid rgba(155,122,62,0.12)',
              }}>
                <span style={{ fontSize: '18px' }}>{'\uD83C\uDF93'}</span>
                <span style={{
                  fontSize: '13px', fontWeight: 700, color: BRAND.navy,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  HR Professional Development Program
                </span>
              </div>

              {/* Checklist */}
              {[
                { icon: '\u2713', text: 'Account Created Successfully', color: BRAND.green, delay: '0.5s' },
                { icon: '\u2713', text: 'Email Verified', color: BRAND.green, delay: '0.65s' },
                { icon: '\u2713', text: 'Access Granted', color: BRAND.green, delay: '0.8s' },
                { icon: '\u2713', text: 'Ready to Start Learning', color: BRAND.green, delay: '0.95s' },
              ].map((item, idx) => (
                <div key={idx} className="rsp-checklist-item" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 0',
                  animationDelay: item.delay,
                }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: `${item.color}15`,
                    border: `1.5px solid ${item.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 800, color: item.color,
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '12.5px', color: '#334155', fontWeight: 500,
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* === CTA BUTTON === */}
            <button className="rsp-btn" onClick={handleButton} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width: '100%', padding: '13px 24px',
              background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.gold} 100%)`,
              color: '#FFFFFF', border: 'none', borderRadius: '12px',
              fontSize: '14px', fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 6px 24px -4px rgba(155,122,62,0.35)',
              letterSpacing: '0.02em',
              position: 'relative', overflow: 'hidden',
              animation: entering ? 'none' : 'rspCardIn 0.4s ease 1.1s both',
            }}>
              <span className="rsp-btn-shine" />
              {redirectLabel}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            {/* === FOOTER QUOTE === */}
            <p style={{
              margin: '14px 0 0', textAlign: 'center',
              fontSize: '12px', color: '#94A3B8', fontStyle: 'italic',
              fontWeight: 500, lineHeight: 1.6, letterSpacing: '0.01em',
            }}>
              "Empowering Careers. Building Future HR Leaders."
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const redirectLabel = 'Start Learning';
