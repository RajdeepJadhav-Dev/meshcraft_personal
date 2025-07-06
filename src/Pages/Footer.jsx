import React from 'react';
import { FaDiscord, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import meshcraftext from "../assets/meshcraft-text.png"

import Meshcrt from "../assets/meshcraft.png";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-8 border-t border-gray-800">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={Meshcrt} 
                alt="MeshCraft Assets" 
                className="w-12 h-12 hover:opacity-90 transition-opacity" 
              />
              <div className='absolute'>
             <img className='h-30 w-30 relative left-10 z-20 ' src={meshcraftext} alt="" />
             </div>
            </div>
            <p className="text-base text-gray-400 leading-relaxed max-w-md">
              Your premier destination for high-quality digital assets and game development resources.
            </p>
          </div>

          {/* Right Section - Social Links and Copyright */}
          <div className="flex flex-col items-end space-y-6 mr-5 mt-6">
            {/* Social Links */}
            <div className="flex space-x-8">
              <a
                href="https://www.instagram.com/meshcraftassets"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="text-3xl" />
              </a>
              <a
                href="https://www.linkedin.com/company/meshcraftassets"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Connect with us on LinkedIn"
              >
                <FaLinkedin className="text-3xl" />
              </a>
              <a
                href="https://discord.gg/sUJ6hSKfYk"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-300"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Join our Discord community"
              >
                <FaDiscord className="text-3xl" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-right text-xs text-gray-500 leading-tight">
              <div>© {new Date().getFullYear()} MeshCraft Assets.</div>
              <div>All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;