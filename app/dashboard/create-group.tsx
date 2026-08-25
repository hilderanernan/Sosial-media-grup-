'use client'

import { createGroup } from '@/app/actions/groups'
import { useState } from 'react'

export default function CreateGroupForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createGroup(formData)
      alert('Grup berhasil dibuat!')
    } catch (err: any) {
      alert('Gagal membuat grup: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="p-4 border rounded-lg max-w-md space-y-4">
      <h2 className="text-xl font-bold">Buat Grup Baru</h2>
      
      <div>
        <label className="block text-sm font-medium">Nama Grup</label>
        <input 
          type="text" 
          name="name" 
          required 
          className="w-full p-2 border rounded text-black" 
          placeholder="Contoh: Komunitas Dev Termux"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Deskripsi</label>
        <textarea 
          name="description" 
          className="w-full p-2 border rounded text-black" 
          placeholder="Jelaskan tujuan grup ini..."
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Memproses...' : 'Buat Grup'}
      </button>
    </form>
  )
}
