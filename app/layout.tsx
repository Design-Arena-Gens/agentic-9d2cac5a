import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chess Progress Reporter',
  description: 'Daily progress tracking and reporting for chess students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
