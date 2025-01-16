'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { useRouter } from 'next/navigation';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

interface OrderData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  discordUsername: string;
  amount: number;
  paymentMethodId?: string;
  stripePaymentIntentId?: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  paymentMethod: string;
  selectedPlan: {
    name: string;
  } | null;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          selectedPlan: data.selectedPlan || { name: 'N/A' }
        } as OrderData;
      });

      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
      try {
        await Promise.all(
          selectedOrders.map((orderId) => deleteDoc(doc(db, 'orders', orderId)))
        );
        setSelectedOrders([]);
      } catch (error) {
        console.error('Error deleting orders:', error);
        alert('Failed to delete some orders');
      }
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    setSelectedOrders(prev => 
      prev.length === orders.length ? [] : orders.map(order => order.id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc62d]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {selectedOrders.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Delete Selected ({selectedOrders.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={toggleAllOrders}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Time</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Discord</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Plan</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-900">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  {order.timestamp instanceof Date
                    ? order.timestamp.toLocaleDateString()
                    : 'Invalid Date'}
                </td>
                <td className="p-4">
                  {order.timestamp instanceof Date
                    ? order.timestamp.toLocaleTimeString()
                    : 'Invalid Time'}
                </td>
                <td className="p-4">
                  {order.firstName} {order.lastName}
                </td>
                <td className="p-4">{order.discordUsername}</td>
                <td className="p-4">{order.email}</td>
                <td className="p-4">{order.selectedPlan?.name || 'N/A'}</td>
                <td className="p-4">${order.amount}</td>
                <td className="p-4">{order.paymentMethod}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.status === 'completed'
                        ? 'bg-green-500'
                        : order.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
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