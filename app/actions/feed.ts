'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Kamu harus login terlebih dahulu')
  }

  const content = formData.get('content') as string

  const { error } = await supabase.from('posts').insert({
    user_id: user.id,
    content: content,
    is_public: true
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function getPublicPosts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
    return []
  }

  return data || []
}
