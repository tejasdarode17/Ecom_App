import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#212121] border-t">
      <div className="max-w-7xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-300">

        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Trenzzo</h3>
          <p className="mb-3">
            Your one-stop destination for shopping — fashion, electronics,
            mobiles, and more.
          </p>
          <div className="flex gap-3 text-gray-400 hover:text-white">
            <a href="#"><Facebook size={18} /></a>
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Twitter size={18} /></a>
            <a href="#"><Linkedin size={18} /></a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
          <ul className="space-y-2">
            <li><Link to="/category/mobiles" className="hover:text-indigo-400">Mobiles & Tablets</Link></li>
            <li><Link to="/category/fashion" className="hover:text-indigo-400">Fashion</Link></li>
            <li><Link to="/category/electronics" className="hover:text-indigo-400">Electronics</Link></li>
            <li><Link to="/category/home" className="hover:text-indigo-400">Home & Furniture</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="hover:text-indigo-400">Help Center</Link></li>
            <li><Link to="/returns" className="hover:text-indigo-400">Returns & Refunds</Link></li>
            <li><Link to="/shipping" className="hover:text-indigo-400">Shipping Policy</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Get in Touch</h3>
          <p>Email: <span className="text-indigo-400">support@trenzzo.com</span></p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: Mumbai, India</p>
        </div>
      </div>

      <div className="text-gray-400 text-center py-4 text-sm border-t border-gray-700">
        © {new Date().getFullYear()} <span className="text-white">Trenzzo</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

