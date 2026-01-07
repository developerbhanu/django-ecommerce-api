from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.title', read_only=True)
    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = (
            'product',
            'product_name',
            'product_price',
            'quantity',
            'subtotal',
        )


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        return sum(item.subtotal for item in obj.items.all())

    class Meta:
        model = Cart
        fields = (
            'cart_id',
            'created_at',
            'updated_at',
            'items',
            'total_price',
        )
