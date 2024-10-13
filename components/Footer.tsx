import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-yellow-900 to-orange-900 text-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-serif mb-4">Palm Reader AI</h3>
            <p className="text-sm">
              Unlock the mysteries of your future with our advanced AI palm reading technology.
              Discover insights about your life, love, and destiny.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-serif mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-300 transition-colors">About Us</a></li>
              <li><a href="https://bakslash.com/sobre-nosotros-tecnologia-a-medida" className="hover:text-yellow-300 transition-colors">How It Works</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-serif mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              {/* <a href="#" className="hover:text-yellow-300 transition-colors"><Facebook size={24} /></a>
              <a href="#" className="hover:text-yellow-300 transition-colors"><Twitter size={24} /></a>
              <a href="#" className="hover:text-yellow-300 transition-colors"><Instagram size={24} /></a> */}
                <a href="mailto:eduardo.hernandez@bakslash.com" className="hover:text-yellow-300 transition-colors">
                <Mail size={24} />
                eduardo.hernandez@bakslash.com
              </a>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-yellow-800 text-center">
          <p className="text-sm">
            © {currentYear} Palm Reader AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;