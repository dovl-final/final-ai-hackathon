"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function ProjectForm({ initialData, projectId, isEdit = false }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        minTeamSize: 2,
        maxTeamSize: 5,
    });
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: name === 'minTeamSize' || name === 'maxTeamSize' ? parseInt(value, 10) : value })));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const url = isEdit ? `/api/projects/${projectId}` : '/api/projects';
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
            }
            else {
                const data = await response.json();
                setError(data.error || 'Something went wrong. Please try again.');
            }
        }
        catch (err) {
            console.error('Error submitting project:', err);
            setError('Failed to submit project. Please try again later.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Project' : 'Submit a New Project Idea'}
      </h2>
      
      {error && (<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>)}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Project Title
        </label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Enter a descriptive title for your project"/>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Project Description
        </label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={6} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Describe your AI project idea, its goals, and potential impact"/>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="minTeamSize" className="block text-sm font-medium text-gray-700">
            Minimum Team Size
          </label>
          <select id="minTeamSize" name="minTeamSize" value={formData.minTeamSize} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            {[1, 2, 3, 4, 5].map((num) => (<option key={num} value={num}>
                {num} {num === 1 ? 'person' : 'people'}
              </option>))}
          </select>
        </div>
        
        <div>
          <label htmlFor="maxTeamSize" className="block text-sm font-medium text-gray-700">
            Maximum Team Size
          </label>
          <select id="maxTeamSize" name="maxTeamSize" value={formData.maxTeamSize} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (<option key={num} value={num} disabled={num < formData.minTeamSize}>
                {num} {num === 1 ? 'person' : 'people'}
              </option>))}
          </select>
          {formData.maxTeamSize < formData.minTeamSize && (<p className="mt-1 text-sm text-red-600">
              Maximum team size must be greater than or equal to minimum team size
            </p>)}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting || formData.maxTeamSize < formData.minTeamSize} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          {isSubmitting ? 'Submitting...' : isEdit ? 'Update Project' : 'Submit Project'}
        </button>
      </div>
    </form>);
}
