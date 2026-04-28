import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PropMail — AI Emails for Real Estate Agents',
  description: 'Generate professional real estate emails in seconds. Built for agents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
