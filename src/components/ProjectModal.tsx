'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProjectWithCreator } from '../types';

interface ProjectModalProps {
  project: ProjectWithCreator;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const [selectedPreference, setSelectedPreference] = useState<number>(project.userPreference || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset form state when project changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedPreference(project.userPreference || 1);
      setError(null);
      setSuccessMessage(null);
      setIsLoading(false);
    }
  }, [isOpen, project.userPreference]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, preference: selectedPreference }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to register for the project.');
      }
      setSuccessMessage('Successfully registered for the project!');
      // Ideally, refresh project data or notify parent to reflect changes
      // For now, we can update the project prop locally if the API returns the updated project
      // Or simply rely on onClose and subsequent data refetch
      onClose(); // Close modal and let parent refetch data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRegistration = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST', // API uses POST for create/update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, preference: selectedPreference }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update registration.');
      }
      setSuccessMessage('Registration updated successfully!');
      onClose(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!confirm('Are you sure you want to unregister from this project?')) return;
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/registrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to unregister from the project.');
      }
      setSuccessMessage('Successfully unregistered from the project.');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full p-1"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Team Size</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {project.minTeamSize === project.maxTeamSize
                    ? `${project.minTeamSize} members`
                    : `${project.minTeamSize} - ${project.maxTeamSize} members`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Environment</h3>
                <p className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    project.environment === 'internal'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                      : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100'
                  }`}>
                    {project.environment === 'internal' ? 'Internal' : 'External'}
                  </span>
                </p>
              </div>
            </div>

            {project.additionalRequests && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Additional Requirements</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{project.additionalRequests}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  Created by: <span className="font-medium">{project.creator.name || project.creator.email}</span>
                </div>
                <div>
                  Created: <span className="font-medium">{formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Section */}
          {session && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {project.isRegistered ? 'Manage Your Registration' : 'Register for this Project'}
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  <p className="text-sm font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                  <p className="text-sm font-medium">Success</p>
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="preference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select your preference:
                  </label>
                  <select
                    id="preference"
                    name="preference"
                    value={selectedPreference}
                    onChange={(e) => setSelectedPreference(Number(e.target.value))}
                    disabled={isLoading}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value={1}>1st Choice</option>
                    <option value={2}>2nd Choice</option>
                    <option value={3}>3rd Choice</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                  {project.isRegistered ? (
                    <button
                      type="button"
                      onClick={handleUpdateRegistration}
                      disabled={isLoading || selectedPreference === project.userPreference}
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Updating...' : 'Update Preference'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRegister}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Registering...' : 'Register for Project'}
                    </button>
                  )}

                  {project.isRegistered && (
                    <button
                      type="button"
                      onClick={handleUnregister}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Unregister'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
