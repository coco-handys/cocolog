from django.urls import path
from .views import UserRegistrationView, UserLoginView, user_logout, user_profile

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', user_logout, name='user-logout'),
    path('profile/', user_profile, name='user-profile'),
]
