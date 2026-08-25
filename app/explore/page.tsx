import { getRandomExplorePosts } from '@/app/actions/feed'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const explorePosts = await getRandomExplorePosts()

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">✨ Explore</h1>
          <p className="text-gray-400 text-sm">
            Temukan konten menarik dan grup baru secara spontan.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/groups" className="text-blue-400 hover:underline">
            Direktori Grup
          </Link>
          <Link href="/dashboard" className="text-blue-400 hover:underline">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {explorePosts.length === 0 ? (
          <div className="p-8 text-center border rounded-lg bg-zinc-900 border-zinc-800 space-y-2">
            <p className="text-gray-400 font-medium">Belum ada postingan eksplorasi baru.</p>
            <p className="text-sm text-gray-500">
              Kamu mungkin sudah bergabung ke semua grup publik yang ada, atau belum ada postingan publik baru.
            </p>
          </div>
        ) : (
          explorePosts.map((post: any) => (
            <div key={post.id} className="p-4 border rounded-lg bg-zinc-900 border-zinc-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-400 font-semibold">
                  📌 {post.groups?.name || 'Grup Publik'}
                </span>
                <span className="text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-gray-200 text-sm whitespace-pre-wrap">{post.content}</p>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs text-gray-400">
                <span>Oleh: {post.profiles?.full_name || 'Anonim'}</span>
                <Link
                  href={`/dashboard/group/${post.group_id}`}
                  className="text-blue-400 hover:underline font-medium"
                >
                  Lihat Grup &rarr;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
