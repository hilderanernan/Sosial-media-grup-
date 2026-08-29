'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createGroup(formData: FormData) {
  try {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name) return { error: 'Nama grup tidak boleh kosong' }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Anda belum login' }

    const { error } = await supabase.from('groups').insert([
      { name, description, created_by: user.id }
    ])

    if (error) {
      return { error: `Database error: ${error.message}` }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: `Server crash: ${err?.message || String(err)}` }
  }
}
