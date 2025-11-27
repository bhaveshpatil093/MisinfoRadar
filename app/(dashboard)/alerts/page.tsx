import { AlertCard } from '@/components/dashboard/AlertCard'

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground mt-2">
          Manage and monitor active misinformation alerts
        </p>
      </div>
      
      <AlertCard />
    </div>
  )
}

