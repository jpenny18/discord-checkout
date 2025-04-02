'use client';

import React, { useEffect, useState } from 'react';
import { getMetaApiConnection } from '@/lib/metaapi';
import { Badge } from '@/components/badge';

interface ConnectionError {
  message: string;
  code?: string;
  name?: string;
}

export default function ConnectionStatus() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ConnectionError | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connection = await getMetaApiConnection();
        if (connection) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (err) {
        setStatus('error');
        setError({
          message: err instanceof Error ? err.message : 'Unknown error occurred',
          ...(err instanceof Error && { name: err.name }),
        });
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (loading) {
    return <Badge variant="secondary">Connecting...</Badge>;
  }

  return (
    <Badge
      variant={
        status === 'connected'
          ? 'success'
          : status === 'error'
          ? 'destructive'
          : 'secondary'
      }
    >
      {status === 'connected'
        ? 'Connected'
        : status === 'error'
        ? `Error: ${error?.message || 'Unknown error'}`
        : 'Disconnected'}
    </Badge>
  );
} 