'use client';
import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();
                setProjects(data);
            }
            catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);
    const handleDeleteProject = (id) => {
        setProjects((prev) => prev.filter((project) => project.id !== id));
    };
    if (loading) {
        return (<div className="min-h-[400px] flex flex-col justify-center items-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-100 opacity-25"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-l-4 border-indigo-600 animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-500 font-medium">Loading projects...</p>
      </div>);
    }
    if (error) {
        return (<div className="card border-0 shadow-lg bg-gradient-to-r from-red-50 to-rose-50 p-8 my-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Unable to load projects</h3>
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Try again
            </button>
          </div>
        </div>
      </div>);
    }
    if (projects.length === 0) {
        return (<div className="card flex flex-col items-center text-center py-16 px-8 bg-white/80 backdrop-blur-md border-dashed border-2 border-gray-200">
        <div className="bg-indigo-50 rounded-full p-6 mb-6">
          <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No projects yet</h3>
        <p className="text-gray-600 mb-8 max-w-md">
          Be the first to share your innovative idea with the team! Great hackathon projects start with a single submission.
        </p>
        <a href="/submit" className="btn animate-pulse-slow">
          <span className="mr-2">✨</span>Submit Your Project
        </a>
      </div>);
    }
    return (<div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
      {projects.map((project) => (<ProjectCard key={project.id} project={project} onDelete={handleDeleteProject}/>))}
    </div>);
}
