'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  lessons: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export default function ContentPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    status: 'draft',
    level: 'beginner'
  });
  const [editingCourse, setEditingCourse] = useState<string | null>(null);

  useEffect(() => {
    const coursesQuery = query(
      collection(db, 'courses'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(coursesQuery, (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Course[];
      setCourses(coursesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const timestamp = new Date();
      if (editingCourse) {
        const courseRef = doc(db, 'courses', editingCourse);
        await updateDoc(courseRef, {
          ...newCourse,
          updatedAt: timestamp
        });
      } else {
        await addDoc(collection(db, 'courses'), {
          ...newCourse,
          createdAt: timestamp,
          updatedAt: timestamp
        });
      }
      setNewCourse({ status: 'draft', level: 'beginner' });
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course.id);
    setNewCourse(course);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <p className="text-gray-400">Manage courses and lessons</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newCourse.title || ''}
              onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={newCourse.category || ''}
              onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
            <select
              name="level"
              value={newCourse.level}
              onChange={(e) => setNewCourse(prev => ({ ...prev, level: e.target.value as Course['level'] }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              name="status"
              value={newCourse.status}
              onChange={(e) => setNewCourse(prev => ({ ...prev, status: e.target.value as Course['status'] }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={newCourse.description || ''}
              onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#ffc62d]"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          {editingCourse && (
            <button
              type="button"
              onClick={() => {
                setEditingCourse(null);
                setNewCourse({ status: 'draft', level: 'beginner' });
              }}
              className="mr-4 px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-[#ffc62d] text-black font-medium hover:bg-[#e5b228]"
          >
            {editingCourse ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[#111111] p-6 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{course.title}</h3>
                  <p className="text-sm text-gray-400">{course.category}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    course.status === 'published' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {course.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-300">{course.description}</p>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="capitalize">{course.level}</span>
                <span>{course.lessons || 0} lessons</span>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleEdit(course)}
                  className="px-3 py-1 rounded bg-gray-800 text-white text-sm hover:bg-gray-700"
                >
                  Edit
                </button>
                <Link
                  href={`/admin/content/${course.id}`}
                  className="px-3 py-1 rounded bg-[#ffc62d] text-black text-sm hover:bg-[#e5b228]"
                >
                  Manage Lessons
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 