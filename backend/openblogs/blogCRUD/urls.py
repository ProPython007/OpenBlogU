from django.urls import path
from blogCRUD import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('blogs/', views.BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', views.BlogRetrieveUpdateDestroyView.as_view(), name='blog-detail'),
    path('blogs/author/<str:name>/', views.BlogsByAuthorView.as_view(), name='blogs-by-author'),
    
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/register/', views.RegisterUserView.as_view(), name='user-register'),
    
    path('activate/<uidb64>/<token>', views.ActivateAccountView.as_view(), name='activate'),
]