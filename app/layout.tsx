import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Need Whey — Coach Nutrition',
  description: 'Coach nutrition et sport pour la famille',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
