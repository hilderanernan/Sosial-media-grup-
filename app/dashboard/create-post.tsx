'use client'

import { createPost } from '@/app/actions/feed'
import { useState } from 'react'

export default function CreatePostForm() {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('content', content)
      await createPost(formData)
      setContent('')
      alert('Postingan berhasil dikirim!')
    } catch (err: any) {
      alert('Gagal membuat postingan: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-3 bg-zinc-900">
      <h3 className="font-semibold text-lg">Buat Postingan Baru</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Apa yang lagi lu pikirin bro?"
        className="w-full p-2 border rounded bg-black text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-24"
        required
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Kirim'}
        </button>
      </div>
    </form>
  )
}
