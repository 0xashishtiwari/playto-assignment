import { useState } from "react"
import axios from "axios"
import CommentForm from "./CommentForm"

const Comment = ({ comment, postId, onRefresh }) => {
  const [replying, setReplying] = useState(false)
  const [likes, setLikes] = useState(comment.likes_count)

  const likeComment = async () => {
    const res = await axios.post(
      `http://localhost:8000/api/comments/${comment.id}/like/`
    )

    setLikes(l =>
      res.data.liked ? l + 1 : l - 1
    )
  }

  return (
    <div className="space-y-3">
      {/* Comment */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4">
        <p className="text-sm text-zinc-800 leading-relaxed">
          {comment.content}
        </p>

        <div className="mt-2 flex gap-4 text-xs text-zinc-500">
          <button
            onClick={likeComment}
            className="hover:text-zinc-700 transition"
          >
            ♥ {likes}
          </button>

          <button
            onClick={() => setReplying(v => !v)}
            className="hover:text-zinc-700 transition"
          >
            Reply
          </button>
        </div>

        {replying && (
          <div className="mt-3">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onSuccess={() => {
                setReplying(false)
                onRefresh()
              }}
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.children?.length > 0 && (
        <div className="ml-6 pl-4 border-l border-zinc-200 space-y-3">
          {comment.children.map(child => (
            <Comment
              key={child.id}
              comment={child}
              postId={postId}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment
