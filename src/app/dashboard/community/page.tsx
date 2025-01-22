'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { Post } from '../../../types/community';
import PostCard from '@/components/PostCard';

export default function CommunityPage() {
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'announcements' | 'discussions'>('all');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'discussion' as Post['type']
  });

  useEffect(() => {
    if (!user) return;

    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate(),
          comments: data.comments.map((comment: any) => ({
            ...comment,
            timestamp: comment.timestamp.toDate()
          }))
        } as Post;
      });
      
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;

    try {
      await addDoc(collection(db, 'posts'), {
        ...newPost,
        author: {
          id: user.uid,
          name: userProfile.firstName,
          email: user.email
        },
        timestamp: serverTimestamp(),
        likes: 0,
        comments: []
      });

      setNewPost({ title: '', content: '', type: 'discussion' });
      setShowNewPostForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'announcements') return post.type === 'announcement';
    if (filter === 'discussions') return post.type === 'discussion';
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-[#111111] p-6">
        <h1 className="text-2xl font-bold text-white">Community</h1>
        <p className="mt-2 text-gray-400">
          Join discussions and stay updated with the latest announcements
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#ffc62d] text-black'
                : 'bg-[#111111] text-white hover:bg-gray-800'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFilter('announcements')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'announcements'
                ? 'bg-[#ffc62d] text-black'
                : 'bg-[#111111] text-white hover:bg-gray-800'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setFilter('discussions')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'discussions'
                ? 'bg-[#ffc62d] text-black'
                : 'bg-[#111111] text-white hover:bg-gray-800'
            }`}
          >
            Discussions
          </button>
        </div>
        
        <button
          onClick={() => setShowNewPostForm(true)}
          className="rounded-lg bg-[#ffc62d] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd35f]"
        >
          New Post
        </button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <div className="rounded-lg bg-[#111111] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-400">
                Content
              </label>
              <textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#ffc62d] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd35f]"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {filteredPosts.length === 0 && (
          <div className="rounded-lg bg-[#111111] p-8 text-center">
            <p className="text-gray-400">No posts found matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
} 