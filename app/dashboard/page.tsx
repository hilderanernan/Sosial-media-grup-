'use client'

import { useState } from 'react'
import { createGroup } from '@/actions/groups'

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await createGroup(formData)

      if (res?.error) {
        alert(res.error)
      } else if (res?.success) {
        alert('Grup berhasil dibuat!')
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err?.message || 'Gagal terhubung'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Form Buat Grup */}
      <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Buat Grup Baru</h2>
          <input
            type="text"
            name="name"
            placeholder="Nama Grup"
            required
            className="w-full p-2 bg-black border border-zinc-700 rounded-md text-white"
          />
          <textarea
            name="description"
            placeholder="Deskripsi Grup"
            className="w-full p-2 bg-black border border-zinc-700 rounded-md text-white resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold disabled:opacity-50"
          >
            {loading ? 'Membuat...' : 'Buat Grup'}
          </button>
        </form>
      </div>

      {/* Section Grup Saya */}
      <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900">
        <h2 className="text-lg font-semibold text-white mb-2">Grup Saya</h2>
        <p className="text-sm text-zinc-400">Belum ada grup yang diikuti.</p>
      </div>
    </div>
  )
}
