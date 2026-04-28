'use client'
import Link from 'next/link'

export default function UpgradePage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL ?? '#'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 15% 5%, #0d1f35 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 85% 85%, #091a2a 0%, transparent 55%)'
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', maxWidth: '400px' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--blue)', textTransform: 'uppercase' }}>
          You've used your free emails
        </p>

        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.15, color: 'var(--fg)' }}>
          Unlock <em>Pro access</em>
        </h1>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--blue-border)',
          borderRadius: '12px', padding: '28px',
          display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center', width: '100%'
        }}>
          <p style={{ fontFamily: 'Lora, serif', fontSize: '2.6rem', color: 'var(--blue)', fontWeight: 700 }}>
            $19<span style={{ fontSize: '1rem', color: 'rgba(99,179,237,0.55)' }}>/mo</span>
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', alignSelf: 'stretch' }}>
            {[
              'Unlimited email generation',
              'Full email history',
              'New types added monthly',
              'Priority support',
            ].map(item => (
              <li key={item} style={{ fontSize: '0.86rem', color: 'var(--fg2)', display: 'flex', gap: '8px' }}>
                ✦ {item}
              </li>
            ))}
          </ul>

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
