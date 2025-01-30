'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/utils/roleUtils';

interface User {
  id: string;
  email: string;
  firstName: string;
  role: UserRole;
  roles?: string[];
  createdAt: Date;
  subscription?: {
    plan: string;
    currentPeriodEnd: Date;
  };
}

export default function UsersPage() {
  const { isAdmin } = useRole();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  // Only admin should access this page
  if (!isAdmin) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        subscription: doc.data().subscription ? {
          ...doc.data().subscription,
          currentPeriodEnd: doc.data().subscription.currentPeriodEnd?.toDate()
        } : undefined
      })) as User[];
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateUser = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...editForm,
        updatedAt: new Date()
      });
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const toggleRole = (userId: string, role: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const currentRoles = user.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];

    const userRef = doc(db, 'users', userId);
    updateDoc(userRef, { roles: newRoles });
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-400">Manage users and roles</p>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d] w-64"
        />
      </div>

      <div className="bg-[#111111] rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-900/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-white">{user.firstName || 'No name'}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {user.createdAt?.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.subscription ? (
                    <div>
                      <span className="text-sm text-white">{user.subscription.plan}</span>
                      <div className="text-xs text-gray-400">
                        Expires: {user.subscription.currentPeriodEnd?.toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No subscription</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="rounded-lg bg-gray-900 px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]"
                  >
                    <option value="default">Free</option>
                    <option value="ascendant_trader">Ascendant Trader</option>
                    <option value="ascendant_challenger">Ascendant Challenger</option>
                    <option value="ascendant_hero">Ascendant Hero</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-x-2">
                    {['admin', 'moderator'].map((role) => (
                      <button
                        key={role}
                        onClick={() => toggleRole(user.id, role)}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          (user.roles || []).includes(role)
                            ? 'bg-[#ffc62d] text-black'
                            : 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingUser === user.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleUpdateUser(user.id)}
                        className="text-[#ffc62d] hover:text-[#e5b228]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(null);
                          setEditForm({});
                        }}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setEditForm(user);
                      }}
                      className="text-[#ffc62d] hover:text-[#e5b228]"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 