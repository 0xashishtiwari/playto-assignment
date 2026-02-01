from rest_framework import serializers
from .models import Post , Comment

class CommentSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    class Meta:
        model = Comment
        fields = ['id',  'author', 'content', 'created_at' , 'likes_count', 'children' ]
        
    def get_children(self, obj):
        return CommentSerializer(obj.children, many=True).data


class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    author  = serializers.StringRelatedField(source='author.username')
    class Meta:
        model = Post
        fields = ['id', 'author', 'content',  'created_at' , 'likes_count' ]
         
    
        
        
        
class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [ 'content']
        

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['post', 'parent', 'content']