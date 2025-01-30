'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/contexts/RoleContext';
import Image from 'next/image';

interface Content {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'pdf';
  category: string;
  url: string;
  thumbnail?: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function ContentPage() {
  const { isAdmin } = useRole();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingContent, setDeletingContent] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadContent = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      const contentQuery = query(
        collection(db, 'content'),
      orderBy('updatedAt', 'desc')
    );

      const unsubscribe = onSnapshot(contentQuery, (snapshot) => {
        const contentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Content[];
        setContent(contentData);
      setLoading(false);
    });

      return unsubscribe;
    };

    loadContent();
  }, [isAdmin]);

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingContent(prev => new Set(Array.from(prev).concat(contentId)));
      await deleteDoc(doc(db, 'content', contentId));
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content. Please try again.');
    } finally {
      setDeletingContent(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(contentId);
        return newSet;
      });
    }
  };

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
  if (loading) {
    return (
        <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
          <p className="text-gray-400">Create and manage educational content</p>
      </div>

        <div className="flex justify-between items-center">
            <input
              type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d] w-64"
          />
          <button className="px-4 py-2 bg-[#ffc62d] text-black rounded-lg font-medium hover:bg-[#e6b229]">
            Add Content
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="bg-[#111111] rounded-lg overflow-hidden group hover:ring-1 hover:ring-[#ffc62d]/50 transition-all"
            >
              <div className="relative aspect-video">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">{item.type.toUpperCase()}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    className="px-4 py-2 bg-[#ffc62d] text-black rounded-lg font-medium hover:bg-[#e6b229] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingContent.has(item.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      deletingContent.has(item.id)
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {deletingContent.has(item.id) ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.type === 'video'
                        ? 'bg-blue-900/50 text-blue-400'
                        : item.type === 'article'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-purple-900/50 text-purple-400'
                    }`}
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
                  <span className="text-sm text-gray-400">{item.category}</span>
              </div>

                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.author.avatar || '/images/default-avatar.png'}
                      alt={item.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-400">{item.author.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Updated {item.updatedAt.toLocaleDateString()}
                  </span>
              </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12 bg-[#111111] rounded-lg">
            <p className="text-gray-400">No content found matching your search.</p>
          </div>
        )}
    </div>
  );
  };

  return renderContent();
} 