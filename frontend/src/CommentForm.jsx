import { useState } from "react"
import axios from "axios"

const CommentForm = ({ postId, parentId = null, onSuccess }) => {
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      setSubmitting(true)

      await axios.post("http://localhost:8000/api/create-comment/", {
        content,
        post: postId,
        parent: parentId,
      })

      setContent("")
      onSuccess()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        rows={2}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply…" : "Write a comment…"}
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="
            text-sm
            text-zinc-600
            hover:text-zinc-900
            transition
            disabled:opacity-40
          "
        >
          {submitting ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
