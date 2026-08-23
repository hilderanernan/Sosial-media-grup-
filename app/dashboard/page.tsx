'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || 'User')
      } else {
        router.push('/login')
      }
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading dashboard...</p>
  }

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '8px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h2>🎉 Selamat Datang!</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </header>

      <main style={{ marginTop: '1.5rem' }}>
        <p>Anda berhasil login sebagai: <strong>{userEmail}</strong></p>
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#e6f7ff', borderRadius: '6px', border: '1px solid #91d5ff' }}>
          🚀 <strong>Area Member Sosial Media Grup</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#555' }}>
            Nanti fitur postingan, grup, dan feed bakal dimunculin di halaman ini!
          </p>
        </div>
      </main>
    </div>
  )
}
