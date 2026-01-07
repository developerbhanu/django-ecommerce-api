from django.urls import path
from .views import CartView, CartItemListCreateView, CartItemDetailView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),

    path('items/', CartItemListCreateView.as_view(), name='cart-items'),
    path('items/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
]
