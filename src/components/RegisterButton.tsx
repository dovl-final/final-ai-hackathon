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
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleRegistration}
      disabled={isLoading}
      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto min-w-[120px] sm:min-w-[140px] h-8 sm:h-9 whitespace-nowrap ${
        isRegistered
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 dark:focus:ring-slate-400'
          : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
      } ${
        isLoading ? 'opacity-70 cursor-wait' : ''
      }`}
    >
      {isLoading ? (
        <svg className="animate-spin h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : isRegistered ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414L7.586 11l-1.293 1.293a1 1 0 101.414 1.414L9 12.414l1.293 1.293a1 1 0 001.414-1.414L10.414 11l1.293-1.293z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      )}
      <span className="truncate">
        {isLoading ? '' : isRegistered ? 'Leave' : 'Join'}
      </span>
    </button>
  );
}
