from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.exceptions import PermissionDenied
from .serializers import BlogSerializer
from rest_framework import generics
from .models import Blog

from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, UserProfileSerializer, RegisterUserSerializer

from django.utils.encoding import force_bytes, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.template.loader import render_to_string
from .utils import TokenGenerator, generate_token

from django.core.mail import EmailMessage
from django.views.generic import View
from django.shortcuts import render
from django.conf import settings
import threading

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


class EmailThread(threading.Thread):
    def __init__(self, email_message):
        threading.Thread.__init__(self)
        self.email_message = email_message
        
    def run(self):
        self.email_message.send()
        
        
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    

class UserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)
    
    
class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as identifier:
            user = None
            
        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            msg = {'details': 'Account is Activated...'}
            return render(request, 'activate_success.html', {'site_url': settings.SITE_URL})
        else:
            return render(request, 'activate_fail.html')


class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Generate token for email verification
            email_subject = 'Activate Your Account'
            message = render_to_string(
                'activate.html',
                {
                    'user': serializer,
                    'domain': f'{settings.BASE_URL.split("//")[-1]}',
                    'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                    'token': generate_token.make_token(user)
                }
            )
            email_msg = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [user.email])
            # email_msg.send()
            email_atThread = EmailThread(email_msg)
            email_atThread.start()

            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)

        # Return the error details with a 400 status code
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    
class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]  # Allow everyone to access the list

    def perform_create(self, serializer):
        # Set the author to the currently authenticated user
        serializer.save(author=self.request.user)  # Ensure the user is authenticated


class BlogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        blog = super().get_object()
        # Only allow the author to update or delete their own post
        if self.request.method in ['PUT', 'PATCH', 'DELETE'] and blog.author != self.request.user:
            raise PermissionDenied("You are not allowed to edit or delete this post.")
        return blog
    
    
class BlogsByAuthorView(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        author_username = self.kwargs['name']  # Retrieve the author ID from the URL
        return Blog.objects.filter(author__username=author_username)
    


