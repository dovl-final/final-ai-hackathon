"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ProjectWithCreator } from '../types';

interface ProjectCardProps {
  project: ProjectWithCreator;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = session?.user?.id === project.creatorId;
  
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
          {isOwner && (
            <div className="flex space-x-2">
              <Link
                href={`/edit/${project.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <span className="font-medium">Team Size:</span>
            <span className="ml-1">{project.minTeamSize} - {project.maxTeamSize} members</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Created:</span>
            <span className="ml-1">{formatDate(project.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              Created by: {project.creator.name || project.creator.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
