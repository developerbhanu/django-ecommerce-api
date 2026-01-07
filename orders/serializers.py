from .models import Order, OrderItem
from products.models import Product
from rest_framework import serializers
from django.db import transaction

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.title')
    product_price = serializers.DecimalField(max_digits=10, decimal_places=2,source='product.price')
    
    class Meta:
        model = OrderItem
        fields = (
            'product_name',
            'product_price',
            'quantity',
            'subtotal',
        )

class OrderItemCreateSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all()
    )
    quantity = serializers.IntegerField(min_value=1)

class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemCreateSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        items_data = validated_data["items"]

        # Create order (status defaults to pending)
        order = Order.objects.create(user=user)

        OrderItem.objects.bulk_create([
            OrderItem(
                order=order,
                product=item["product"],
                quantity=item["quantity"],
            )
            for item in items_data
        ])
            
        return order

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField(method_name='total')

    def total(self, obj):
        order_items = obj.items.all()
        return sum(item.subtotal for item in order_items)
    
    class Meta:
        model = Order
        fields = (
            'order_id',
            'created_at',
            'items',
            'status',
            'user',
            'total_price',
        )
