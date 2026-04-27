'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Users, FileText, RefreshCw, Search } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface EmailEntry {
  email: string;
  firstName: string;
  lastName: string;
  source: 'free-course' | 'application' | 'user';
  registeredAt?: string;
}

export default function AllEmailsPage() {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<'all' | 'free-course' | 'application' | 'user'>('all');

  const fetchAllEmails = async () => {
    setLoading(true);
    try {
      const allEmails: EmailEntry[] = [];
      const seenEmails = new Set<string>();

      // Fetch free course registrations
      const freeCourseQuery = query(
        collection(db, 'freeCourseRegistrations'),
        orderBy('registeredAt', 'desc')
      );
      const freeCourseSnapshot = await getDocs(freeCourseQuery);
      freeCourseSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const email = data.email?.toLowerCase();
        if (email && !seenEmails.has(email)) {
          seenEmails.add(email);
          const nameParts = (data.name || '').split(' ');
          allEmails.push({
            email: data.email,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            source: 'free-course',
            registeredAt: data.registeredAt
          });
        }
      });

      // Fetch applications
      const applicationsQuery = query(
        collection(db, 'applications'),
        orderBy('timestamp', 'desc')
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);
      applicationsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const email = data.answers?.[2]?.toLowerCase();
        if (email && !seenEmails.has(email)) {
          seenEmails.add(email);
          const nameParts = (data.answers?.[1] || '').split(' ');
          allEmails.push({
            email: data.answers[2],
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            source: 'application',
            registeredAt: data.timestamp
          });
        }
      });

      // Fetch users
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );
      const usersSnapshot = await getDocs(usersQuery);
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const email = data.email?.toLowerCase();
        if (email && !seenEmails.has(email)) {
          seenEmails.add(email);
          allEmails.push({
            email: data.email,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            source: 'user',
            registeredAt: data.createdAt?.toDate?.()?.toISOString() || ''
          });
        }
      });

      setEmails(allEmails);
      setFilteredEmails(allEmails);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmails();
  }, []);

  useEffect(() => {
    let filtered = emails;

    // Filter by source
    if (filterSource !== 'all') {
      filtered = filtered.filter(email => email.source === filterSource);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(email => 
        email.email.toLowerCase().includes(search) ||
        email.firstName.toLowerCase().includes(search) ||
        email.lastName.toLowerCase().includes(search)
      );
    }

    setFilteredEmails(filtered);
  }, [searchTerm, filterSource, emails]);

  const handleDownloadCSV = () => {
    setDownloading(true);
    try {
      // Generate CSV with email, first_name, last_name format
      const csvRows = [
        ['email', 'first_name', 'last_name'].join(','),
        ...filteredEmails.map(entry =>
          [
            `"${entry.email || ''}"`,
            `"${entry.firstName || ''}"`,
            `"${entry.lastName || ''}"`,
          ].join(',')
        ),
      ];
      const csvContent = csvRows.join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all-emails-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV');
    } finally {
      setDownloading(false);
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'free-course':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'application':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'user':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'free-course':
        return 'Free Course';
      case 'application':
        return 'Application';
      case 'user':
        return 'User';
      default:
        return source;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">All Emails</h1>
            <p className="text-gray-400">
              Combined list from all sources • Total: <span className="text-blue-400 font-semibold">{filteredEmails.length}</span> unique emails
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAllEmails}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleDownloadCSV}
              disabled={downloading || filteredEmails.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ffc62d] to-[#ffb700] text-black rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(255,198,45,0.4)] transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Downloading...' : 'Download CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Unique</p>
              <p className="text-3xl font-bold text-white">{emails.length}</p>
            </div>
            <Mail className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Free Course</p>
              <p className="text-3xl font-bold text-white">
                {emails.filter(e => e.source === 'free-course').length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Applications</p>
              <p className="text-3xl font-bold text-white">
                {emails.filter(e => e.source === 'application').length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Users</p>
              <p className="text-3xl font-bold text-white">
                {emails.filter(e => e.source === 'user').length}
              </p>
            </div>
            <Users className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ffc62d] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'free-course', 'application', 'user'] as const).map((source) => (
            <button
              key={source}
              onClick={() => setFilterSource(source)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterSource === source
                  ? 'bg-[#ffc62d] text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {source === 'all' ? 'All' : getSourceLabel(source)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-12 text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading all emails...</p>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-12 text-center">
          <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No emails found</p>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredEmails.map((entry, index) => (
                  <motion.tr
                    key={`${entry.email}-${entry.source}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`mailto:${entry.email}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {entry.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white">{entry.firstName || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white">{entry.lastName || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSourceColor(entry.source)}`}>
                        {getSourceLabel(entry.source)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Format Info */}
      <div className="mt-6 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white mb-1">CSV Format</p>
            <p className="text-xs text-gray-400">
              Downloaded CSV will contain: <span className="text-gray-300 font-mono">email, first_name, last_name</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
