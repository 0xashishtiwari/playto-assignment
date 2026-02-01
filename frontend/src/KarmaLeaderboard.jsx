import { useEffect, useState } from "react"
import axios from "axios"

const KarmaLeaderboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKarma = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/karma-leaderboard/"
        )
        setUsers(res.data.slice(0, 5))
      } finally {
        setLoading(false)
      }
    }

    fetchKarma()
  }, [])

  return (
    <aside className="w-72">
      <div className="sticky top-24">
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-zinc-900 mb-4">
            Karma Leaderboard
          </h3>

          {loading && (
            <p className="text-sm text-zinc-400">
              Loading…
            </p>
          )}

          {!loading && users.length === 0 && (
            <p className="text-sm text-zinc-400">
              No data yet
            </p>
          )}

          <ul className="space-y-3">
            {users.map((user, index) => (
              <li
                key={user.user_id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 text-xs text-zinc-400">
                    {index + 1}
                  </span>

                  <span
                    className={
                      index === 0
                        ? "text-sm font-medium text-zinc-900"
                        : "text-sm text-zinc-800"
                    }
                  >
                    {user.username}
                  </span>
                </div>

                <span className="text-xs text-zinc-500">
                  {user.karma_points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default KarmaLeaderboard
