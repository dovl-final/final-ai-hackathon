"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProjectWithCreator, RegisteredUser } from "@/types";

// Define the interface locally since we're getting data from the API
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        <p className="font-medium">Error: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Project Registration Visualization</h2>
      
      {projects.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No projects or registrations found</p>
        </div>
      ) : (
        <>
          {/* Visual representation of projects and their registrations */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Registration Overview</h3>
            <div className="flex flex-wrap gap-4">
              {projects.map(project => (
                <div 
                  key={project.id} 
                  className="relative flex flex-col items-center p-4"
                  style={{ 
                    width: `${Math.max(150, Math.min(300, project.registrationCount * 20 + 150))}px` 
                  }}
                >
                  {/* Project circle - size based on registration count */}
                  <div 
                    className="rounded-full bg-indigo-600 flex items-center justify-center text-white mb-3"
                    style={{ 
                      width: `${Math.max(50, Math.min(100, project.registrationCount * 10 + 50))}px`,
                      height: `${Math.max(50, Math.min(100, project.registrationCount * 10 + 50))}px` 
                    }}
                  >
                    <span className="font-bold">{project.registrationCount}</span>
                  </div>
                  
                  {/* Project title */}
                  <p className="text-center font-medium text-sm">{project.title}</p>
                  
                  {/* User avatars */}
                  {project.registeredUsers.length > 0 && (
                    <div className="flex flex-wrap justify-center mt-3 gap-1">
                      {project.registeredUsers.slice(0, 5).map(user => (
                        <div 
                          key={user.id} 
                          className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs"
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
                      {project.registeredUsers.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs">
                          +{project.registeredUsers.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Detailed project information */}
          <div className="space-y-6">
            {projects.map(project => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-500">
                      Created by: {project.creator.name || project.creator.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Team size: {project.minTeamSize} - {project.maxTeamSize} members
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full">
                    <span className="font-semibold">{project.registrationCount}</span>
                    <span className="text-sm text-gray-600">
                      {project.registrationCount === 1 ? "registration" : "registrations"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Registered Users
                  </h4>
                  
                  {project.registeredUsers.length === 0 ? (
                    <p className="text-gray-500 italic">No registrations yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {project.registeredUsers.map(user => (
                        <div 
                          key={user.id} 
                          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
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