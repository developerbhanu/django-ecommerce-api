import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>('/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="product-list-container">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <span className="product-stock">Stock: {product.stock}</span>
              </div>
              <div className="product-actions">
                <Link to={`/products/${product.id}`} className="btn btn-secondary">View Details</Link>
                <button 
                  onClick={() => handleAddToCart(product.id)} 
                  className="btn btn-primary"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
