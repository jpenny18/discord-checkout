'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, UserProgress } from '@/types/course';
import Image from 'next/image';
import Link from 'next/link';

export default function TrainingPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    status: 'all'
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesQuery = query(collection(db, 'courses'), orderBy('updatedAt', 'desc'));
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          updatedAt: doc.data().updatedAt.toDate()
        })) as Course[];
        setCourses(coursesData);

        // Fetch user progress
        const progressQuery = query(collection(db, `users/${user.uid}/progress`));
        const progressSnapshot = await getDocs(progressQuery);
        const progressData = progressSnapshot.docs.reduce((acc, doc) => ({
          ...acc,
          [doc.id]: {
            ...doc.data(),
            lastAccessed: doc.data().lastAccessed.toDate(),
            startedAt: doc.data().startedAt.toDate(),
            completedAt: doc.data().completedAt?.toDate()
          }
        }), {});
        setProgress(progressData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'all' || course.category === filters.category;
    const matchesLevel = filters.level === 'all' || course.level === filters.level;
    const courseProgress = progress[course.id];
    const matchesStatus = filters.status === 'all' ||
      (filters.status === 'completed' && courseProgress?.certificateEarned) ||
      (filters.status === 'in-progress' && courseProgress && !courseProgress.certificateEarned) ||
      (filters.status === 'not-started' && !courseProgress);

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
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
        <h1 className="text-2xl font-bold text-white">Training</h1>
        <p className="mt-2 text-gray-400">
          Master trading with our comprehensive courses
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg bg-[#111111] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffc62d]"
        />

        <div className="flex flex-wrap gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-lg bg-[#111111] px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical Analysis</option>
            <option value="fundamental">Fundamental Analysis</option>
            <option value="psychology">Trading Psychology</option>
            <option value="risk-management">Risk Management</option>
          </select>

          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            className="rounded-lg bg-[#111111] px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-lg bg-[#111111] px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]"
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          const courseProgress = progress[course.id];
          const completedLessons = courseProgress?.completedLessons.length || 0;
          const totalLessons = course.lessons.length;
          const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          return (
            <Link
              key={course.id}
              href={`/dashboard/training/${course.id}`}
              className="group rounded-lg bg-[#111111] p-4 transition-transform hover:scale-[1.02]"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {courseProgress?.certificateEarned && (
                  <div className="absolute right-2 top-2 rounded-full bg-green-500 p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      course.level === 'beginner'
                        ? 'bg-green-900/50 text-green-400'
                        : course.level === 'intermediate'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {course.duration} mins
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-[#ffc62d]">
                  {course.title}
                </h3>

                <p className="line-clamp-2 text-sm text-gray-400">
                  {course.description}
                </p>

                <div className="flex items-center space-x-2">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm text-gray-400">
                    {course.instructor.name}
                  </span>
                </div>

                {courseProgress && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-[#ffc62d]"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="rounded-lg bg-[#111111] p-8 text-center">
          <p className="text-gray-400">
            No courses found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
} 