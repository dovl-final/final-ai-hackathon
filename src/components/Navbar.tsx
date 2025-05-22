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
                  src="/final-logo.png"
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
              
              {/* Admin link - only visible to admin users */}
              {session?.user?.isAdmin && (
                <Link
                  href="/admin"
                  className="nav-link text-indigo-600 hover:text-indigo-800 flex items-center px-3 py-2 text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Admin Panel
                </Link>
              )}
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
