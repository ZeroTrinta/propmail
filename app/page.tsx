'use client'
import Link from 'next/link'

const FEATURES = [
  {
    icon: '✦',
    title: 'Every stage of the sale',
    desc: 'First contact, follow-ups, offers, negotiations, closing. Eight templates built around how agents actually work.',
  },
  {
    icon: '◈',
    title: 'Sounds like you, not a robot',
    desc: 'Choose your tone and add context. The AI writes around your details, not generic filler.',
  },
  {
    icon: '◇',
    title: 'Copy and send in seconds',
    desc: 'No editing required. Generate, review, copy. Your client gets a great email. You save 20 minutes.',
  },
]

const TESTIMONIALS = [
  {
    quote: "I used to dread writing follow-ups after showings. Now I generate one in 30 seconds and it's better than what I would have written anyway.",
    name: 'Sarah M.',
    role: 'Realtor, Chicago IL',
  },
  {
    quote: "The negotiation email templates alone are worth it. My response rate went up noticeably in the first week.",
    name: 'James T.',
    role: 'Real Estate Agent, Austin TX',
  },
]

export default function Home() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 15% 5%, #0d1f35 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 85% 85%, #091a2a 0%, transparent 55%)'
      }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--blue)' }}>PropMail</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/login" style={{ fontSize: '0.85rem', color: 'var(--fg3)', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/login" style={{
            background: 'var(--blue)', borderRadius: '7px', padding: '8px 18px',
            fontSize: '0.85rem', fontWeight: 600, color: '#0b0f14', textDecoration: 'none'
          }}>Try free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '90px 24px 80px' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '20px' }}>
          For real estate agents
        </p>

        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--fg)', maxWidth: '640px', marginBottom: '20px' }}>
          Stop staring at a blank screen.<br /><em>Write better emails, faster.</em>
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--fg2)', lineHeight: 1.7, maxWidth: '420px', marginBottom: '36px' }}>
          PropMail generates professional real estate emails for every stage of the sale. Follow-ups, offers, negotiations and more — ready in seconds.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Link href="/login" style={{
            background: 'var(--blue)', borderRadius: '8px', padding: '14px 36px',
            fontSize: '1rem', fontWeight: 600, color: '#0b0f14', textDecoration: 'none',
            letterSpacing: '0.02em'
          }}>
            Start writing for free
          </Link>
          <p style={{ fontSize: '0.75rem', color: 'var(--fg3)' }}>5 free emails per month. No credit card required.</p>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '48px' }}>
          {['5 free emails/month', '4 email types free', 'No credit card needed', 'Built for agents'].map(f => (
            <div key={f} style={{
              background: 'var(--blue-dim)', border: '1px solid var(--blue-border)',
              borderRadius: '20px', padding: '7px 14px',
              fontSize: '0.76rem', color: 'rgba(99,179,237,0.75)', letterSpacing: '0.04em'
            }}>
              ✦ {f}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '48px' }}>
          Why agents use PropMail
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '28px 24px',
            }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--blue)' }}>{f.icon}</span>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', margin: '12px 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--fg2)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 24px', maxWidth: '780px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '40px' }}>
          What agents are saying
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '28px 24px',
            }}>
              <p style={{ fontSize: '0.9rem', color: 'rgba(232,237,242,0.75)', lineHeight: 1.7, marginBottom: '20px' }}>
                "{t.quote}"
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--blue)', fontWeight: 500 }}>{t.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--fg3)' }}>{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 24px 80px', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '40px' }}>
          Simple pricing
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Free */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px 20px' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginBottom: '8px' }}>Free</p>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '2rem', color: 'var(--fg)', fontWeight: 700, marginBottom: '16px' }}>$0</p>
            <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {['5 emails per month', '8 email types', 'Tone control'].map(i => (
                <li key={i} style={{ fontSize: '0.82rem', color: 'var(--fg2)' }}>✦ {i}</li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '7px', padding: '10px', fontSize: '0.85rem', color: 'var(--fg2)', textDecoration: 'none', fontWeight: 500 }}>
              Get started
            </Link>
          </div>
          {/* Pro */}
          <div style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', borderRadius: '12px', padding: '28px 20px' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--blue)', marginBottom: '8px' }}>Pro</p>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '2rem', color: 'var(--blue)', fontWeight: 700, marginBottom: '16px' }}>$19<span style={{ fontSize: '0.9rem', opacity: 0.6 }}>/mo</span></p>
            <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {['Unlimited emails', 'Email history', 'New types monthly', 'Priority support'].map(i => (
                <li key={i} style={{ fontSize: '0.82rem', color: 'rgba(99,179,237,0.85)' }}>✦ {i}</li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', background: 'var(--blue)', borderRadius: '7px', padding: '10px', fontSize: '0.85rem', color: '#0b0f14', textDecoration: 'none', fontWeight: 600 }}>
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', color: 'var(--blue)', fontWeight: 700 }}>PropMail</span>
        <p style={{ fontSize: '0.75rem', color: 'var(--fg3)' }}>AI emails for real estate agents</p>
      </footer>
    </div>
  )
}
