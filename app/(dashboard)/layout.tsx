import Link from 'next/link'
import { Shield, Activity, AlertTriangle, BarChart3, Rss } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: '/', label: 'Overview', icon: Activity },
    { href: '/live', label: 'Live Monitor', icon: Shield },
    { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/sources', label: 'Sources', icon: Rss },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MisinfoRadar</span>
            </Link>
            <nav className="flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

