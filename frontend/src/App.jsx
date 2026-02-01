import React, { useEffect, useState } from "react"
import axios from "axios"
import PostDetail from "./PostDetail"
import CreatePost from "./CreatePost"
import KarmaLeaderboard from "./KarmaLeaderboard"

const App = () => {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true)
      try {
        const res = await axios.get("http://localhost:8000/api/feed/")
        setFeed(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [])

  const handlePostCreated = (newPost) => {
    setFeed(prev => [newPost, ...prev])
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-zinc-50 text-zinc-500">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_640px_300px] gap-10">

          {/* LEFT SPACER (empty on purpose) */}
          <div className="hidden lg:block" />

          {/* CENTER FEED */}
          <main>
            <h2 className="text-xl font-semibold text-zinc-900 mb-8">
              Playto Community
            </h2>

            <CreatePost onPostCreated={handlePostCreated} />

            {/* No post message */}
            {feed.length === 0 && (
              <p className="mt-8 text-center text-zinc-500">
                No posts yet. Be the first to share something!
              </p>
            )}

            {/* Posts */}
            <div className="mt-8 space-y-4">
              {feed.map(post => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="
                    cursor-pointer
                    rounded-xl
                    border border-zinc-200
                    bg-white
                    p-5
                    transition
                    hover:bg-zinc-50
                  "
                >
                  <h3 className="text-sm font-medium text-zinc-900 mb-1">
                    {post.author}
                  </h3>

                  <p className="text-sm text-zinc-700 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="mt-3 flex justify-between text-xs text-zinc-400">
                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span>
                      ♥ {post.likes_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block">
            <KarmaLeaderboard />
          </aside>

        </div>
      </div>

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  )
}

export default App
