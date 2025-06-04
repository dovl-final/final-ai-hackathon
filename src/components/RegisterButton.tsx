'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface RegisterButtonProps {
  projectId: string;
  initialIsRegistered: boolean;
  initialRegistrationCount: number;
  onRegistrationUpdate?: (projectId: string, newIsRegistered: boolean, newRegistrationCount: number) => void;
}

export default function RegisterButton({
  projectId,
  initialIsRegistered,
  initialRegistrationCount,
  onRegistrationUpdate
}: RegisterButtonProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [registrationCount, setRegistrationCount] = useState(initialRegistrationCount);

  useEffect(() => {
    setIsRegistered(initialIsRegistered);
    setRegistrationCount(initialRegistrationCount);
  }, [initialIsRegistered, initialRegistrationCount]);

  const handleRegistration = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements (e.g., opening modal)
    
    if (status === 'loading') return;

    if (!session || !session.user) {
      // Optionally, redirect to sign in or show a message
      // For now, we'll just prevent action if not signed in
      alert('Please sign in to join projects.');
      // Or use: window.location.href = '/api/auth/signin';
      return;
    }

    setIsLoading(true);

    try {
      const method = isRegistered ? 'DELETE' : 'POST';
      const response = await fetch(`/api/projects/${projectId}/register`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newIsRegistered = !isRegistered;
        const newRegistrationCount = newIsRegistered 
          ? registrationCount + 1 
          : registrationCount - 1;
        
        setIsRegistered(newIsRegistered);
        setRegistrationCount(newRegistrationCount);
        
        if (onRegistrationUpdate) {
          onRegistrationUpdate(projectId, newIsRegistered, newRegistrationCount);
        }
      } else {
        const errorData = await response.json();
        console.error('Registration error:', errorData);
        alert(`Failed to ${isRegistered ? 'leave' : 'join'} project: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Client-side registration error:', error);
      alert(`An error occurred. Failed to ${isRegistered ? 'leave' : 'join'} project. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 bg-gray-100 text-gray-500 cursor-not-allowed w-full sm:w-auto min-w-[120px] sm:min-w-[140px] h-9 sm:h-10 whitespace-nowrap border border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
      >
        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleRegistration}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto min-w-[120px] sm:min-w-[140px] h-9 sm:h-10 whitespace-nowrap hover:scale-105 active:scale-95 ${
        isRegistered
          ? 'bg-white text-red-700 border border-red-300 hover:bg-red-50 hover:border-red-400 focus:ring-red-500 dark:bg-slate-800 dark:text-red-300 dark:border-red-700 dark:hover:bg-slate-700'
          : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 focus:ring-violet-500'
      } ${
        isLoading ? 'opacity-70 cursor-wait' : ''
      }`}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : isRegistered ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )}
      <span className="truncate">
        {isLoading ? '' : isRegistered ? 'Leave' : 'Join'}
      </span>
    </button>
  );
}
