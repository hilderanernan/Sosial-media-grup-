'use client'

import { useState } from 'react'
import { createGroup } from '@/actions/groups'

export default function CreateGroupPage() {
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
    <div className="max-w-md mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-white">Buat Grup Baru</h2>
        
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Nama Grup</label>
          <input
            type="text"
            name="name"
            placeholder="Masukkan nama grup"
            required
            className="w-full p-2.5 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Deskripsi</label>
          <textarea
            name="description"
            placeholder="Masukkan deskripsi grup"
            rows={3}
            className="w-full p-2.5 bg-black border border-zinc-700 rounded-md text-white focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold disabled:opacity-50 transition"
        >
          {loading ? 'Membuat...' : 'Buat Grup'}
        </button>
      </form>
    </div>
  )
}
