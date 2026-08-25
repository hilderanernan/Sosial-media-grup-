'use client'

import { useState } from 'react'
import { sendMessage, promoteMessageToPost } from '@/app/actions/chat'

export default function ChatRoom({ 
  groupId, 
  initialMessages 
}: { 
  groupId: string, 
  initialMessages: any[] 
}) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      await sendMessage(groupId, content)
      setContent('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePromote(msgId: string, msgContent: string) {
    try {
      await promoteMessageToPost(msgId, groupId, msgContent)
      alert('Pesan berhasil diangkat menjadi Post Sosial! 🚀')
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-zinc-900 space-y-4">
      {/* Box Pesan */}
      <div className="space-y-3 max-h-[400px] min-h-[300px] overflow-y-auto p-2">
        {initialMessages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada obrolan di grup ini.</p>
        ) : (
          initialMessages.map((msg: any) => (
            <div key={msg.id} className="p-3 rounded bg-zinc-800 flex justify-between items-start group">
              <div>
                <span className="text-xs text-blue-400 font-semibold block">
                  {msg.profiles?.full_name || 'Anonim'}
                </span>
                <p className="text-sm text-gray-200 mt-1">{msg.content}</p>
              </div>
              <button
                onClick={() => handlePromote(msg.id, msg.content)}
                className="text-xs bg-zinc-700 hover:bg-blue-600 text-gray-300 hover:text-white px-2 py-1 rounded transition opacity-80 hover:opacity-100"
                title="Angkat pesan ini ke Social Feed"
              >
                📌 Post
              </button>
            </div>
          ))
        )}
      </div>

      {/* Form Kirim Chat */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-zinc-800 pt-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 p-2 rounded bg-black text-white border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Kirim'}
        </button>
      </form>
    </div>
  )
}
