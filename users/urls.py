from django.urls import path
from .views import CookieTokenObtainPairView, CookieTokenRefreshView, SignupView

urlpatterns = [
    path('login/', CookieTokenObtainPairView.as_view()),
    path('signup/', SignupView.as_view()),
    path('refresh-token/', CookieTokenRefreshView.as_view()),
]