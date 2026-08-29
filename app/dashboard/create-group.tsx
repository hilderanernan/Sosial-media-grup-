'use client'

import { useState } from 'react'
import { createGroup } from '@/app/actions/groups'

export default function CreateGroupForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await createGroup(formData)

      if (res?.error) {
        alert(`Gagal: ${res.error}`)
      } else {
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err?.message || 'Gagal terhubung'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Buat Grup Baru</h2>
      <input
        type="text"
        name="name"
        placeholder="Nama Grup"
        required
        className="w-full p-2 bg-black border rounded-md text-white"
      />
      <textarea
        name="description"
        placeholder="Deskripsi Grup"
        className="w-full p-2 bg-black border rounded-md text-white resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold disabled:opacity-50"
      >
        {loading ? 'Membuat...' : 'Buat Grup'}
      </button>
    </form>
  )
}
