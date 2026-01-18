import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">E-Commerce</Link>
        <ul className="navbar-menu">
          <li><Link to="/">Products</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/orders">Orders</Link></li>
              <li>
                <Link to="/cart" className="cart-link">
                  Cart ({cartItems.length})
                </Link>
              </li>
              <li><button onClick={logout} className="logout-btn">Logout</button></li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
