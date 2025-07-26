import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-gray-300">
              <li><Link to="/products" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Furniture</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Clothing</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Home & Garden</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Faq</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Terms of Services</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white transition-colors">Newsletter</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Social Media</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 V-SVAG Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;