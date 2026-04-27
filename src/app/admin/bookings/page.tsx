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

interface Booking {
  id: string;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  timestamp: string;
}

const STATUS_STYLES: Record<Booking['status'], string> = {
  scheduled: 'bg-green-500/10 text-green-400 border-green-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

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
export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Booking['status']>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('date', 'asc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Booking[];
          setBookings(data);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching bookings:', error);
          toast.error('Failed to load bookings');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up bookings listener:', error);
      toast.error('Failed to initialize bookings');
      setLoading(false);
    }
  }, []);

  const filteredBookings = useMemo(
    () => bookings.filter((b) => filter === 'all' || b.status === filter),
    [bookings, filter]
  );

  const counts = useMemo(
    () => ({
      all: bookings.length,
      scheduled: bookings.filter((b) => b.status === 'scheduled').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }),
    [bookings]
  );

  const allSelected =
    filteredBookings.length > 0 && selectedIds.size === filteredBookings.length;

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus });
      toast.success('Booking updated');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDeleteTarget(null);
      toast.success('Booking deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete booking');
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.size;
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((id) => batch.delete(doc(db, 'bookings', id)));
      await batch.commit();
      setSelectedIds(new Set());
      setBulkDeleteConfirm(false);
      toast.success(`${count} booking${count !== 1 ? 's' : ''} deleted`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete bookings');
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
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredBookings.map((b) => b.id)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-[#ffc62d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Strategy Calls</h1>
          <p className="text-gray-400 text-sm mt-1">Personal calls booked directly with Penny Pips</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl capitalize text-sm font-medium transition-all border ${
                filter === status
                  ? 'bg-[#ffc62d] text-black border-[#ffc62d]'
                  : 'bg-[#111111] border-gray-800 text-gray-300 hover:border-gray-600'
              }`}
            >
              {status}
              <span className={`ml-1.5 text-xs ${filter === status ? 'opacity-70' : 'opacity-50'}`}>
                ({counts[status]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{counts.scheduled}</p>
          <p className="text-gray-400 text-sm mt-1">Upcoming</p>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{counts.completed}</p>
          <p className="text-gray-400 text-sm mt-1">Completed</p>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{counts.cancelled}</p>
          <p className="text-gray-400 text-sm mt-1">Cancelled</p>
        </div>
      </div>

      {/* Bulk action bar */}
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

      {/* Select-all row */}
      {filteredBookings.length > 0 && (
        <div className="flex items-center gap-2 px-1 pb-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded accent-[#ffc62d] cursor-pointer"
          />
          <span className="text-xs text-gray-500">
            {filteredBookings.length} result{filteredBookings.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-[#111111] border border-gray-800 rounded-xl">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="group bg-[#111111] border border-gray-800 rounded-xl p-5 flex items-center gap-4 hover:border-gray-700 transition-colors"
            >
              {/* Checkbox */}
              <div onClick={(e) => toggleSelect(booking.id, e)} className="flex-shrink-0">
                <input
                  type="checkbox"
                  checked={selectedIds.has(booking.id)}
                  readOnly
                  className="w-4 h-4 rounded accent-[#ffc62d] cursor-pointer"
                />
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#ffc62d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{booking.applicantName}</p>
                  <p className="text-gray-400 text-xs truncate">{booking.applicantEmail}</p>
                  <p className="text-gray-500 text-xs">{booking.applicantPhone}</p>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs mb-1">
                    <svg className="w-3.5 h-3.5 text-[#ffc62d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300 font-medium truncate">
                      {format(new Date(booking.date), 'EEE, MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <svg className="w-3.5 h-3.5 text-[#ffc62d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">{booking.time} CST</span>
                  </div>
                </div>
              </div>

              {/* Status + Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-[10px] font-semibold capitalize px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status]}`}
                >
                  {booking.status}
                </span>

                {booking.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'completed')}
                      className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 text-xs font-medium transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === 'cancelled' && (
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'scheduled')}
                    className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 text-xs font-medium transition-colors"
                  >
                    Reinstate
                  </button>
                )}

                {/* Delete button */}
                <button
                  onClick={() => setDeleteTarget(booking.id)}
                  className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete single confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Booking?"
          description="This action cannot be undone. The booking will be permanently removed."
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Bulk delete confirm */}
      {bulkDeleteConfirm && (
        <ConfirmModal
          title={`Delete ${selectedIds.size} Booking${selectedIds.size !== 1 ? 's' : ''}?`}
          description="This action cannot be undone. All selected bookings will be permanently removed."
          onConfirm={handleBulkDelete}
          onCancel={() => setBulkDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
