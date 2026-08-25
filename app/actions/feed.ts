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

export async function getRandomExplorePosts() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Ambil ID grup yang sudah diikuti oleh user
  const { data: myGroups } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', user.id)

  const joinedGroupIds = (myGroups || []).map((g) => g.group_id)

  // Ambil post dari grup publik yang BELUM diikuti oleh user
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles (
        full_name
      ),
      groups!inner (
        name,
        type
      )
    `)
    .eq('is_public', true)
    .eq('groups.type', 'public')
    .order('created_at', { ascending: false })
    .limit(20)

  if (joinedGroupIds.length > 0) {
    query = query.not('group_id', 'in', `(${joinedGroupIds.join(',')})`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching explore posts:', error.message)
    return []
  }

  return data || []
}
