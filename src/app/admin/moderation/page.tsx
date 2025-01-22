'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Report {
  id: string;
  type: 'post' | 'comment' | 'user';
  targetId: string;
  reason: string;
  description: string;
  reportedBy: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
  content?: {
    text: string;
    author: string;
    timestamp: Date;
  };
}

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Report['status']>('pending');

  useEffect(() => {
    const reportsQuery = query(
      collection(db, 'reports'),
      where('status', '==', filter),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
      const reportsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        content: doc.data().content ? {
          ...doc.data().content,
          timestamp: doc.data().content.timestamp?.toDate()
        } : undefined
      })) as Report[];
      setReports(reportsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);

  const handleUpdateStatus = async (reportId: string, newStatus: Report['status']) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Moderation</h1>
        <p className="text-gray-400">Manage reported content and user reports</p>
      </div>

      <div className="flex space-x-4">
        {(['pending', 'resolved', 'dismissed'] as Report['status'][]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === status
                ? 'bg-[#ffc62d] text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-[#111111] p-6 rounded-lg space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-medium text-gray-400">
                  {report.type.toUpperCase()} Report
                </span>
                <h3 className="text-lg font-medium text-white mt-1">
                  Reported by: {report.reportedBy}
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  report.status === 'pending'
                    ? 'bg-yellow-900 text-yellow-200'
                    : report.status === 'resolved'
                    ? 'bg-green-900 text-green-200'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {report.status.toUpperCase()}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-300">Reason:</p>
              <p className="text-white">{report.reason}</p>
            </div>

            {report.description && (
              <div>
                <p className="text-sm font-medium text-gray-300">Description:</p>
                <p className="text-white">{report.description}</p>
              </div>
            )}

            {report.content && (
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-300 mb-2">Reported Content:</p>
                <p className="text-white">{report.content.text}</p>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                  <span>By: {report.content.author}</span>
                  <span>
                    {report.content.timestamp.toLocaleDateString()} at{' '}
                    {report.content.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              {report.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                    className="px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-700"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(report.id, 'resolved')}
                    className="px-4 py-2 rounded bg-[#ffc62d] text-black text-sm hover:bg-[#e5b228]"
                  >
                    Resolve
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No {filter} reports found</p>
          </div>
        )}
      </div>
    </div>
  );
} 