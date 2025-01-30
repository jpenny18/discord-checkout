'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/contexts/RoleContext';
import Image from 'next/image';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number;
  lessons: any[];
  instructor?: {
    name: string;
    avatar: string;
  };
  updatedAt: Date;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingCourses, setDeletingCourses] = useState<Set<string>>(new Set());
  const { isAdmin } = useRole();

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
    const coursesQuery = query(
      collection(db, 'courses'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(coursesQuery, (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Course[];
      setCourses(coursesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingCourses(prev => new Set(Array.from(prev).concat(courseId)));
      await deleteDoc(doc(db, 'courses', courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setDeletingCourses(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-2xl font-bold text-white">Course Management</h1>
        <p className="text-gray-400">Create and manage training courses</p>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d] w-64"
        />
        <button className="px-4 py-2 bg-[#ffc62d] text-black rounded-lg font-medium hover:bg-[#e6b229]">
          Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-[#111111] rounded-lg overflow-hidden group hover:ring-1 hover:ring-[#ffc62d]/50 transition-all"
          >
            <div className="relative aspect-video">
              <Image
                src={course.thumbnail || '/images/course-placeholder.jpg'}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  className="px-4 py-2 bg-[#ffc62d] text-black rounded-lg font-medium hover:bg-[#e6b229] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  disabled={deletingCourses.has(course.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    deletingCourses.has(course.id)
                      ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {deletingCourses.has(course.id) ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    course.level === 'beginner'
                      ? 'bg-green-900/50 text-green-400'
                      : course.level === 'intermediate'
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : 'bg-red-900/50 text-red-400'
                  }`}
                >
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                <span className="text-sm text-gray-400">{course.duration} mins</span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">{course.description}</p>

              <div className="flex items-center justify-between">
                {course.instructor ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={course.instructor.avatar || '/images/default-avatar.png'}
                      alt={course.instructor.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-400">{course.instructor.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-800" />
                    <span className="text-sm text-gray-400">No instructor</span>
                  </div>
                )}
                <span className="text-xs text-gray-500">
                  Updated {course.updatedAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-[#111111] rounded-lg">
          <p className="text-gray-400">No courses found matching your search.</p>
        </div>
      )}
    </div>
  );
} 