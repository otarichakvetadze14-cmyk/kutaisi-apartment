import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-black/90 transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        
        {/* 1. Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-amber-400 font-serif text-xl tracking-wider uppercase font-semibold">
            Kutaisi Central Square
          </span>
        </Link>

        {/* 2. Navigation Links */}
        <nav className="hidden h-20 items-center space-x-8 text-sm font-medium md:flex">
          <Link href="#gallery" className="text-gray-300 hover:text-amber-400 transition-colors">
            გალერეა
          </Link>
          <Link href="#location" className="text-gray-300 hover:text-amber-400 transition-colors">
            მდებარეობა
          </Link>
          <Link href="#attractions" className="text-gray-300 hover:text-amber-400 transition-colors">
            ღირსშესანიშნაობები
          </Link>
          <Link href="#restaurants" className="text-gray-300 hover:text-amber-400 transition-colors">
            რესტორნები
          </Link>
        </nav>

        {/* 3. Action Buttons / Language & Booking */}
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-amber-300/80 border border-amber-500/30 px-2.5 py-1 rounded">
            GE
          </span>
          
          <Link 
            href="#booking" 
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-amber-500/20 transition duration-200"
          >
            დაჯავშნა
          </Link>
        </div>

      </div>
    </header>
  );
}
