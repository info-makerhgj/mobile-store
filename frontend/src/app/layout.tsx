import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'متجر الجوالات | Mobile Store',
  description: 'متجر إلكتروني لبيع الجوالات والإكسسوارات',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-arabic`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
