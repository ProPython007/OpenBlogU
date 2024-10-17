from rest_framework import serializers
from .models import Blog

from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class BlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  # Use the UserSerializer for the author field, read-only for output

    class Meta:
        model = Blog
        fields = ['id', 'title', 'author', 'body', 'createdAt']
        read_only_fields = ['createdAt']  # Ensure createdAt is read-only
        
        
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['id'] = self.user.id
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    isAdmin = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'isAdmin']
    
    def get_isAdmin(self, obj):
        return obj.is_staff
    
    
class RegisterUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already registered.")]
    )
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        error_messages={
            'required': 'Password is required.',
            'blank': 'Password cannot be blank.'
        }
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True, 
        error_messages={
            'required': 'Please confirm your password.',
            'blank': 'Password confirmation cannot be blank.'
        }
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email')
        extra_kwargs = {
            'username': {
                'required': True,
                'error_messages': {
                    'required': 'Username is required.',
                    'blank': 'Username cannot be blank.'
                }
            },
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password2": "Password confirmation does not match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            is_active=False
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
