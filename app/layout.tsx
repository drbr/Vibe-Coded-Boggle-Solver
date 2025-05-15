import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

// Initialize the Montserrat font with the weights we need
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Boggle Solver",
  description: "Find all possible words in a Boggle board",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>{children}</body>
    </html>
  )
}
