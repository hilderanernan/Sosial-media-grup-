'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(groupId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('messages')
    .insert([{ group_id: groupId, user_id: user.id, content }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function promoteToPost(messageId: string, groupId: string, title: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('posts')
    .insert([{ message_id: messageId, group_id: groupId, user_id: user.id, title, is_public: true }])
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  return data
}

export async function getPublicFeed() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      view_count,
      created_at,
      profiles:user_id (full_name, avatar),
      groups:group_id (name),
      messages:message_id (content)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching feed:', error)
  return data || []
}
