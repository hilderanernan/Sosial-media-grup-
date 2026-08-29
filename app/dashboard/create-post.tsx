'use client'

import { useState } from 'react'
import { createPost } from '@/app/actions/feed'

export default function CreatePostForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await createPost(formData)

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
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-zinc-900 space-y-4">
      <textarea
        name="content"
        rows={3}
        placeholder="Apa yang lagi lu pikirin bro?"
        required
        className="w-full p-2 bg-black border rounded-md text-white resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold disabled:opacity-50"
      >
        {loading ? 'Mengirim...' : 'Kirim'}
      </button>
    </form>
  )
}
