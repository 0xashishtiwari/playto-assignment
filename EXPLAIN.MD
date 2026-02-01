Great question — this is exactly the kind of document that shows **engineering maturity**, not just “it works”.

Below is a **complete `EXPLAINER.md`** you can place at the **root of your repo**.
It explains **architecture, frontend–backend flow, APIs, data modeling, N+1 avoidance, comment tree design, and karma logic** in clear, interview-ready language.

You can copy–paste this as is.

---

# 📘 EXPLAINER.md

**Full-Stack Architecture & Design Explanation**

This document explains the **design, architecture, and implementation details** of the project, covering the **frontend, backend, API layer, database models, performance considerations (N+1 queries), threaded comments, and karma leaderboard system**.

---

## 📸 Screenshots

### Community Feed
![Community Feed](docs/screenshots/feed.png)

### Post Detail & Threaded Comments
![Post Detail](docs/screenshots/post-detail.png)

### Comments
![Karma Leaderboard](docs/screenshots/comments.png)


## 🧱 High-Level Architecture

This project is a **full-stack web application** built using:

* **Backend**: Django + Django REST Framework
* **Frontend**: React
* **Database**: SQLite (development)
* **Communication**: REST APIs over HTTP

The frontend and backend live in the **same repository** but are logically separated.

```
React (Frontend)
   ↓ HTTP (Axios)
Django REST API
   ↓ ORM
Database
```

---

## ⚛️ Frontend Overview (React)

The frontend is responsible for:

* Rendering the feed
* Creating posts and comments
* Displaying threaded comments
* Liking posts and comments
* Showing the karma leaderboard

### Key frontend patterns

* `useEffect` is used to fetch data on component mount
* Axios is used for API communication
* State is managed locally using `useState`
* UI is **minimal, light, and distraction-free**

### Example: Fetching feed data

```js
useEffect(() => {
  axios.get("http://localhost:8000/api/feed/")
    .then(res => setFeed(res.data))
}, [])
```

This ensures:

* Data is fetched only once
* UI stays responsive
* Backend controls ordering and structure

---

## 🐍 Backend Overview (Django REST)

The backend is a **pure API server** responsible for:

* Data persistence
* Business logic
* Efficient querying
* Serialization of nested data
* Karma calculation

All responses are JSON-based.

---

## 🔗 API Endpoints

```python
urlpatterns = [
    path('', hello),
    path('feed/', feed),
    path('create-post/', create_post),
    path('create-comment/', create_comment),
    path('posts/<int:post_id>/comments/', posts_comments),
    path('comments/<int:comment_id>/like/', like_comment),
    path('posts/<int:post_id>/like/', like_post),
    path('karma-leaderboard/', karma_leaderboard),
]
```

### Endpoint responsibilities

| Endpoint               | Purpose                 |
| ---------------------- | ----------------------- |
| `/feed/`               | Fetch all posts         |
| `/create-post/`        | Create a new post       |
| `/create-comment/`     | Create comment or reply |
| `/posts/:id/comments/` | Fetch threaded comments |
| `/posts/:id/like/`     | Like / unlike post      |
| `/comments/:id/like/`  | Like / unlike comment   |
| `/karma-leaderboard/`  | Top users by karma      |

---

## 🗄️ Data Models & Relationships

### Post Model

```python
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```

* One post → many comments
* One post → many likes

---

### Comment Model (Threaded Design)

```python
class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='replies',
        on_delete=models.CASCADE
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```

#### Why parent-based comments?

* Enables **unlimited nesting**
* Efficient storage (single table)
* Simple querying
* Matches real-world discussion trees

This avoids creating separate tables for replies.

---

## 🚀 Avoiding the N+1 Query Problem

### The Problem

Naively fetching comments and their replies can cause:

> 1 query for comments
>
> * N queries for replies
>   = ❌ performance issue

---

### The Solution

1. **Fetch all comments for a post in a single query**
2. **Build the comment tree in memory**
3. **Serialize nested comments without extra DB hits**

```python
comments = Comment.objects.filter(
    post__id=post_id
).select_related('author').order_by('created_at')
```

* `select_related('author')` avoids extra user queries
* One query fetches everything needed

---

## 🌳 Building the Comment Tree (Efficiently)

Instead of recursive DB queries, comments are transformed **once** in memory.

Conceptually:

```text
All comments
   ↓
Group by parent
   ↓
Build tree structure
   ↓
Serialize
```

This approach:

* Avoids recursion in the database
* Keeps response fast even with many comments
* Scales well

---

## 🔄 Serializers (Nested, Controlled)

### CommentSerializer

```python
class CommentSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)

    def get_children(self, obj):
        return CommentSerializer(obj.children, many=True).data
```

Key points:

* `SerializerMethodField` allows nested replies
* `likes.count` is computed efficiently
* No extra queries (data already fetched)

---

### PostSerializer

```python
class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    author = serializers.StringRelatedField(source='author.username')
```

* Keeps feed lightweight
* Avoids over-fetching unnecessary data

---

## ❤️ Likes System (Post & Comment)

Separate models for likes:

```python
class PostLike(models.Model):
    post = models.ForeignKey(Post, related_name='likes')
    user = models.ForeignKey(User)

class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, related_name='likes')
    user = models.ForeignKey(User)
```

### Why separate like tables?

* Prevents duplicate likes (`unique_together`)
* Enables easy toggling (like / unlike)
* Supports karma calculation

---

## ⭐ Karma Leaderboard Design

Karma is calculated based on **likes received in the last 24 hours**.

### Rules

* Post like → **+5 points**
* Comment like → **+1 point**

### Implementation

```python
since = timezone.now() - timedelta(hours=24)
```

* Only recent likes are counted
* Karma is calculated dynamically (no stored counters)
* Results are sorted and limited to top 5 users

This keeps:

* Data accurate
* No denormalization
* No background jobs needed (yet)

---

## 🔐 Authentication Note

Currently:

* A temporary user (`User.objects.first()`) is used
* Authentication is intentionally **not implemented**

This keeps the focus on:

* Data modeling
* API design
* Performance
* UI/UX

Auth can be added later without changing core logic.

---

## 🎯 Design Principles Followed

* Separation of concerns
* No N+1 queries
* Minimal API responses
* Efficient data modeling
* Scalable comment structure
* Calm, readable frontend UI

---

## 🧠 Future Improvements

* JWT authentication
* Pagination for feed & comments
* Caching leaderboard results
* WebSockets for live updates
* Database-level aggregation for karma

---

## ✅ Summary

This project demonstrates:

* Clean full-stack separation
* Efficient Django ORM usage
* Thoughtful API design
* Real-world performance considerations
* Scalable discussion system

It’s designed not just to **work**, but to **scale and be understood**.

