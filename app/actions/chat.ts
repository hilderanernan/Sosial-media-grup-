'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Send message inside group chat
export async function sendMessage(groupId: string, content: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Kamu harus login terlebih dahulu')

  if (!content.trim()) return

  const { error } = await supabase.from('messages').insert({
    group_id: groupId,
    user_id: user.id,
    content: content
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/group/${groupId}`)
}

// Core Haimi Feature: Promote Message to Post
export async function promoteMessageToPost(messageId: string, groupId: string, content: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Kamu harus login terlebih dahulu')

  const { error } = await supabase.from('posts').insert({
    message_id: messageId,
    group_id: groupId,
    user_id: user.id,
    content: content,
    is_public: true
  })

  if (error) {
    throw new Error('Gagal mengangkat pesan jadi post: ' + error.message)
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/group/${groupId}`)
}
