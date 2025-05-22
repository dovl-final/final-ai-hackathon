'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProjectWithCreator } from '@/types';

interface ProjectTableProps {
  projects: ProjectWithCreator[];
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [projectList, setProjectList] = useState(projects);
  
  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      setIsDeleting(prev => ({ ...prev, [projectId]: true }));
      
      try {
        const response = await fetch(`/api/admin/projects/${projectId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove the project from the list after successful deletion
          setProjectList(prevProjects => 
            prevProjects.filter(project => project.id !== projectId)
          );
        } else {
          const data = await response.json();
          alert(`Failed to delete: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      } finally {
        setIsDeleting(prev => ({ ...prev, [projectId]: false }));
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creator
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Environment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projectList.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                No projects found
              </td>
            </tr>
          ) : (
            projectList.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {project.title}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {project.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {project.creator.name || 'Unnamed'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.creator.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.minTeamSize} - {project.maxTeamSize}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.environment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(project.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={isDeleting[project.id]}
                    className="text-red-600 hover:text-red-900 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    {isDeleting[project.id] ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
