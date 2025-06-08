"use client";

import React, { useState, useEffect, useRef } from "react";

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

const ProjectRegistrationChart: React.FC = () => {
  const [projects, setProjects] = useState<ProjectWithRegistrations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
                  className="flex items-center justify-between p-2 border border-gray-100 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50"
                >
                  {/* Left side: Project title */}
                  <div className="text-left">
                    <p className="font-medium text-sm dark:text-gray-100 max-w-[200px] truncate">{project.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Team: {project.minTeamSize}-{project.maxTeamSize}</p>
                  </div>
                  
                  {/* Right side: Registration count circle */}
                  <div className="flex items-center gap-2">
                    {/* User avatars */}
                    {project.registeredUsers.length > 0 && (
                      <div className="flex -space-x-2">
                        {project.registeredUsers.slice(0, 3).map(user => (
                          <div 
                            key={user.id} 
                            className="w-8 h-8 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white text-xs ring-2 ring-white dark:ring-gray-800"
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
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center text-gray-700 dark:text-gray-100 text-xs ring-2 ring-white dark:ring-gray-800">
                            +{project.registeredUsers.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div 
                      className="rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white"
                      style={{ 
                        width: "50px",
                        height: "50px" 
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
              <div key={project.id} className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-6">
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