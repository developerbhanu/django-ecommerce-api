# from django.shortcuts import get_object_or_404
from products.serializers import ProductSerializer, CreateProductSerializer
from products.models import Product
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser

class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if (self.request.method == 'POST'):
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateProductSerializer
        return ProductSerializer

# class ProductList(generics.ListAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

class ProductInfo(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# class CreateProduct(generics.CreateAPIView):
#     model = Product
#     serializer_class = CreateProductSerializer
