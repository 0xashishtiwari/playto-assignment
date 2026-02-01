from datetime import timedelta
from multiprocessing.sharedctypes import Value
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CommentLike, Post, Comment, PostLike
from .serializer import CommentSerializer, PostCreateSerializer, PostSerializer, CommentCreateSerializer
from django.contrib.auth.models import User
from   rest_framework  import status
from .utils import build_comment_tree
from django.utils import timezone


# Create your views here.
@api_view(['GET'])
def feed(request):
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)



@api_view(['POST'])
def create_post(request):
    # temp user 
    user = User.objects.first()
    serializer = PostCreateSerializer(data=request.data)
    if serializer.is_valid():
        post = serializer.save(author=user)
        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_comment(request):
    
    # temp user
    user = User.objects.first()
    serializer = CommentCreateSerializer(data=request.data)
    if serializer.is_valid():
        comment = serializer.save(author=user)
        return Response(CommentCreateSerializer(comment).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def posts_comments(request, post_id):
    comments = Comment.objects.filter(post__id=post_id).select_related('author').order_by('created_at')

    comment_tree = build_comment_tree(comments)
    serializer = CommentSerializer(comment_tree, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def hello(request):
    return Response({"message": "All apis are operational."}, status=status.HTTP_200_OK)


@api_view(['POST'])
def like_post(request, post_id):
    # temp user
    user = User.objects.first()
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    
    post_like, created = PostLike.objects.get_or_create(post=post, user=user)
    if not created:
        post_like.delete()
        return Response({"liked": False, "message": "Post unliked."}, status=status.HTTP_200_OK)
    
    return Response({"liked": True, "message": "Post liked."}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def like_comment(request, comment_id):
    # temp user
    user = User.objects.first()
    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response({"error": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)
    
    comment_like, created = CommentLike.objects.get_or_create(comment=comment, user=user)
    if not created:
        comment_like.delete()
        return Response({"liked": False, "message": "Comment unliked."}, status=status.HTTP_200_OK)
    
    return Response({"liked": True, "message": "Comment liked."}, status=status.HTTP_201_CREATED)


# karma leader board 
@api_view(['GET'])
def karma_leaderboard(request):
    since = timezone.now() - timedelta(hours=24)
    
    karma = {} # user_id -> karma points
    # post likes
    post_likes = PostLike.objects.filter(created_at__gte=since)
    
    for like in post_likes:
        user_id = like.post.author.id
        karma[user_id] = karma.get(user_id, 0) + 5
        
    # comment likes
    comment_likes = CommentLike.objects.filter(created_at__gte=since)
    
    for like in comment_likes:
        user_id = like.comment.author.id
        karma[user_id] = karma.get(user_id, 0) + 1
    
    # sort users by karma points
    sorted_karma = sorted(karma.items(), key=lambda x: x[1], reverse=True)[:5]
    result = []
    
    for user_id, points in sorted_karma:
        user = User.objects.get(id=user_id)
        result.append({
            "user_id": user_id,
            "username": user.username,
            "karma_points": points
        })
    
    return Response(result, status=status.HTTP_200_OK)