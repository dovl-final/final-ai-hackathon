'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
  _count: {
    projects: number;
  };
}

interface UserManagementProps {
  users: User[];
}

export default function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const toggleAdmin = async (userId: string, makeAdmin: boolean) => {
    if (makeAdmin && !confirm(`Are you sure you want to make this user an admin? They will have full access to all administration features.`)) {
      return;
    }

    if (!makeAdmin && !confirm(`Are you sure you want to remove admin privileges from this user?`)) {
      return;
    }

    setIsLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: makeAdmin }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      // Update the user in our local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: makeAdmin } : user
      ));

      alert(`User ${makeAdmin ? 'promoted to admin' : 'demoted from admin'} successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Projects
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Admin Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || 'Unnamed'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user._count.projects}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {user.isAdmin ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Admin
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Regular User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user.isAdmin ? (
                    <button
                      onClick={() => toggleAdmin(user.id, false)}
                      disabled={isLoading[user.id]}
                      className="text-red-600 hover:text-red-900 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {isLoading[user.id] ? 'Updating...' : 'Remove Admin'}
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleAdmin(user.id, true)}
                      disabled={isLoading[user.id]}
                      className="text-indigo-600 hover:text-indigo-900 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {isLoading[user.id] ? 'Updating...' : 'Make Admin'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
