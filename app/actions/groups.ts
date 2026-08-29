'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function createGroup(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Anda harus login terlebih dahulu' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name || !name.trim()) {
    return { error: 'Nama grup tidak boleh kosong' }
  }

  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({
      name: name.trim(),
      description: description?.trim() || '',
      created_by: user.id
    })
    .select()
    .single()

  if (groupError) {
    return { error: groupError.message }
  }

  // Auto-join pembuat ke grup
  await supabase.from('group_members').insert({
    group_id: group.id,
    user_id: user.id,
    role: 'admin'
  })

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getMyGroups() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('group_members')
    .select('group_id, groups(id, name, description)')
    .eq('user_id', user.id)

  if (error) return []
  return data || []
}
