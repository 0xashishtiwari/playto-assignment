from django.urls import path, include
from .views import create_post, feed  ,create_comment, karma_leaderboard, like_comment, like_post, posts_comments , hello

urlpatterns = [
    path('', hello, name='hello'),
    path('feed/', feed, name='feed'),
    path('create-post/', create_post, name='create_post'),
    path('create-comment/', create_comment, name='create_comment'),
    path('posts/<int:post_id>/comments/', posts_comments, name='posts_comments'),
    path('comments/<int:comment_id>/like/', like_comment),
    path('posts/<int:post_id>/like/', like_post, name='like_post'),
    path('karma-leaderboard/', karma_leaderboard, name='karma_leaderboard'),
]
