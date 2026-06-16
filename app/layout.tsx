import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Nav from './components/nav'

export const metadata: Metadata = {
  title: 'Zielnik — Konopie Medyczne w Polsce',
  description: 'Agregator dostępności preparatów konopnych dla pacjentów medycznych w Polsce.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="pl">
        <body className="bg-bg-medical text-text-main min-h-dvh" suppressHydrationWarning>
          <Nav />
          <main className="min-h-dvh">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
