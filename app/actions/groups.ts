'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function createGroup(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const type = (formData.get('type') as 'public' | 'private') || 'public'

  const { data, error } = await supabase
    .from('groups')
    .insert([{ name, description, type, created_by: user.id }])
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  return data
}

export async function getMyGroups() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('group_members')
    .select('group_id, role, groups(*)')
    .eq('user_id', user.id)

  return data || []
}

export async function getPublicGroups() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('type', 'public')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching public groups:', error.message)
    return []
  }

  return data || []
}

export async function joinGroup(groupId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Kamu harus login terlebih dahulu')

  const { error } = await supabase.from('group_members').insert({
    group_id: groupId,
    user_id: user.id,
    role: 'member'
  })

  if (error) {
    throw new Error('Gagal bergabung ke grup: ' + error.message)
  }

  revalidatePath('/groups')
  revalidatePath('/dashboard')
}

export async function leaveGroup(groupId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Kamu harus login terlebih dahulu')

  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Gagal keluar dari grup: ' + error.message)
  }

  revalidatePath('/groups')
  revalidatePath('/dashboard')
}
