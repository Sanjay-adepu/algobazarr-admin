import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false); // For desktop
  const [showMobileProducts, setShowMobileProducts] = useState(false); // For mobile

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleMobileProducts = () => setShowMobileProducts(!showMobileProducts);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">AlgoBazarr Admin</Link>
        </div>

        {isMobile ? (
          <div className="navbar-right" onClick={toggleMenu}>
            <div className={`menu-icon ${isOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <ul className="navbar-links">
            <li
              className="dropdown"
              onMouseEnter={() => setShowProducts(true)}
              onMouseLeave={() => setShowProducts(false)}
            >
              Products
              {showProducts && (
                <ul className="dropdown-menu">
                  <li><Link to="/add-product">Add Product</Link></li>
                  <li><Link to="/products">Product List</Link></li>
                </ul>
              )}
            </li>
            <li><Link id="text" to="/order">Orders</Link></li>
            <li><Link id="text" to="/users">Users</Link></li>
          </ul>
        )}
      </nav>

      {isMobile && (
        <div className={`sidebar-left ${isOpen ? 'show' : ''}`}>
          <ul>
            <li><Link to="/order">Orders</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li onClick={toggleMobileProducts}>
              Products {showMobileProducts ? '▲' : '▼'}
            </li>
            {showMobileProducts && (
              <ul className="mobile-submenu">
                <li><Link to="/add-product">Add Product</Link></li>
                <li><Link to="/products">Product List</Link></li>
              </ul>
            )}
          </ul>
        </div>
      )}
    </>
  );
}