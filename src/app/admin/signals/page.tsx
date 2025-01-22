'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Signal {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  risk: string;
  analysis: string;
  timestamp: Date;
  status: 'active' | 'closed' | 'cancelled';
  result?: 'win' | 'loss';
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSignal, setNewSignal] = useState<Partial<Signal>>({
    type: 'long',
    status: 'active'
  });
  const [editingSignal, setEditingSignal] = useState<string | null>(null);
  const [deletingSignals, setDeletingSignals] = useState<Set<string>>(new Set());

  useEffect(() => {
    const signalsQuery = query(
      collection(db, 'signals'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(signalsQuery, (snapshot) => {
      const signalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Signal[];
      setSignals(signalsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSignal) {
        const signalRef = doc(db, 'signals', editingSignal);
        await updateDoc(signalRef, {
          ...newSignal,
          timestamp: new Date()
        });
      } else {
        await addDoc(collection(db, 'signals'), {
          ...newSignal,
          timestamp: new Date()
        });
      }
      setNewSignal({ type: 'long', status: 'active' });
      setEditingSignal(null);
    } catch (error) {
      console.error('Error saving signal:', error);
    }
  };

  const handleDelete = async (signalId: string) => {
    try {
      setDeletingSignals(prev => new Set(Array.from(prev).concat(signalId)));
      await deleteDoc(doc(db, 'signals', signalId));
    } catch (error) {
      console.error('Error deleting signal:', error);
    } finally {
      setDeletingSignals(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(signalId);
        return newSet;
      });
    }
  };

  const toggleResult = async (signalId: string, currentResult?: 'win' | 'loss') => {
    try {
      const signalRef = doc(db, 'signals', signalId);
      const newResult = currentResult === 'win' ? 'loss' : 'win';
      await updateDoc(signalRef, {
        result: newResult,
        status: 'closed'
      });
    } catch (error) {
      console.error('Error updating signal result:', error);
    }
  };

  const handleEdit = (signal: Signal) => {
    setEditingSignal(signal.id);
    setNewSignal(signal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSignal(prev => ({
      ...prev,
      [name]: name.includes('take') || name.includes('entry') || name.includes('stop') 
        ? parseFloat(value) 
        : value
    }));
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
        <h1 className="text-2xl font-bold text-white">Trade Signals</h1>
        <p className="text-gray-400">Create and manage trade signals for users</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={newSignal.symbol || ''}
              onChange={handleInputChange}
              placeholder="BTC/USDT"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              name="type"
              value={newSignal.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
            <input
              type="number"
              name="entry"
              value={newSignal.entry || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss</label>
            <input
              type="number"
              name="stopLoss"
              value={newSignal.stopLoss || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit 1</label>
            <input
              type="number"
              name="takeProfit1"
              value={newSignal.takeProfit1 || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit 2</label>
            <input
              type="number"
              name="takeProfit2"
              value={newSignal.takeProfit2 || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit 3</label>
            <input
              type="number"
              name="takeProfit3"
              value={newSignal.takeProfit3 || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Risk</label>
            <select
              name="risk"
              value={newSignal.risk || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            >
              <option value="">Select Risk Level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Analysis</label>
          <textarea
            name="analysis"
            value={newSignal.analysis || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            required
          />
        </div>

        <div className="flex justify-end">
          {editingSignal && (
            <button
              type="button"
              onClick={() => {
                setEditingSignal(null);
                setNewSignal({ type: 'long', status: 'active' });
              }}
              className="mr-4 px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-[#ffc62d] text-black rounded-lg font-medium hover:bg-[#e6b229]"
          >
            {editingSignal ? 'Update Signal' : 'Create Signal'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Recent Signals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal) => (
            <div
              key={signal.id}
              className="bg-[#111111] p-6 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{signal.symbol}</h3>
                  <p className="text-sm text-gray-400">
                    {signal.type.toUpperCase()} @ {signal.entry}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleResult(signal.id, signal.result)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      signal.status === 'active'
                        ? 'bg-green-900 text-green-200'
                        : signal.result === 'win'
                        ? 'bg-[#ffc62d] text-black'
                        : signal.result === 'loss'
                        ? 'bg-red-900 text-red-200'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {signal.result ? signal.result.toUpperCase() : signal.status.toUpperCase()}
                  </button>
                  <button
                    onClick={() => handleDelete(signal.id)}
                    disabled={deletingSignals.has(signal.id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      deletingSignals.has(signal.id)
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : 'bg-red-900 text-red-200 hover:bg-red-800'
                    }`}
                  >
                    {deletingSignals.has(signal.id) ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Stop Loss:</span> {signal.stopLoss}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Take Profit:</span> {signal.takeProfit1} / {signal.takeProfit2} / {signal.takeProfit3}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Risk:</span> {signal.risk}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Analysis:</span> {signal.analysis}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  {signal.timestamp.toLocaleDateString()} at {signal.timestamp.toLocaleTimeString()}
                </div>
                <button
                  onClick={() => handleEdit(signal)}
                  className="text-xs text-[#ffc62d] hover:text-[#e6b229]"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 