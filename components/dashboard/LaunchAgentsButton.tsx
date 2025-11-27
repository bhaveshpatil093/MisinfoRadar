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
    className={`
      flex items-center gap-2 px-4 py-2
      bg-blue-600 text-white
      rounded-md transition-all duration-200
      hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
      shadow-sm hover:shadow 
    `}
  >
    {isLaunching ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        Launching...
      </>
    ) : (
      <>
        <ShieldCheck className="h-4 w-4" />
        Launch Agents
      </>
    )}
  </Button>
  
  )
}

