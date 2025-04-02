'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef, Row } from '@tanstack/react-table';
import type { ArenaEntry } from '@/types/index';
import { AlertCircle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function TradingArenasPage() {
  const [entries, setEntries] = useState<ArenaEntry[]>([]);
  const [arenaEntries, setArenaEntries] = useState<ArenaEntry[]>([]);
  const [trialEntries, setTrialEntries] = useState<ArenaEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Define columns based on the entry type
  const allColumns: ColumnDef<ArenaEntry>[] = useMemo(() => [
    {
      accessorKey: 'timestamp',
      header: 'Date',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const timestamp = row.getValue('timestamp') as { toDate: () => Date };
        return timestamp && typeof timestamp.toDate === 'function' 
          ? format(timestamp.toDate(), 'MMM d, yyyy HH:mm')
          : 'Unknown date';
      },
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const firstName = row.getValue('firstName') as string;
        const lastName = row.getValue('lastName') as string;
        // Show full name on mobile for better display
        return (
          <div>
            <span className="md:hidden">{`${firstName} ${lastName}`}</span>
            <span className="hidden md:block">{firstName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const lastName = row.getValue('lastName') as string;
        return <span className="hidden md:block">{lastName}</span>;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const email = row.getValue('email') as string;
        return (
          <a 
            href={`mailto:${email}`}
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {email}
          </a>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      // Hide on mobile to save space
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const phone = row.getValue('phone') as string;
        return <span className="hidden md:block">{phone || '-'}</span>;
      },
    },
    {
      accessorKey: 'selectedType',
      header: 'Type',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const type = row.getValue('selectedType') as string;
        return (
          <Badge variant={type === 'arena' ? 'destructive' : 'secondary'} className="font-medium">
            {type === 'arena' ? 'Arena' : 'Trial'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'accountSize',
      header: 'Account Size',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const type = row.getValue('selectedType') as string;
        const accountSize = row.getValue('accountSize') as string | undefined;
        
        // In trial tab, we don't need to check type since we're already filtered
        if (accountSize) {
          return (
            <Badge variant="outline" className="bg-gray-800 font-medium">
              {accountSize.toUpperCase()}
            </Badge>
          );
        }
        // Only show "Not specified" if it's a trial entry without account size
        return type === 'trial' ? 'Not specified' : '-';
      },
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const platform = row.getValue('platform') as string;
        return (
          <Badge variant="outline" className="bg-black font-medium">
            {platform}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const amount = row.getValue('amount') as number;
        return (
          <span className="font-medium text-[#ffc62d]">
            {formatCurrency(amount)}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: Row<ArenaEntry> }) => {
        const status = row.getValue('status') as string;
        
        if (status === 'completed') {
          return (
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">Completed</span>
            </div>
          );
        } else if (status === 'pending') {
          return (
            <div className="flex items-center gap-1 text-yellow-500">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Pending</span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Failed</span>
            </div>
          );
        }
      },
    },
  ], []);

  // Select specific columns for specific tabs
  const trialColumns = useMemo(() => 
    allColumns.filter(col => {
      // Use 'in' operator to check if property exists (TypeScript safe)
      return !('accessorKey' in col && col.accessorKey === 'selectedType');
    }), [allColumns]
  );

  const arenaColumns = useMemo(() => 
    allColumns.filter(col => {
      // Use 'in' operator to check if property exists (TypeScript safe)
      return !('accessorKey' in col && (
        col.accessorKey === 'selectedType' || 
        col.accessorKey === 'accountSize'
      ));
    }), [allColumns]
  );

  const refreshData = () => {
    setRefreshing(true);
    // This will re-trigger the useEffect since we call setIsLoading(true)
    setIsLoading(true);
    // Reset after visual feedback
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    try {
      if (!db) {
        setError('Firebase database not properly initialized');
        setIsLoading(false);
        return () => {};
      }

      const arenaEntriesRef = collection(db, 'arenaEntries');
      const q = query(
        arenaEntriesRef,
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newEntries = snapshot.docs.map(doc => {
          const data = doc.data();
          const timestamp = data.timestamp || Timestamp.now();
          
          return {
            id: doc.id,
            ...data,
            timestamp
          };
        }) as ArenaEntry[];

        setEntries(newEntries);
        setArenaEntries(newEntries.filter(entry => entry.selectedType === 'arena'));
        setTrialEntries(newEntries.filter(entry => entry.selectedType === 'trial'));
        setIsLoading(false);
        setError(null);
      }, (error) => {
        console.error('Firebase error:', error);
        setError(`Error fetching data: ${error.message}`);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Firebase setup error:', error);
      setError(`Firebase setup error: ${errorMessage}`);
      setIsLoading(false);
      return () => {};
    }
  }, [isLoading]);

  return (
    <div className="p-4 md:p-6 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Arenas</h1>
          <p className="text-gray-400 text-sm mt-1">Manage trial and arena entries</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#8B0000]" />
              <span className="text-sm">Arena Entries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-500" />
              <span className="text-sm">Trial Entries</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading data</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      <Card className="bg-gray-900 border-gray-800 shadow-xl overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="mb-4 bg-gray-800 p-1 rounded-lg">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white rounded-md transition-all"
              >
                All Entries ({entries.length})
              </TabsTrigger>
              <TabsTrigger 
                value="arena"
                className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white rounded-md transition-all"
              >
                Arena ({arenaEntries.length})
              </TabsTrigger>
              <TabsTrigger 
                value="trial"
                className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white rounded-md transition-all"
              >
                Trial ({trialEntries.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0 p-0 md:p-4">
            <DataTable
              columns={allColumns}
              data={entries}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="arena" className="m-0 p-0 md:p-4">
            <DataTable
              columns={arenaColumns}
              data={arenaEntries}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="trial" className="m-0 p-0 md:p-4">
            <DataTable
              columns={trialColumns}
              data={trialEntries}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 