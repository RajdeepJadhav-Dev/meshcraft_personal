import React from "react";
import { useLocation, Link } from "react-router-dom";
import Meshcrt from "../assets/meshcraft.png";
import Profile from "../assets/assets/profile.png";

export default function Nav() {
  const location = useLocation();

  // Map label to path
  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT US", path: "/about_us" },
    { label: "SERVICES", path: "/services" },
    { label: "MARKETPLACE", path: "/marketplace" },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-10 backdrop-blur-sm bg-transparent">
      <div className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center">
          <img src={Meshcrt} alt="Logo" className="h-20 absolute top-2 left-4" />
        </div>
        <nav className="flex space-x-10">
          {navItems.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={label}
                to={path}
                className={`text-sm font-medium tracking-wider transition-all duration-300 hover:text-cyan-400 relative ${
                  isActive ? "text-cyan-400" : "text-gray-300"
                } group`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>
        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border border-gray-600 shadow-lg">
          <div className="w-8 h-8 bg-gradient-to-brrounded-full flex items-center justify-center overflow-hidden">
            <img src={Profile} alt="User" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
