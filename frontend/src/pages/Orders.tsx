import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Order } from '../types';
import './Orders.css';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>('/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <p className="no-orders">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.order_id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order.order_id.slice(0, 8)}</h3>
                <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`order-status status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span className="item-name">{item.product_name}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                  <span className="item-price">${item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: ${order.total_price}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
