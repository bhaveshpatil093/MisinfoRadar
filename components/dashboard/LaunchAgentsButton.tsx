'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function LaunchAgentsButton() {
  const [isLaunching, setIsLaunching] = useState(false)

  const triggerAgents = async () => {
    setIsLaunching(true)
    try {
      const response = await fetch('/api/agents/monitor', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to trigger monitor agent')
      }

      toast.success('Agents engaged — monitor sweep initiated.')
    } catch (error) {
      console.error(error)
      toast.error('Cannot reach agents. Configure Supabase to enable live runs.')
    } finally {
      setIsLaunching(false)
    }
  }

  return (
    <Button
      onClick={triggerAgents}
      disabled={isLaunching}
      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-blue-500/30 hover:opacity-90"
    >
      {isLaunching ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Launching…
        </>
      ) : (
        <>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Launch Agents
        </>
      )}
    </Button>
  )
}

