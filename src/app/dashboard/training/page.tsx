'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, UserProgress } from '@/types/course';
import Image from 'next/image';
import Link from 'next/link';

export default function TrainingPage() {
  const { user } = useAuth();
  const { canAccessCourse, role } = useRole();
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

  // Function to determine if a course is locked
  const isCourseLocked = (course: Course) => {
    if (course.level === 'beginner' && (!role || role === 'default')) {
      // For default (free) users, check if it's in the first half of beginner courses
      const beginnerCourses = courses.filter(c => c.level === 'beginner');
      const courseIndex = beginnerCourses.findIndex(c => c.id === course.id);
      return courseIndex >= Math.ceil(beginnerCourses.length / 2);
    }
    return !canAccessCourse(course.level as 'beginner' | 'intermediate' | 'advanced');
  };

  // Function to get upgrade message based on course level
  const getUpgradeMessage = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Upgrade to Ascendant Trader to access all beginner courses';
      case 'intermediate':
        return 'Upgrade to Ascendant Challenger to access intermediate courses';
      case 'advanced':
        return 'Upgrade to Ascendant Hero to access advanced courses';
      default:
        return 'Upgrade your membership to access this course';
    }
  };

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
          const totalLessons = course.lessons?.length || 0;
          const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
          const locked = isCourseLocked(course);

          return (
            <div
              key={course.id}
              className="group relative rounded-lg bg-[#111111] p-4 transition-transform hover:scale-[1.02]"
            >
              {/* Lock overlay for restricted courses */}
              {locked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm p-6 text-center">
                  <svg
                    className="w-12 h-12 text-[#ffc62d] mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Course Locked
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {getUpgradeMessage(course.level)}
                  </p>
                  <Link
                    href="/dashboard/challenge"
                    className="px-6 py-2 bg-[#ffc62d] text-black rounded-lg font-medium hover:bg-[#ffc62d]/90 transition-colors"
                  >
                    Upgrade Now
                  </Link>
                </div>
              )}

              {/* Course content */}
              <Link href={locked ? '#' : `/dashboard/training/${course.id}`}>
                <span className="block">
                  <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={course.thumbnail || '/images/course-placeholder.jpg'}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {/* Progress overlay */}
                    <div className="absolute inset-0 bg-black/60">
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div
                          className="h-full bg-[#ffc62d]"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
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
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {course.instructor ? (
                          <>
                            <Image
                              src={course.instructor.avatar || '/images/default-avatar.png'}
                              alt={course.instructor.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <span className="text-sm text-gray-400">
                              {course.instructor.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 rounded-full bg-gray-700" />
                            <span className="text-sm text-gray-400">No instructor</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {completedLessons} / {totalLessons} lessons
                      </div>
                    </div>
                  </div>
                </span>
              </Link>
            </div>
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