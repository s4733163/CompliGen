from .views import *
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('api/register', UserRegisterView.as_view(), name='register'),
    path('api/login', EmailTokenObtainPairView.as_view(), name='login'),
    path('api/user/verify', UserVerificationView.as_view(), name='verify_user'),
    path('failed/verify', ResendEmailVerification.as_view(), name='resend'),
    path('api/token/refresh/',jwt_views.TokenRefreshView.as_view(),name='token_refresh'),
    path('api/user/reset/', UserResetAPIView.as_view(), name='reset'),
    path('api/user/password/new/', PasswordResetAPIView.as_view(), name='password'),
    path('api/credentials', UserProfile.as_view(), name='credentials')
]