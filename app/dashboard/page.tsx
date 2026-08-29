import CreateGroupForm from './create-group'
import CreatePostForm from './create-post'
import { getMyGroups, getUserProfile } from '@/app/actions/groups'
import { getPublicPosts } from '@/app/actions/feed'

export default async function DashboardPage() {
  const profile = await getUserProfile()

  const [userGroups, posts] = await Promise.all([
    getMyGroups(),
    getPublicPosts()
  ])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header Profile */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Halo, {profile?.full_name || 'User'}!</h1>
        <p className="text-gray-400 text-sm">Selamat datang di dashboard sosial media grup kamu.</p>
      </div>

      {/* Main Grid: Feed di Kiri, Sidebar Grup di Kanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Kolom Kiri: Feed Postingan (Lebar 2 Kolom) */}
        <div className="md:col-span-2 space-y-6">
          <CreatePostForm />

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Timeline Public</h2>
            {posts.length === 0 ? (
              <p className="text-gray-400">Belum ada postingan sama sekali. Jadi yang pertama buat postingan!</p>
            ) : (
              posts.map((post: any) => (
                <div key={post.id} className="p-4 border rounded-lg bg-zinc-900/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-400">
                      {post.profiles?.full_name || 'Anonim'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-200">{post.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kolom Kanan: Sidebar Grup (Lebar 1 Kolom) */}
        <div className="space-y-6">
          <CreateGroupForm />

          <div>
            <h2 className="text-xl font-bold mb-4">Grup Saya</h2>
            {userGroups.length === 0 ? (
              <p className="text-gray-400 text-sm">Kamu belum bergabung di grup mana pun.</p>
            ) : (
              <ul className="space-y-2">
                {userGroups.map((item: any) => (
                  <li key={item.group_id} className="p-3 border rounded-lg bg-zinc-900">
                    <h3 className="font-semibold">{item.groups?.name}</h3>
                    <p className="text-sm text-gray-400">{item.groups?.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
