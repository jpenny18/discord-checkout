'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Application {
  id: string;
  answers: {
    [key: number]: string;
  };
  score: number;
  status: 'qualified' | 'review' | 'accepted' | 'rejected';
  timestamp: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filter, setFilter] = useState<'all' | 'qualified' | 'review' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    try {
      const q = query(collection(db, 'applications'), orderBy('timestamp', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Application[];
        
        setApplications(apps);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up applications listener:', error);
      toast.error('Failed to initialize applications');
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        status: newStatus
      });
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified':
        return 'text-green-400';
      case 'review':
        return 'text-yellow-400';
      case 'accepted':
        return 'text-blue-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Applications</h1>
          <div className="flex gap-2">
            {(['all', 'qualified', 'review', 'accepted', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === status
                    ? 'bg-[#ffc62d] text-black'
                    : 'bg-[#111111] text-gray-300 hover:bg-[#1a1a1a]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                onClick={() => setSelectedApplication(application)}
                className={`p-4 bg-[#111111] rounded-lg cursor-pointer transition-all ${
                  selectedApplication?.id === application.id
                    ? 'border-2 border-[#ffc62d]'
                    : 'border border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{application.answers[1]}</h3>
                    <p className="text-sm text-gray-400">{application.answers[2]}</p>
                  </div>
                  <span className={`text-sm font-medium capitalize ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {format(new Date(application.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Score:</span>
                    <span className={`text-sm font-medium ${
                      application.score >= 70 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {Math.round(application.score)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredApplications.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No applications found
              </div>
            )}
          </div>

          {/* Application Details */}
          {selectedApplication ? (
            <div className="bg-[#111111] rounded-lg p-6 border border-gray-800 h-fit sticky top-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">{selectedApplication.answers[1]}</h2>
                  <p className="text-gray-400">{selectedApplication.answers[2]}</p>
                  <p className="text-gray-400">{selectedApplication.answers[3]}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium capitalize ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Score: {Math.round(selectedApplication.score)}%
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Trading Experience */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Trading Experience</h3>
                  <p className="text-gray-300">{selectedApplication.answers[4]}</p>
                </div>

                {/* Monthly Profit */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Monthly Trading Profit</h3>
                  <p className="text-gray-300">{selectedApplication.answers[5]}</p>
                </div>

                {/* Time Commitment */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Daily Time Commitment</h3>
                  <p className="text-gray-300">{selectedApplication.answers[6]}</p>
                </div>

                {/* Motivation */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Motivation</h3>
                  <p className="text-gray-300">{selectedApplication.answers[7]}</p>
                </div>

                {/* Trading Strategies */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Trading Strategies</h3>
                  <p className="text-gray-300">{selectedApplication.answers[8]}</p>
                </div>

                {/* Trading Capital */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Trading Capital</h3>
                  <p className="text-gray-300">{selectedApplication.answers[9]}</p>
                </div>

                {/* Challenges */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Biggest Challenges</h3>
                  <p className="text-gray-300">{selectedApplication.answers[10]}</p>
                </div>

                {/* Investment Readiness */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Investment Readiness</h3>
                  <p className="text-gray-300">{selectedApplication.answers[11]}</p>
                </div>

                {/* Contact Consent */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Contact Consent</h3>
                  <p className="text-gray-300">{selectedApplication.answers[12] ? 'Yes' : 'No'}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      if (selectedApplication) {
                        handleStatusUpdate(selectedApplication.id, 'accepted');
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-[#ffc62d] text-black rounded-lg hover:bg-[#ffd700] transition-colors"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => {
                      if (selectedApplication) {
                        handleStatusUpdate(selectedApplication.id, 'rejected');
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center h-64 bg-[#111111] rounded-lg border border-gray-800">
              <p className="text-gray-400">Select an application to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 