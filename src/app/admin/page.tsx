'use client';

import { usePartnership } from '@/lib/partnership-provider';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { applications, fetchApplications, loading, error } = usePartnership();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchApplications();
    }
  }, [session, fetchApplications]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage partnership applications and system settings.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.length > 0 ? (
              applications.map((app) => (
                <li key={app.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {app.company}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {app.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {app.fullName} • {app.email}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Applied on{' '}
                          <time dateTime={new Date(app.createdAt).toISOString()}>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </time>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6">
                <p className="text-sm text-gray-500 text-center py-4">
                  No applications found.
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
