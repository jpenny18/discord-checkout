'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Application {
  id: string;
  answers: { [key: number]: string };
  score: number;
  status: 'qualified' | 'review' | 'accepted' | 'rejected';
  timestamp: string;
  bookedCall?: { date: string; time: string };
}

type FilterType = 'all' | Application['status'];
type DetailTab = 'profile' | 'trading' | 'goals';

const STATUS_BADGE: Record<string, string> = {
  qualified: 'bg-green-500/10 text-green-400 border border-green-500/20',
  review: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  accepted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const SCORE_COLOR = (s: number) =>
  s >= 70 ? 'text-green-400' : s >= 45 ? 'text-yellow-400' : 'text-red-400';

const SCORE_BAR = (s: number) =>
  s >= 70 ? 'bg-green-500' : s >= 45 ? 'bg-yellow-500' : 'bg-red-500';

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

// ─── Delete Confirm Modal ────────────────────────────────────────────────────
function ConfirmModal({
  title,
  description,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-gray-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white text-center mb-1">{title}</h3>
        <p className="text-gray-400 text-sm text-center mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-[#1a1a1a] border border-gray-700 text-gray-300 rounded-xl hover:bg-[#222] transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<DetailTab>('profile');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'applications'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const apps = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Application[];
          setApplications(apps);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching applications:', error);
          toast.error('Failed to load applications');
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up applications listener:', error);
      toast.error('Failed to initialize applications');
      setLoading(false);
    }
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesFilter = filter === 'all' || app.status === filter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        app.answers[1]?.toLowerCase().includes(q) ||
        app.answers[2]?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [applications, filter, search]);

  const counts = useMemo(
    () => ({
      all: applications.length,
      qualified: applications.filter((a) => a.status === 'qualified').length,
      review: applications.filter((a) => a.status === 'review').length,
      accepted: applications.filter((a) => a.status === 'accepted').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
    }),
    [applications]
  );

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), { status: newStatus });
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
      toast.success('Status updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'applications', id));
      if (selectedApplication?.id === id) setSelectedApplication(null);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDeleteTarget(null);
      toast.success('Application deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete application');
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.size;
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((id) => batch.delete(doc(db, 'applications', id)));
      await batch.commit();
      if (selectedApplication && selectedIds.has(selectedApplication.id)) {
        setSelectedApplication(null);
      }
      setSelectedIds(new Set());
      setBulkDeleteConfirm(false);
      toast.success(`${count} application${count !== 1 ? 's' : ''} deleted`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete applications');
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApplications.length && filteredApplications.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApplications.map((a) => a.id)));
    }
  };

  const allSelected =
    filteredApplications.length > 0 && selectedIds.size === filteredApplications.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-2 border-[#ffc62d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold">Applications</h1>
            <p className="text-gray-400 text-sm mt-0.5">{applications.length} total submissions</p>
          </div>
          {/* Status chips */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: 'all', label: 'All', count: counts.all, color: 'text-white' },
                { key: 'qualified', label: 'Qualified', count: counts.qualified, color: 'text-green-400' },
                { key: 'review', label: 'Review', count: counts.review, color: 'text-yellow-400' },
                { key: 'accepted', label: 'Accepted', count: counts.accepted, color: 'text-blue-400' },
                { key: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-red-400' },
              ] as const
            ).map(({ key, label, count, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                  filter === key
                    ? 'bg-[#ffc62d] text-black border-[#ffc62d]'
                    : `bg-[#111111] border-gray-800 hover:border-gray-600 ${color}`
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs ${filter === key ? 'opacity-70' : 'opacity-50'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc62d]/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-3 mb-4 bg-[#1a1a1a] border border-[#ffc62d]/30 rounded-xl">
          <span className="text-sm text-gray-300">
            <span className="text-[#ffc62d] font-semibold">{selectedIds.size}</span> selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-[#111] border border-gray-700 rounded-lg transition-colors"
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete selected
            </button>
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid xl:grid-cols-[400px_1fr] gap-6 items-start">
        {/* ── Left: Application List ── */}
        <div className="space-y-2">
          {/* Select-all row */}
          {filteredApplications.length > 0 && (
            <div className="flex items-center gap-2 px-1 pb-1">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded accent-[#ffc62d] cursor-pointer"
              />
              <span className="text-xs text-gray-500">
                {filteredApplications.length} result{filteredApplications.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {filteredApplications.map((app) => {
            const isSelected = selectedApplication?.id === app.id;
            const isChecked = selectedIds.has(app.id);
            const initials = getInitials(app.answers[1]);

            return (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedApplication(app);
                  setActiveTab('profile');
                }}
                className={`group relative flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#1a1500] border-[#ffc62d]/60 shadow-[0_0_20px_rgba(255,198,45,0.08)]'
                    : 'bg-[#111111] border-gray-800 hover:border-gray-600 hover:bg-[#161616]'
                }`}
              >
                {/* Checkbox */}
                <div
                  className="mt-0.5 flex-shrink-0"
                  onClick={(e) => toggleSelect(app.id, e)}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="w-4 h-4 rounded accent-[#ffc62d] cursor-pointer"
                  />
                </div>

                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isSelected ? 'bg-[#ffc62d] text-black' : 'bg-[#222] text-[#ffc62d]'
                  }`}
                >
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-white text-sm truncate">{app.answers[1]}</p>
                    <span
                      className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mb-2">{app.answers[2]}</p>

                  {/* Score bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${SCORE_BAR(app.score)}`}
                        style={{ width: `${Math.round(app.score)}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-semibold ${SCORE_COLOR(app.score)}`}>
                      {Math.round(app.score)}%
                    </span>
                    {app.bookedCall && (
                      <span className="text-[10px] text-[#ffc62d] font-medium bg-[#ffc62d]/10 px-1.5 py-0.5 rounded">
                        📅 Booked
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-600 mt-1.5">
                    {format(new Date(app.timestamp), 'MMM d, yyyy · h:mm a')}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(app.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}

          {filteredApplications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-[#111111] border border-gray-800 rounded-xl text-center">
              <svg className="w-10 h-10 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-sm">No applications found</p>
              {search && (
                <button onClick={() => setSearch('')} className="mt-2 text-xs text-[#ffc62d] hover:underline">
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Detail Panel ── */}
        {selectedApplication ? (
          <div className="sticky top-8 bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
            {/* Detail header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-800 bg-[#0d0d0d]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#ffc62d]/10 border border-[#ffc62d]/20 flex items-center justify-center text-lg font-bold text-[#ffc62d] flex-shrink-0">
                  {getInitials(selectedApplication.answers[1])}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white truncate">{selectedApplication.answers[1]}</h2>
                  <p className="text-gray-400 text-sm truncate">{selectedApplication.answers[2]}</p>
                  <p className="text-gray-500 text-sm">{selectedApplication.answers[3]}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold capitalize px-2.5 py-1 rounded-full ${STATUS_BADGE[selectedApplication.status]}`}>
                    {selectedApplication.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${SCORE_BAR(selectedApplication.score)}`}
                        style={{ width: `${Math.round(selectedApplication.score)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${SCORE_COLOR(selectedApplication.score)}`}>
                      {Math.round(selectedApplication.score)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4">
                {(['profile', 'trading', 'goals'] as DetailTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-[#ffc62d] text-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5">
              {activeTab === 'profile' && (
                <>
                  {/* Booked Call */}
                  {selectedApplication.bookedCall && (
                    <div className="flex items-start gap-3 p-4 bg-[#ffc62d]/5 border border-[#ffc62d]/25 rounded-xl">
                      <div className="w-8 h-8 bg-[#ffc62d]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[#ffc62d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#ffc62d] text-xs font-semibold mb-0.5">Strategy Call Booked</p>
                        <p className="text-white text-sm font-medium">
                          {new Date(selectedApplication.bookedCall.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {selectedApplication.bookedCall.time} CST · with Penny Pips
                        </p>
                      </div>
                    </div>
                  )}

                  <InfoRow label="Submitted" value={format(new Date(selectedApplication.timestamp), 'MMMM d, yyyy · h:mm a')} />
                  <InfoRow label="Investment Readiness" value={selectedApplication.answers[11]} />
                  <InfoRow label="Contact Consent" value={selectedApplication.answers[12] ? 'Yes' : 'No'} />
                </>
              )}

              {activeTab === 'trading' && (
                <>
                  <InfoRow label="Trading Experience" value={selectedApplication.answers[4]} />
                  <InfoRow label="Monthly Trading Profit" value={selectedApplication.answers[5]} />
                  <InfoRow label="Daily Time Commitment" value={selectedApplication.answers[6]} />
                  <InfoRow label="Trading Capital" value={selectedApplication.answers[9]} />
                </>
              )}

              {activeTab === 'goals' && (
                <>
                  <InfoBlock label="Why they want to trade professionally" value={selectedApplication.answers[7]} />
                  <InfoBlock label="Current trading strategies" value={selectedApplication.answers[8]} />
                  <InfoBlock label="Biggest challenges" value={selectedApplication.answers[10]} />
                </>
              )}
            </div>

            {/* Action footer */}
            <div className="px-6 py-4 border-t border-gray-800 bg-[#0d0d0d]">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => handleStatusUpdate(selectedApplication.id, 'accepted')}
                  className="flex-1 py-2.5 bg-[#ffc62d] text-black text-sm font-semibold rounded-xl hover:bg-[#ffd700] transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                  className="flex-1 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-semibold rounded-xl hover:bg-red-500/20 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApplication.id, 'review')}
                  className="flex-1 py-2.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm font-semibold rounded-xl hover:bg-yellow-500/20 transition-colors"
                >
                  Review
                </button>
              </div>
              <button
                onClick={() => setDeleteTarget(selectedApplication.id)}
                className="w-full py-2 text-xs font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete application
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden xl:flex sticky top-8 flex-col items-center justify-center h-64 bg-[#111111] border border-gray-800 rounded-2xl">
            <svg className="w-10 h-10 text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-gray-400 text-sm">Select an application to view details</p>
          </div>
        )}
      </div>

      {/* ── Delete single confirm modal ── */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Application?"
          description="This action cannot be undone. The application will be permanently removed."
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Bulk delete confirm modal ── */}
      {bulkDeleteConfirm && (
        <ConfirmModal
          title={`Delete ${selectedIds.size} Application${selectedIds.size !== 1 ? 's' : ''}?`}
          description="This action cannot be undone. All selected applications will be permanently removed."
          onConfirm={handleBulkDelete}
          onCancel={() => setBulkDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

// ─── Small reusable detail components ───────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-800/60 last:border-0">
      <span className="text-xs text-gray-500 font-medium flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-200 text-right">{value || '—'}</span>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="py-3 border-b border-gray-800/60 last:border-0">
      <p className="text-xs text-gray-500 font-medium mb-2">{label}</p>
      <p className="text-sm text-gray-200 leading-relaxed">{value || '—'}</p>
    </div>
  );
}
