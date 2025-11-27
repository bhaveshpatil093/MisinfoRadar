import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MisinfoRadar - Election Misinformation Detection",
  description:
    "Autonomous real-time election misinformation detection and verification platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.35),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(236,72,153,0.25),_transparent_35%),radial-gradient(circle_at_80%_0%,_rgba(14,165,233,0.15),_transparent_40%)]" />
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="relative z-10">{children}</div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

