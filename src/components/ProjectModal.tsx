'use client';

import { FC, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { ProjectWithCreator } from '../types';
import RegisterButton from './RegisterButton';

interface ProjectModalProps {
  project: ProjectWithCreator;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationUpdate?: (projectId: string, newIsRegistered: boolean, newRegistrationCount: number) => void;
}

const ProjectModal: FC<ProjectModalProps> = ({ project, isOpen, onClose, onRegistrationUpdate }) => {
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop overlay with blur effect */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
        <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h2>
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
            {session?.user && (
              <div className="py-4 flex justify-center">
                <RegisterButton
                  projectId={project.id}
                  initialIsRegistered={project.isUserRegistered || false}
                  initialRegistrationCount={project.registrationCount || 0}
                  onRegistrationUpdate={onRegistrationUpdate}
                  isOwner={isOwner}
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
    </div>
  );
};

export default ProjectModal;
