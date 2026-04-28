'use client'
import Link from 'next/link'

const FEATURES = [
  { label: 'Unlimited email generation',         current: true  },
  { label: 'Agent profile (name and phone)',      current: true  },
  { label: 'Pro-only email types',                current: true  },
  { label: 'Custom email type',                   current: true  },
  { label: 'Full email history',                  current: true  },
  { label: 'Priority support',                    current: true  },
  { label: 'Email in Spanish',                    current: false },
  { label: 'Rewrite & improve your own emails',   current: false },
  { label: 'Follow-up sequence generator',        current: false },
  { label: 'Multiple email variations',           current: false },
]

export default function UpgradePage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL ?? '#'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 15% 5%, #0d1f35 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 85% 85%, #091a2a 0%, transparent 55%)'
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', maxWidth: '440px', width: '100%' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--blue)', textTransform: 'uppercase' }}>
          You've used your free emails
        </p>

        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.15, color: 'var(--fg)' }}>
          Unlock <em>Pro access</em>
        </h1>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--blue-border)',
          borderRadius: '12px', padding: '28px',
          display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%'
        }}>
          <p style={{ fontFamily: 'Lora, serif', fontSize: '2.6rem', color: 'var(--blue)', fontWeight: 700 }}>
            $19<span style={{ fontSize: '1rem', color: 'rgba(99,179,237,0.55)' }}>/mo</span>
          </p>

          {/* Current features */}
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', alignSelf: 'stretch' }}>
            {FEATURES.filter(f => f.current).map(f => (
              <li key={f.label} style={{ fontSize: '0.86rem', color: 'var(--fg2)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: 'var(--blue)' }}>✦</span> {f.label}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div style={{ alignSelf: 'stretch', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Coming soon for Pro
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {FEATURES.filter(f => !f.current).map(f => (
                <li key={f.label} style={{ fontSize: '0.84rem', color: 'var(--fg3)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ opacity: 0.4 }}>◎</span> {f.label}
                </li>
              ))}
            </ul>
          </div>

          <a href={checkoutUrl} style={{
            display: 'block', width: '100%',
            background: 'var(--blue)', border: 'none', borderRadius: '7px',
            padding: '13px', color: '#0b0f14',
            fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            textDecoration: 'none', textAlign: 'center'
          }}>
            Subscribe to Pro
          </a>
        </div>

        <Link href="/app" style={{ fontSize: '0.83rem', color: 'var(--fg3)', textDecoration: 'none' }}>
          Go back
        </Link>
      </div>
    </div>
  )
}
