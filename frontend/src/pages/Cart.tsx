import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Cart.css';

const Cart: React.FC = () => {
  const { cartItems, updateCartItem, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity
      }));
      await api.post('/orders/', { items: orderItems });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p className="empty-cart">Your cart is empty</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.product} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.product_name}</h3>
              <p className="cart-item-price">${item.product_price}</p>
            </div>
            <div className="cart-item-actions">
              <input 
                type="number" 
                min="1" 
                value={item.quantity}
                onChange={(e) => updateCartItem(item.product, parseInt(e.target.value))}
                className="quantity-input"
              />
              <p className="subtotal">Subtotal: ${item.subtotal}</p>
              <button 
                onClick={() => removeFromCart(item.product)} 
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: ${cartTotal.toFixed(2)}</h2>
        <button onClick={handleCheckout} className="btn btn-primary">
          Proceed to Checkout
        </button>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;
