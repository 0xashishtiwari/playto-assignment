import { useState } from "react"
import axios from "axios"

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const res = await axios.post(
        "http://localhost:8000/api/create-post/",
        { content }
      )

      setContent("")
      onPostCreated(res.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="
        bg-white
        border border-zinc-200
        rounded-xl
        p-4
      "
    >
      <textarea
        rows={3}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Share something…"
        className="
          w-full
          resize-none
          rounded-lg
          border border-zinc-200
          bg-white
          px-3 py-2
          text-sm text-zinc-800
          placeholder:text-zinc-400
          focus:outline-none
          focus:ring-1 focus:ring-zinc-300
        "
      />

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="
            text-sm
            text-zinc-600
            hover:text-zinc-900
            transition
            disabled:opacity-40
          "
        >
          {loading ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  )
}

export default CreatePost
