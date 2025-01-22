'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [challengeOrders, setChallengeOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedCollections, setLoadedCollections] = useState(0);
  const [filter, setFilter] = useState<'all' | 'card' | 'crypto'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'regular' | 'challenge'>('regular');

  useEffect(() => {
    let subscriptionsSet = false;
    
    // Regular orders subscription
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoadedCollections(prev => {
        const newCount = prev + 1;
        if (newCount >= 2) setLoading(false);
        return newCount;
      });
    });

    // Challenge orders subscription
    const challengeOrdersQuery = query(
      collection(db, 'challengeOrders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeChallengeOrders = onSnapshot(challengeOrdersQuery, (snapshot) => {
      const challengeOrdersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setChallengeOrders(challengeOrdersData);
      setLoadedCollections(prev => {
        const newCount = prev + 1;
        if (newCount >= 2) setLoading(false);
        return newCount;
      });
    });

    subscriptionsSet = true;

    // Set a timeout to stop loading if collections are empty
    const timeoutId = setTimeout(() => {
      if (subscriptionsSet) {
        setLoading(false);
      }
    }, 2000); // 2 seconds should be enough for initial data to load

    return () => {
      unsubscribeOrders();
      unsubscribeChallengeOrders();
      setLoadedCollections(0);
      clearTimeout(timeoutId);
    };
  }, []);

  const filteredOrders = (activeTab === 'regular' ? orders : challengeOrders).filter((order) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'card' && order.paymentMethod === 'card') ||
      (filter === 'crypto' && order.paymentMethod === 'crypto');

    const matchesSearch =
      searchTerm === '' ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.discordUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        const collection = activeTab === 'regular' ? 'orders' : 'challengeOrders';
        await deleteDoc(doc(db, collection, orderId));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by email, Discord, or order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg bg-[#111111] border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('regular')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'regular'
                  ? 'bg-[#ffc62d] text-black'
                  : 'bg-[#111111] text-white hover:bg-gray-800'
              }`}
            >
              Regular Orders
            </button>
            <button
              onClick={() => setActiveTab('challenge')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'challenge'
                  ? 'bg-[#ffc62d] text-black'
                  : 'bg-[#111111] text-white hover:bg-gray-800'
              }`}
            >
              Challenge Orders
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-[#ffc62d] text-black'
                  : 'bg-[#111111] text-white hover:bg-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('card')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'card'
                  ? 'bg-[#ffc62d] text-black'
                  : 'bg-[#111111] text-white hover:bg-gray-800'
              }`}
            >
              Card
            </button>
            <button
              onClick={() => setFilter('crypto')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'crypto'
                  ? 'bg-[#ffc62d] text-black'
                  : 'bg-[#111111] text-white hover:bg-gray-800'
              }`}
            >
              Crypto
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Order ID</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Date</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Customer</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Discord</th>
              {activeTab === 'challenge' ? (
                <>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Challenge Type</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Account Size</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Platform</th>
                </>
              ) : (
                <>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Plan</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Duration</th>
                </>
              )}
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Amount</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Payment</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[#111111]">
                <td className="py-4 px-6 text-sm">
                  <span className="font-mono text-gray-400">{order.id}</span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">
                  {activeTab === 'challenge' 
                    ? order.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'
                    : order.timestamp?.toDate().toLocaleDateString() || 'N/A'
                  }
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {order.firstName} {order.lastName}
                    </div>
                    <div className="text-sm text-gray-400">{order.email}</div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">
                  {order.discordUsername}
                </td>
                {activeTab === 'challenge' ? (
                  <>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      {order.challengeType}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      {order.challengeAmount}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      {order.platform}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-white">
                        {order.plan}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      {order.duration}
                    </td>
                  </>
                )}
                <td className="py-4 px-6 text-sm font-medium text-white">
                  ${order.amount}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.paymentMethod === 'crypto'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.paymentMethod === 'crypto' 
                      ? `${order.cryptoType || 'Crypto'}`
                      : 'Card'
                    }
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-500 hover:text-red-400 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 