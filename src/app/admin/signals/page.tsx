'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Alert {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  tradeType: 'scalp' | 'swing';
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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    type: 'long',
    tradeType: 'scalp',
    status: 'active'
  });
  const [editingAlert, setEditingAlert] = useState<string | null>(null);
  const [deletingAlerts, setDeletingAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const alertsQuery = query(
      collection(db, 'signals'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const alertsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Alert[];
      setAlerts(alertsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAlert) {
        const alertRef = doc(db, 'signals', editingAlert);
        await updateDoc(alertRef, {
          ...newAlert,
          timestamp: new Date()
        });
      } else {
        await addDoc(collection(db, 'signals'), {
          ...newAlert,
          timestamp: new Date()
        });
      }
      setNewAlert({ type: 'long', tradeType: 'scalp', status: 'active' });
      setEditingAlert(null);
    } catch (error) {
      console.error('Error saving alert:', error);
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      setDeletingAlerts(prev => new Set(Array.from(prev).concat(alertId)));
      await deleteDoc(doc(db, 'signals', alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
    } finally {
      setDeletingAlerts(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const toggleResult = async (alertId: string, currentResult?: 'win' | 'loss') => {
    try {
      const alertRef = doc(db, 'signals', alertId);
      const newResult = currentResult === 'win' ? 'loss' : 'win';
      await updateDoc(alertRef, {
        result: newResult,
        status: 'closed'
      });
    } catch (error) {
      console.error('Error updating alert result:', error);
    }
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert.id);
    setNewAlert(alert);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({
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
        <h1 className="text-2xl font-bold text-white">Trade Alerts</h1>
        <p className="text-gray-400">Create and manage trade alerts for users</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={newAlert.symbol || ''}
              onChange={handleInputChange}
              placeholder="BTC/USDT"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              name="type"
              value={newAlert.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trade Type</label>
            <select
              name="tradeType"
              value={newAlert.tradeType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            >
              <option value="scalp">Scalp</option>
              <option value="swing">Swing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
            <input
              type="number"
              name="entry"
              value={newAlert.entry || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss</label>
            <input
              type="number"
              name="stopLoss"
              value={newAlert.stopLoss || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit 1</label>
            <input
              type="number"
              name="takeProfit1"
              value={newAlert.takeProfit1 || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit 2</label>
            <input
              type="number"
              name="takeProfit2"
              value={newAlert.takeProfit2 || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit 3</label>
            <input
              type="number"
              name="takeProfit3"
              value={newAlert.takeProfit3 || ''}
              onChange={handleInputChange}
              step="0.00000001"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Risk</label>
            <select
              name="risk"
              value={newAlert.risk || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
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
            value={newAlert.analysis || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
          />
        </div>

        <div className="flex justify-end">
          {editingAlert && (
            <button
              type="button"
              onClick={() => {
                setEditingAlert(null);
                setNewAlert({ type: 'long', tradeType: 'scalp', status: 'active' });
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
            {editingAlert ? 'Update Alert' : 'Create Alert'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#111111] p-6 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{alert.symbol}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{alert.type.toUpperCase()} @ {alert.entry}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-800 text-xs">
                      {alert.tradeType}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleResult(alert.id, alert.result)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.status === 'active'
                        ? 'bg-green-900 text-green-200'
                        : alert.result === 'win'
                        ? 'bg-[#ffc62d] text-black'
                        : alert.result === 'loss'
                        ? 'bg-red-900 text-red-200'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {alert.result ? alert.result.toUpperCase() : alert.status.toUpperCase()}
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    disabled={deletingAlerts.has(alert.id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      deletingAlerts.has(alert.id)
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : 'bg-red-900 text-red-200 hover:bg-red-800'
                    }`}
                  >
                    {deletingAlerts.has(alert.id) ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Stop Loss:</span> {alert.stopLoss}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Take Profit:</span> {alert.takeProfit1} / {alert.takeProfit2} / {alert.takeProfit3}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Risk:</span> {alert.risk}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Analysis:</span> {alert.analysis}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  {alert.timestamp.toLocaleDateString()} at {alert.timestamp.toLocaleTimeString()}
                </div>
                <button
                  onClick={() => handleEdit(alert)}
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