'use client';

import { useState } from 'react';
import { Post } from '@/types/community';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user, userProfile } = useAuth();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'posts', post.id), {
        likes: post.likes + 1
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'posts', post.id), {
        comments: arrayUnion({
          id: crypto.randomUUID(),
          content: comment.trim(),
          author: {
            id: user.uid,
            name: userProfile.firstName,
            email: user.email
          },
          timestamp: new Date(),
          likes: 0
        })
      });
      setComment('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg bg-[#111111] p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{post.title}</h2>
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-sm text-gray-400">{post.author.name}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">
              {post.timestamp.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
        <span
          className={`rounded px-2 py-1 text-xs font-semibold ${
            post.type === 'announcement'
              ? 'bg-blue-900/50 text-blue-400'
              : 'bg-gray-800 text-gray-400'
          }`}
        >
          {post.type}
        </span>
      </div>

      <p className="mt-4 text-gray-300">{post.content}</p>

      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-sm text-gray-400 hover:text-[#ffc62d]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span>{post.likes}</span>
        </button>
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="flex items-center space-x-1 text-sm text-gray-400 hover:text-[#ffc62d]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{post.comments.length}</span>
        </button>
      </div>

      {showCommentForm && (
        <form onSubmit={handleComment} className="mt-4 space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowCommentForm(false)}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#ffc62d] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd35f] disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {post.comments.length > 0 && (
        <div className="mt-6 space-y-4 border-t border-gray-800 pt-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">{comment.author.name}</span>
                  <span className="text-xs text-gray-500">
                    {comment.timestamp.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <button className="text-sm text-gray-400 hover:text-[#ffc62d]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-300">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 