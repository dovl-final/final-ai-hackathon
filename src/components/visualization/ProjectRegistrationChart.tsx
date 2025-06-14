"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";

// Define all interfaces locally since we're getting data from the API
interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface RegisteredUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface ProjectWithCreator {
  id: string;
  title: string;
  description: string;
  minTeamSize: number;
  maxTeamSize: number;
  environment: 'internal' | 'external';
  additionalRequests: string | null;
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
  creatorId: string;
  creator: User;
}

interface ProjectWithRegistrations extends ProjectWithCreator {
  registrationCount: number;
  registeredUsers: RegisteredUser[];
}

// Project details modal component
const ProjectModal: React.FC<{
  project: ProjectWithRegistrations | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ project, isOpen, onClose }) => {
  if (!project) return null;
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);
  
  // Prevent scrolling of the background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all w-full max-w-2xl">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Modal content */}
          <div className="mt-2">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{project.registrationCount}</span>
                <span className="text-sm text-indigo-600 dark:text-indigo-400">
                  {project.registrationCount === 1 ? "participant" : "participants"}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Created by: {project.creator.name || project.creator.email}</span>
                <span>•</span>
                <span>Team size: {project.minTeamSize} - {project.maxTeamSize}</span>
                <span>•</span>
                <span>Environment: {project.environment}</span>
              </div>
              
              <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{project.description}</p>
                
                {project.additionalRequests && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Additional Requirements</h4>
                    <p className="text-gray-700 dark:text-gray-300">{project.additionalRequests}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Registered Users ({project.registeredUsers.length})
              </h4>
              
              {project.registeredUsers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">No registrations yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {project.registeredUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg"
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xs text-white">
                            {user.name?.charAt(0) || user.email.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium block">{user.name || "User"}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectRegistrationChart: React.FC = () => {
  const [projects, setProjects] = useState<ProjectWithRegistrations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectWithRegistrations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects/registrations");
        
        if (!response.ok) {
          throw new Error("Failed to fetch project registration data");
        }
        
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project registration data:", err);
        setError("Failed to load project registration data");
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-300">
        <p className="font-medium">Error: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  // Calculate total registrations across all projects
  const totalRegistrations = projects.reduce((total, project) => total + project.registrationCount, 0);
  
  // Get unique user count (some users might be registered for multiple projects)
  const uniqueUsers = new Set();
  projects.forEach(project => {
    project.registeredUsers.forEach(user => {
      uniqueUsers.add(user.id);
    });
  });
  const uniqueUserCount = uniqueUsers.size;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:text-gray-100">
      {/* Project details modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      <h2 className="text-2xl font-bold mb-6">Project Registration Visualization</h2>
      
      {/* Summary statistics */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
            <p className="text-sm font-medium text-blue-500 dark:text-blue-300">Total Projects</p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-200">{projects.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl border border-green-100 dark:border-green-800 text-center">
            <p className="text-xs sm:text-sm font-medium text-green-500 dark:text-green-300">Unique Participants</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-200">{uniqueUserCount}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl border border-purple-100 dark:border-purple-800 text-center">
            <p className="text-xs sm:text-sm font-medium text-purple-500 dark:text-purple-300">Total Registrations</p>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-200">{totalRegistrations}</p>
          </div>
        </div>
      )}
      
      {projects.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>No projects or registrations found</p>
        </div>
      ) : (
        <>
          {/* Visual representation of projects and their registrations */}
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4">Registration Overview</h3>
            <div className="space-y-4">
              {projects.map(project => (
                <div 
                  key={project.id} 
                  className="grid grid-cols-[1fr,auto] gap-2 p-2 border border-gray-100 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-indigo-200 dark:hover:border-indigo-700"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsModalOpen(true);
                  }}
                >
                  {/* Left side: Project title */}
                  <div className="text-left self-center overflow-hidden">
                    <p className="font-medium text-sm dark:text-gray-100 truncate">{project.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Team: {project.minTeamSize}-{project.maxTeamSize}</p>
                  </div>
                  
                  {/* Right side: Registration count circle */}
                  <div className="flex items-center gap-2 justify-self-end self-center flex-shrink-0">
                    {/* User avatars */}
                    {project.registeredUsers.length > 0 && (
                      <div className="flex -space-x-2 flex-shrink-0">
                        {project.registeredUsers.slice(0, 3).map(user => (
                          <div 
                            key={user.id} 
                            className="w-7 h-7 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white text-xs ring-2 ring-white dark:ring-gray-800 flex-shrink-0"
                            title={user.name || user.email}
                          >
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span>{user.name?.charAt(0) || user.email.charAt(0)}</span>
                            )}
                          </div>
                        ))}
                        {project.registeredUsers.length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center text-gray-700 dark:text-gray-100 text-xs ring-2 ring-white dark:ring-gray-800 flex-shrink-0">
                            +{project.registeredUsers.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div 
                      className="rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white flex-shrink-0"
                      style={{ 
                        width: "40px",
                        height: "40px",
                        minWidth: "40px"
                      }}
                    >
                      <span className="font-bold">{project.registrationCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Detailed project information */}
          <div className="space-y-6 mt-8">
            {projects.map(project => (
              <div 
                key={project.id} 
                className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-6 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors duration-200"
                onClick={() => {
                  setSelectedProject(project);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold dark:text-white">{project.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created by: {project.creator.name || project.creator.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Team size: {project.minTeamSize} - {project.maxTeamSize} members
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/30 px-4 py-2 rounded-full">
                    <span className="font-semibold dark:text-gray-100">{project.registrationCount}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {project.registrationCount === 1 ? "registration" : "registrations"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Registered Users
                  </h4>
                  
                  {project.registeredUsers.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">No registrations yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {project.registeredUsers.map(user => (
                        <div 
                          key={user.id} 
                          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg"
                        >
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || "User"}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-600">
                                {user.name?.charAt(0) || user.email.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-medium">
                            {user.name || user.email}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectRegistrationChart;