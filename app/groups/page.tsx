import { getPublicGroups, getMyGroups } from '@/app/actions/groups'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import JoinGroupButton from './join-button'

export default async function GroupsDirectoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [publicGroups, myGroups] = await Promise.all([
    getPublicGroups(),
    getMyGroups()
  ])

  // Ambil daftar ID grup yang sudah di-join user
  const joinedGroupIds = new Set(myGroups.map((g: any) => g.group_id))

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Direktori Grup Publik</h1>
          <p className="text-gray-400 text-sm">Temukan grup menarik dan bergabunglah dengan komunitas baru.</p>
        </div>
        <Link href="/dashboard" className="text-sm text-blue-400 hover:underline">
          &larr; Ke Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {publicGroups.length === 0 ? (
          <p className="text-gray-500 col-span-2">Belum ada grup publik yang tersedia.</p>
        ) : (
          publicGroups.map((group: any) => {
            const isMember = joinedGroupIds.has(group.id)
            return (
              <div key={group.id} className="p-4 border rounded-lg bg-zinc-900 flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <p className="text-sm text-gray-400">{group.description || 'Tidak ada deskripsi'}</p>
                </div>
                <JoinGroupButton groupId={group.id} isMember={isMember} />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
