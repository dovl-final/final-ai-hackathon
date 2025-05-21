'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

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
                className="nav-link text-gray-600 hover:text-indigo-600 flex items-center px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/submit"
                className="nav-link text-gray-600 hover:text-indigo-600 flex items-center px-3 py-2 text-sm font-medium"
              >
                Submit Project
              </Link>
              <a
                href="https://genai-genesis-guide.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link text-gray-600 hover:text-indigo-600 flex items-center px-3 py-2 text-sm font-medium"
              >
                Ai Intro Kit
              </a>
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
            {!loading && !session && (
              <button
                onClick={() => signIn('azure-ad')}
                className="btn text-sm py-2.5 px-5"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 2C6.81 2 3 5.81 3 10.5c0 4.69 3.81 8.5 8.5 8.5 4.69 0 8.5-3.81 8.5-8.5C20 5.81 16.19 2 11.5 2zm0 3c1.93 0 3.5 1.57 3.5 3.5S13.43 12 11.5 12 8 10.43 8 8.5 9.57 5 11.5 5zm0 13.25c-2.77 0-5.22-1.41-6.66-3.56.03-2.03 4.45-3.14 6.66-3.14 2.2 0 6.63 1.11 6.66 3.14-1.44 2.15-3.9 3.56-6.66 3.56z" fill="currentColor"/>
                </svg>
                Sign in with Microsoft 365
              </button>
            )}
            
            {!loading && session && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 dark:border-gray-700/30 shadow-sm">
                  {session.user.image && (
                    <Image
                      className="h-8 w-8 rounded-full ring-2 ring-white/50 dark:ring-gray-700/50"
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
