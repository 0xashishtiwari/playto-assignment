import { useEffect, useState } from "react"
import axios from "axios"
import Comment from "./Comment"
import CommentForm from "./CommentForm"

const PostDetail = ({ post, onClose }) => {
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState(post.likes_count)

  const fetchComments = async () => {
    const res = await axios.get(
      `http://localhost:8000/api/posts/${post.id}/comments/`
    )
    setComments(res.data)
  }

  const likePost = async () => {
    const res = await axios.post(
      `http://localhost:8000/api/posts/${post.id}/like/`
    )

    setLikes(l =>
      res.data.liked ? l + 1 : l - 1
    )
  }

  useEffect(() => {
    fetchComments()
  }, [post.id])

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-900/20 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        className="
          bg-white
          w-full max-w-2xl
          h-[85vh]
          rounded-2xl
          border border-zinc-200
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <h3 className="text-sm font-medium text-zinc-900">
            Post
          </h3>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Post content */}
        <div className="px-6 py-4 border-b border-zinc-200">
          <p className="text-sm text-zinc-800 leading-relaxed">
            {post.content}
          </p>

          <button
            onClick={likePost}
            className="
              mt-3
              text-xs
              text-zinc-500
              hover:text-zinc-700
              transition
            "
          >
            ♥ {likes}
          </button>
        </div>

        {/* Comment form */}
        <div className="px-6 py-4 border-b border-zinc-200">
          <CommentForm
            postId={post.id}
            onSuccess={fetchComments}
          />
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-zinc-400">
              No comments yet
            </p>
          )}

          {comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={post.id}
              onRefresh={fetchComments}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostDetail
