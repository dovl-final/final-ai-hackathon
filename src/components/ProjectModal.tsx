'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { ProjectWithCreator } from '../types';
import RegisterButton from './RegisterButton';

interface ProjectModalProps {
  project: ProjectWithCreator;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationUpdate?: (projectId: string, newIsRegistered: boolean, newRegistrationCount: number) => void;
}

export default function ProjectModal({ project, isOpen, onClose, onRegistrationUpdate }: ProjectModalProps) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === project.creatorId;
  const modalRef = useRef<HTMLDivElement>(null);

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

            {/* Registration button section */}
            {session?.user && !isOwner && (
              <div className="py-4 flex justify-center">
                <RegisterButton
                  projectId={project.id}
                  initialIsRegistered={project.isUserRegistered || false}
                  initialRegistrationCount={project.registrationCount || 0}
                  onRegistrationUpdate={onRegistrationUpdate}
                />
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
        </div>
      </div>
    </div>
  );
}
