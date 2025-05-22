"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectFormData } from '../types';

interface ProjectFormProps {
  initialData?: ProjectFormData;
  projectId?: string;
  isEdit?: boolean;
  adminMode?: boolean; // Add this prop for admin editing capabilities
}

export default function ProjectForm({ initialData, projectId, isEdit = false, adminMode = false }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    minTeamSize: 2,
    maxTeamSize: 5,
    environment: 'internal',
    additionalRequests: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'minTeamSize' || name === 'maxTeamSize' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Use admin API endpoint if in admin mode
      const url = isEdit
        ? adminMode
          ? `/api/admin/projects/${projectId}`
          : `/api/projects/${projectId}`
        : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting project:', err);
      setError('Failed to submit project. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {isEdit ? 'Edit Project' : 'Submit a New Project Idea'}
      </h2>
      
      <div className="bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-500 dark:border-blue-400 p-6 mb-6 rounded-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-100 mb-3">AI Hackathon Guidelines</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-blue-100">1. Company-Relevance</h4>
            <p className="text-gray-700 dark:text-blue-200">• Should be related to Final</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-blue-100">2. AI Integration</h4>
            <p className="text-gray-700 dark:text-blue-200">• Makes meaningful use of AI</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-blue-100">3. Hackathon-Sized Scope</h4>
            <p className="text-gray-700 dark:text-blue-200">• Can be built to a demo-ready/POC within 2 days</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-blue-100">4. Internal & External Network</h4>
            <p className="text-gray-700 dark:text-blue-200">• Both internal and external networks are available for your projects</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-blue-100">5. Team Size</h4>
            <p className="text-gray-700 dark:text-blue-200">• 4-7 participants per team is recommended</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-400 p-4 mb-6">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter a descriptive title for your project"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe your AI project idea, its goals, and potential impact"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="minTeamSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Minimum Team Size
          </label>
          <select
            id="minTeamSize"
            name="minTeamSize"
            value={formData.minTeamSize}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'person' : 'people'}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="maxTeamSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Maximum Team Size
          </label>
          <select
            id="maxTeamSize"
            name="maxTeamSize"
            value={formData.maxTeamSize}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num} disabled={num < formData.minTeamSize}>
                {num} {num === 1 ? 'person' : 'people'}
              </option>
            ))}
          </select>
          {formData.maxTeamSize < formData.minTeamSize && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              Maximum team size must be greater than or equal to minimum team size
            </p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Environment</legend>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="environment-internal"
                name="environment"
                type="radio"
                checked={formData.environment === 'internal'}
                onChange={() => setFormData(prev => ({ ...prev, environment: 'internal' }))}
                className="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="environment-internal" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Internal
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="environment-external"
                name="environment"
                type="radio"
                checked={formData.environment === 'external'}
                onChange={() => setFormData(prev => ({ ...prev, environment: 'external' }))}
                className="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="environment-external" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                External
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="additionalRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Additional Requests (Optional)
        </label>
        <textarea
          id="additionalRequests"
          name="additionalRequests"
          value={formData.additionalRequests || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Any special requirements or additional information..."
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || formData.maxTeamSize < formData.minTeamSize}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : isEdit ? 'Update Project' : 'Submit Project'}
        </button>
      </div>
    </form>
  );
}
