'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 15% 5%, #0d1f35 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 85% 85%, #091a2a 0%, transparent 55%)'
      }} />

      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-lg">
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--blue)', textTransform: 'uppercase' }}>
          For real estate agents
        </p>

        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '3rem', fontWeight: 700, lineHeight: 1.15, color: 'var(--fg)' }}>
          Emails that<br /><em>close deals.</em>
        </h1>

        <p style={{ fontSize: '0.97rem', color: 'var(--fg2)', lineHeight: 1.65, maxWidth: '380px' }}>
          Generate professional, on-brand emails for every stage of the sale in seconds, powered by AI trained for real estate.
        </p>

        <Link href="/app" style={{
          background: 'var(--blue)', border: 'none', borderRadius: '7px',
          padding: '13px 30px', color: '#0b0f14',
          fontSize: '0.93rem', fontWeight: 600, letterSpacing: '0.02em',
          textDecoration: 'none', display: 'inline-block'
        }}>
          Try it free
        </Link>

        <p style={{ fontSize: '0.73rem', color: 'var(--fg3)' }}>
          5 free emails per month. No credit card required.
        </p>
      </div>

      <div className="relative z-10 flex gap-3 flex-wrap justify-center mt-8">
        {['8 email types', 'Tone control', 'Ready to copy', 'Built for agents'].map(f => (
          <div key={f} style={{
            background: 'var(--blue-dim)', border: '1px solid var(--blue-border)',
            borderRadius: '20px', padding: '7px 14px',
            fontSize: '0.76rem', color: 'rgba(99,179,237,0.75)', letterSpacing: '0.04em'
          }}>
            ✦ {f}
          </div>
        ))}
      </div>
    </div>
  )
}
