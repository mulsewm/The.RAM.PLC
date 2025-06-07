'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { PartnershipApplication, Status } from '@prisma/client';

interface PartnershipContextType {
  applications: PartnershipApplication[];
  loading: boolean;
  error: string | null;
  fetchApplications: (filter?: Record<string, any>) => Promise<void>;
  getApplication: (id: string) => Promise<PartnershipApplication | null>;
  updateApplicationStatus: (id: string, status: Status, notes?: string) => Promise<boolean>;
  createNote: (applicationId: string, content: string) => Promise<boolean>;
  uploadAttachment: (applicationId: string, file: File, description?: string) => Promise<boolean>;
}

const PartnershipContext = createContext<PartnershipContextType | undefined>(undefined);

export function PartnershipProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<PartnershipApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async (filter: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(filter).toString();
      const response = await fetch(`/api/partnerships?${query}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplication = useCallback(async (id: string): Promise<PartnershipApplication | null> => {
    try {
      const response = await fetch(`/api/partnerships/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch application');
      }
      
      const data = await response.json();
      return data.data || null;
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, []);

  const updateApplicationStatus = useCallback(async (id: string, status: Status, notes?: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/partnerships/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      // Refresh the applications list
      await fetchApplications();
      return true;
    } catch (err) {
      console.error('Error updating application status:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchApplications]);

  const createNote = useCallback(async (applicationId: string, content: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/partnerships/${applicationId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      return true;
    } catch (err) {
      console.error('Error creating note:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, []);

  const uploadAttachment = useCallback(async (applicationId: string, file: File, description?: string): Promise<boolean> => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    try {
      const response = await fetch(`/api/partnerships/${applicationId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload attachment');
      }

      return true;
    } catch (err) {
      console.error('Error uploading attachment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, []);

  const value = {
    applications,
    loading,
    error,
    fetchApplications,
    getApplication,
    updateApplicationStatus,
    createNote,
    uploadAttachment,
  };

  return (
    <PartnershipContext.Provider value={value}>
      {children}
    </PartnershipContext.Provider>
  );
}

export function usePartnership() {
  const context = useContext(PartnershipContext);
  if (context === undefined) {
    throw new Error('usePartnership must be used within a PartnershipProvider');
  }
  return context;
}
