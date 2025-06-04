'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ProjectWithCreator } from '../types';
import ProjectModal from './ProjectModal';
import RegisterButton from './RegisterButton';

// Removed ProjectRegistrationResponse interface, handled by RegisterButton

interface ProjectCardProps {
  project: ProjectWithCreator;
  onDelete?: (id: string) => void;
  onRegistrationChange?: (projectId: string, newIsRegistered: boolean, newRegistrationCount: number) => void;
}

export default function ProjectCard({ project, onDelete, onRegistrationChange }: ProjectCardProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner = session?.user?.id === project.creatorId;

  // Registration state is now managed by RegisterButton component

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/projects/${project.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          onDelete?.(project.id);
        } else {
          const error = await response.json();
          alert(`Failed to delete: ${error.error}`);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Generate random gradient colors for decorative elements
  const gradientVariants = [
    'from-blue-400 to-indigo-500',
    'from-violet-400 to-purple-500',
    'from-pink-400 to-rose-500',
    'from-orange-400 to-amber-500',
    'from-green-400 to-emerald-500',
    'from-teal-400 to-cyan-500'
  ];
  
  // Use project ID to pick a consistent gradient
  const gradientIndex = project.id.charCodeAt(0) % gradientVariants.length;
  const gradientClasses = gradientVariants[gradientIndex];

  // handleRegister logic is now encapsulated in RegisterButton component

  return (
    <>
      <div 
        className="card overflow-hidden flex flex-col h-full transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
      {/* Card header with decorative gradient accent */}
      <div className={`h-2 bg-gradient-to-r ${gradientClasses} w-full`}></div>
      
      <div className="p-7 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
              {project.title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
              project.environment === 'internal' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-gray-50' 
                : 'bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-gray-50'
            }`}>
              {project.environment === 'internal' ? 'Internal' : 'External'}
            </span>
          </div>

          {isOwner && (
            <div className="flex space-x-2 shrink-0">
              <Link
                href={`/edit/${project.id}`}
                className="flex items-center justify-center rounded-full w-8 h-8 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                title="Edit project"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center rounded-full w-8 h-8 bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                title="Delete project"
              >
                {isDeleting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
        
        <div className="relative mb-6">
          <p className="text-gray-600 line-clamp-3">
            {project.description}
          </p>
          
        </div>
        
        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-slate-300 mb-4">
            <div className="flex items-center bg-gray-50 dark:bg-slate-700 rounded-full px-3 py-1">
              <svg className="w-4 h-4 mr-1.5 text-gray-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="font-medium">{project.minTeamSize} - {project.maxTeamSize}</span>
            </div>
            <div className="flex items-center bg-gray-50 dark:bg-slate-700 rounded-full px-3 py-1">
              <svg className="w-4 h-4 mr-1.5 text-gray-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(project.createdAt)}</span>
            </div>
          </div>

          {/* RegisterButton - Below date/participants, above creator */}
          {session?.user && !isOwner && (
            <div className="mt-4 mb-4 flex justify-center">
              <RegisterButton
                projectId={project.id}
                initialIsRegistered={project.isUserRegistered || false}
                initialRegistrationCount={project.registrationCount || 0}
                onRegistrationUpdate={onRegistrationChange}
              />
            </div>
          )}

          <div className="flex items-center pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
              {(project.creator.name || project.creator.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {project.creator.name || project.creator.email}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Project Creator</p>
            </div>
          </div>
        </div>
        </div>
      </div>
      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
