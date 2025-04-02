'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
}

interface TradingAccount {
  id: string;
  user_id: string;
  mt_login: string;
  mt_password: string;
  meta_api_token: string;
  account_id: string;
  challenge_type: string;
  account_balance: number;
  status: 'in_progress' | 'passed' | 'failed';
  created_at: string;
}

interface FormData {
  mt_login: string;
  mt_password: string;
  meta_api_token: string;
  account_id: string;
  user_id: string;
  challenge_type: string;
  account_balance: string;
  status: 'in_progress' | 'passed' | 'failed';
}

const CHALLENGE_TYPES = {
  ascendant: {
    name: 'Ascendant',
    balances: [10000, 25000, 50000, 100000, 200000]
  },
  gauntlet: {
    name: 'Gauntlet',
    balances: [5000, 10000, 25000, 50000, 100000]
  },
  standard: {
    name: 'Standard',
    balances: [5000, 10000, 25000, 50000]
  }
} as const;

export default function TradingAccountsPage() {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [selectedType, setSelectedType] = useState<keyof typeof CHALLENGE_TYPES | ''>('');
  const [formData, setFormData] = useState<FormData>({
    mt_login: '',
    mt_password: '',
    meta_api_token: '',
    account_id: '',
    user_id: '',
    challenge_type: '',
    account_balance: '',
    status: 'in_progress'
  });

  useEffect(() => {
    fetchAccounts();
    fetchUsers();
  }, []);

  const fetchAccounts = async () => {
    try {
      const accountsRef = collection(db, 'trading_accounts');
      const snapshot = await getDocs(accountsRef);
      const accountsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TradingAccount[];
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const accountsRef = collection(db, 'trading_accounts');
      await addDoc(accountsRef, {
        ...formData,
        account_balance: Number(formData.account_balance),
        created_at: new Date().toISOString()
      });
      toast.success('Account added successfully');
      setIsAddingAccount(false);
      setFormData({
        mt_login: '',
        mt_password: '',
        meta_api_token: '',
        account_id: '',
        user_id: '',
        challenge_type: '',
        account_balance: '',
        status: 'in_progress'
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
      toast.error('Failed to add account');
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await deleteDoc(doc(db, 'trading_accounts', id));
      toast.success('Account deleted successfully');
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: TradingAccount['status']) => {
    try {
      await updateDoc(doc(db, 'trading_accounts', id), {
        status: newStatus
      });
      toast.success('Status updated successfully');
      fetchAccounts();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Trading Accounts</h1>
        <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
          <DialogTrigger asChild>
            <Button>Add New Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Trading Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <Label>MT4/MT5 Login</Label>
                <Input
                  value={formData.mt_login}
                  onChange={(e) => setFormData({...formData, mt_login: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>MT4/MT5 Password</Label>
                <Input
                  type="password"
                  value={formData.mt_password}
                  onChange={(e) => setFormData({...formData, mt_password: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>META API Token</Label>
                <Input
                  value={formData.meta_api_token}
                  onChange={(e) => setFormData({...formData, meta_api_token: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Account ID (META ID)</Label>
                <Input
                  value={formData.account_id}
                  onChange={(e) => setFormData({...formData, account_id: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>User</Label>
                <Select 
                  value={formData.user_id} 
                  onValueChange={(value) => setFormData({...formData, user_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email} - {user.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Challenge Type</Label>
                <Select 
                  value={formData.challenge_type}
                  onValueChange={(value) => {
                    setSelectedType(value as keyof typeof CHALLENGE_TYPES);
                    setFormData({...formData, challenge_type: value, account_balance: ''});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select challenge type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CHALLENGE_TYPES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedType && (
                <div>
                  <Label>Account Balance</Label>
                  <Select
                    value={formData.account_balance}
                    onValueChange={(value) => setFormData({...formData, account_balance: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select balance" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHALLENGE_TYPES[selectedType].balances.map((balance) => (
                        <SelectItem key={balance} value={balance.toString()}>
                          ${balance.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full">Add Account</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Challenge Type</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => {
            const user = users.find(u => u.id === account.user_id);
            return (
              <TableRow key={account.id}>
                <TableCell>{user ? `${user.email} (${user.firstName})` : 'Unknown'}</TableCell>
                <TableCell>{account.challenge_type}</TableCell>
                <TableCell>${account.account_balance.toLocaleString()}</TableCell>
                <TableCell>
                  <Select
                    value={account.status}
                    onValueChange={(value) => handleUpdateStatus(account.id, value as TradingAccount['status'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 