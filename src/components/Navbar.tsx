"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">Final</span>
                <span className="ml-2 text-xl font-semibold text-gray-800">AI Hackathon</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/submit"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Submit Project
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!loading && !session && (
              <button
                onClick={() => signIn('azure-ad')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in with Microsoft 365
              </button>
            )}
            {!loading && session && (
              <div className="ml-3 relative flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user.image && (
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
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
