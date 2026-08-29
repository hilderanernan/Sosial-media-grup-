'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus login terlebih dahulu' }
  }

  const content = formData.get('content') as string
  if (!content || !content.trim()) {
    return { error: 'Konten tidak boleh kosong' }
  }

  const { error } = await supabase.from('posts').insert({
    user_id: user.id,
    content: content.trim()
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getPublicPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}
