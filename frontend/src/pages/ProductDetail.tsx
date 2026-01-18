import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get<Product>(`/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (product) {
      try {
        await addToCart(product.id, quantity);
        alert('Product added to cart!');
        navigate('/cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>
      <div className="product-detail-info">
        <h1>{product.title}</h1>
        <p className="price">${product.price}</p>
        <p className="stock">Stock: {product.stock} available</p>
        <p className="description">{product.description}</p>
        <div className="quantity-selector">
          <label>Quantity:</label>
          <input 
            type="number" 
            min="1" 
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <button 
          onClick={handleAddToCart} 
          className="btn btn-primary"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
