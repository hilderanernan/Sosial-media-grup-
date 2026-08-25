'use client'

import { useState } from 'react'
import { joinGroup, leaveGroup } from '@/app/actions/groups'

export default function JoinGroupButton({ groupId, isMember }: { groupId: string, isMember: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    try {
      if (isMember) {
        await leaveGroup(groupId)
      } else {
        await joinGroup(groupId)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
        isMember
          ? 'bg-zinc-800 text-red-400 hover:bg-red-950 border border-red-900'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50`}
    >
      {loading ? '...' : isMember ? 'Keluar' : 'Join'}
    </button>
  )
}
