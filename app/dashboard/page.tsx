import CreateGroupForm from './create-group'
import { getMyGroups, getUserProfile } from '@/app/actions/groups'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const profile = await getUserProfile()
  if (!profile) {
    redirect('/login')
  }

  const userGroups = await getMyGroups()

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Halo, {profile.full_name || 'User'}!</h1>
        <p className="text-gray-400">Selamat datang di dashboard kamu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Bikin Grup */}
        <div>
          <CreateGroupForm />
        </div>

        {/* Daftar Grup Saya */}
        <div>
          <h2 className="text-xl font-bold mb-4">Grup Saya</h2>
          {userGroups.length === 0 ? (
            <p className="text-gray-400">Kamu belum bergabung di grup mana pun.</p>
          ) : (
            <ul className="space-y-2">
              {userGroups.map((item: any) => (
                <li key={item.group_id} className="p-3 border rounded-lg">
                  <h3 className="font-semibold">{item.groups?.name}</h3>
                  <p className="text-sm text-gray-400">{item.groups?.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
