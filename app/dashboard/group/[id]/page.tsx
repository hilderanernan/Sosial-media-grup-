import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ChatRoom from './chat-room'

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: groupId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Detail grup
  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single()

  if (!group) {
    return <div className="p-6">Grup tidak ditemukan.</div>
  }

  // Pesan chat
  const { data: messages } = await supabase
    .from('messages')
    .select('*, profiles(full_name)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm text-blue-400 hover:underline">
        &larr; Kembali ke Dashboard
      </Link>

      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <p className="text-gray-400 text-sm">{group.description || 'Tidak ada deskripsi'}</p>
      </div>

      {/* Interaktif Chat Room dengan fitur Promote to Post */}
      <ChatRoom groupId={groupId} initialMessages={messages || []} />
    </div>
  )
}
