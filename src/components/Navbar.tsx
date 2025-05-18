'use client';


import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  // Authentication removed

  return (
    <nav className="card backdrop-blur-xl shadow-lg mx-4 mt-6 mb-4 sm:mx-6 md:mx-8 border border-white/20 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group transition-all duration-300">
                <Image
                  src="/final-logo.svg"
                  alt="Final AI Hackathon"
                  width={120}
                  height={40}
                  className="transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                <div className="h-6 w-px mx-3 bg-gradient-to-b from-indigo-300/40 to-violet-300/40 rounded-full"></div>
                <span className="text-xl font-semibold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 transition-colors">AI Hackathon</span>
              </Link>
            </div>
            
            <div className="hidden md:flex ml-8 space-x-1">
              <Link
                href="/"
                className="nav-link text-gray-200 hover:text-indigo-600 flex items-center px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/submit"
                className="nav-link text-gray-200 hover:text-indigo-600 flex items-center px-3 py-2 text-sm font-medium"
              >
                Submit Project
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="hidden md:flex md:items-center">
            {/* Authentication UI removed */}
          </div>
        </div>
      </div>
    </nav>
  );
}
