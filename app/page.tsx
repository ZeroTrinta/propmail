'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

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

const FAQS = [
  {
    q: 'Will the emails sound like me?',
    a: 'You control the tone (formal, balanced, or friendly) and add your own context. The AI adapts to what you give it, so the output reflects your situation, not a generic template.',
  },
  {
    q: 'Is it just a generic AI tool?',
    a: 'No. PropMail is built specifically for real estate agents. Every prompt, template, and feature is designed around the actual workflows agents deal with daily.',
  },
  {
    q: 'What happens when I hit the free limit?',
    a: 'You get 5 free emails per month. When you hit the limit, you can upgrade to Pro for unlimited generation. Your count resets every 30 days.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account at any time. No hidden fees, no lock-in. If you are not satisfied in the first 7 days, email us and we will refund you.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'Nothing to install. PropMail runs in your browser. Sign up, log in, and start generating emails immediately.',
  },
]

const TYPEWRITER_WORDS = ['follow-ups', 'negotiations', 'cold leads', 'closing emails', 'offer letters', 'document requests']

const STEPS = [
  { num: '01', title: 'Choose email type', desc: 'Pick from 8 templates covering every stage of the sale.' },
  { num: '02', title: 'Fill in the details', desc: 'Add the client name, property, tone, and any extra context.' },
  { num: '03', title: 'Copy and send', desc: 'Your email is ready in seconds. No editing needed.' },
]

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const emailCount = useCountUp(2847)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % TYPEWRITER_WORDS.length)
        setFade(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 15% 5%, #0d1f35 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 85% 85%, #091a2a 0%, transparent 55%)'
      }} />

      {/* Early adopter banner */}
      <div style={{ position: 'relative', zIndex: 20, background: 'var(--blue-dim)', borderBottom: '1px solid var(--blue-border)', padding: '9px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--blue)', letterSpacing: '0.03em' }}>
          Limited launch pricing — $19/mo locked in forever for early adopters
        </p>
      </div>

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

        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 700, lineHeight: 1.12, color: 'var(--fg)', maxWidth: '640px', marginBottom: '16px' }}>
          Stop staring at a blank screen.
        </h1>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '24px', minHeight: '3rem' }}>
          <em style={{
            color: 'var(--blue)',
            transition: 'opacity 0.3s ease',
            opacity: fade ? 1 : 0,
            display: 'inline-block'
          }}>
            {TYPEWRITER_WORDS[wordIndex]}
          </em>
          <span style={{ color: 'var(--fg)' }}> that close deals.</span>
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--fg2)', lineHeight: 1.7, maxWidth: '420px', marginBottom: '12px' }}>
          PropMail generates professional real estate emails for every stage of the sale — ready in seconds, powered by AI trained for agents.
        </p>

        {/* Counter */}
        <p style={{ fontSize: '0.82rem', color: 'var(--blue)', marginBottom: '32px', letterSpacing: '0.03em' }}>
          {emailCount.toLocaleString()}+ emails generated by agents like you
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

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 24px', maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '48px' }}>
          How it works
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {STEPS.map(s => (
            <div key={s.num} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px 24px' }}>
              <p style={{ fontFamily: 'Lora, serif', fontSize: '2rem', color: 'var(--blue-border)', fontWeight: 700, marginBottom: '12px' }}>{s.num}</p>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '8px' }}>{s.title}</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--fg2)', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 24px', maxWidth: '700px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '40px' }}>
          Writing manually vs PropMail
        </p>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '14px 20px', fontSize: '0.72rem', color: 'var(--fg3)', letterSpacing: '0.08em' }}></div>
            <div style={{ padding: '14px 20px', fontSize: '0.72rem', color: 'var(--fg3)', letterSpacing: '0.08em', borderLeft: '1px solid var(--border)' }}>MANUALLY</div>
            <div style={{ padding: '14px 20px', fontSize: '0.72rem', color: 'var(--blue)', letterSpacing: '0.08em', borderLeft: '1px solid var(--border)' }}>PROPMAIL</div>
          </div>
          {[
            ['Time per email', '15–30 min', '30 seconds'],
            ['Consistency', 'Varies by mood', 'Always on-brand'],
            ['Follow-up rate', 'Often skipped', 'Every time'],
            ['Quality under pressure', 'Drops', 'Stays high'],
          ].map(([label, manual, pro]) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
              <div style={{ padding: '14px 20px', fontSize: '0.84rem', color: 'var(--fg2)' }}>{label}</div>
              <div style={{ padding: '14px 20px', fontSize: '0.84rem', color: 'var(--fg3)', borderLeft: '1px solid var(--border)' }}>{manual}</div>
              <div style={{ padding: '14px 20px', fontSize: '0.84rem', color: 'var(--blue)', borderLeft: '1px solid var(--border)', fontWeight: 500 }}>{pro}</div>
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
            <div key={f.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px 24px' }}>
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
            <div key={t.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px 24px' }}>
              <p style={{ fontSize: '0.9rem', color: 'rgba(232,237,242,0.75)', lineHeight: 1.7, marginBottom: '20px' }}>"{t.quote}"</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--blue)', fontWeight: 500 }}>{t.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--fg3)' }}>{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 24px', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '40px' }}>
          Simple pricing
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px 20px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginBottom: '8px' }}>Free</p>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '2rem', color: 'var(--fg)', fontWeight: 700, marginBottom: '16px' }}>$0</p>
            <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', flex: 1 }}>
              {['5 emails per month', '4 email types', 'Tone control'].map(i => (
                <li key={i} style={{ fontSize: '0.82rem', color: 'var(--fg2)' }}>✦ {i}</li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '7px', padding: '10px', fontSize: '0.85rem', color: 'var(--fg2)', textDecoration: 'none', fontWeight: 500, marginTop: 'auto' }}>
              Get started
            </Link>
          </div>
          <div style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', borderRadius: '12px', padding: '28px 20px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--blue)', marginBottom: '8px' }}>Pro</p>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '2rem', color: 'var(--blue)', fontWeight: 700, marginBottom: '16px' }}>$19<span style={{ fontSize: '0.9rem', opacity: 0.6 }}>/mo</span></p>
            <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', flex: 1 }}>
              {['Unlimited emails', 'All email types', 'Custom email type', 'Agent profile', 'Email history', 'All future updates'].map(i => (
                <li key={i} style={{ fontSize: '0.82rem', color: 'rgba(99,179,237,0.85)' }}>✦ {i}</li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', background: 'var(--blue)', borderRadius: '7px', padding: '10px', fontSize: '0.85rem', color: '#0b0f14', textDecoration: 'none', fontWeight: 600, marginTop: 'auto' }}>
              Subscribe to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 24px 80px', maxWidth: '620px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '40px' }}>
          Frequently asked questions
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--fg)', fontSize: '0.88rem', fontWeight: 500, textAlign: 'left', gap: '12px'
              }}>
                {faq.q}
                <span style={{ color: 'var(--blue)', fontSize: '1.1rem', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <p style={{ padding: '0 20px 16px', fontSize: '0.84rem', color: 'var(--fg2)', lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 24px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '16px' }}>
          Ready to write better emails?
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--fg2)', marginBottom: '28px' }}>
          Start free. No credit card required.
        </p>
        <Link href="/login" style={{
          background: 'var(--blue)', borderRadius: '8px', padding: '14px 36px',
          fontSize: '1rem', fontWeight: 600, color: '#0b0f14', textDecoration: 'none'
        }}>
          Start writing for free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', color: 'var(--blue)', fontWeight: 700 }}>PropMail</span>
        <p style={{ fontSize: '0.75rem', color: 'var(--fg3)' }}>AI emails for real estate agents</p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
