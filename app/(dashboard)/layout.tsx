import Link from 'next/link'
import { Shield, Activity, AlertTriangle, BarChart3, Rss, Bell, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: '/', label: 'Overview', icon: Activity },
    { href: '/live', label: 'Live Monitor', icon: Shield },
    { href: '/analysis', label: 'Analysis', icon: AlertTriangle },
    { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/sources', label: 'Sources', icon: Rss },
  ]

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="glass-panel gradient-border glow h-11 w-11 rounded-2xl flex items-center justify-center text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Autonomous Watchtower
              </p>
              <p className="text-xl font-semibold tracking-tight text-white">
                MisinfoRadar
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-lg lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              asChild
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/alerts" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Alerts
              </Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30 hover:opacity-90">
              <Sparkles className="mr-2 h-4 w-4" />
              Launch Agents
            </Button>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-10">
        {children}
      </main>
    </div>
  )
}

