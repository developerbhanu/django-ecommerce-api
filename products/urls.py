from django.urls import path
from .views import ProductListCreate, ProductInfo

urlpatterns = [
    path('', ProductListCreate.as_view()),
    path('<int:pk>/', ProductInfo.as_view()),
]
