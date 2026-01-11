'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getCourseProgress, getTotalProgress } from '@/utils/courseUtils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRightIcon, AcademicCapIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

interface CourseProgress {
  percentComplete: number;
  isStarted: boolean;
  isCompleted: boolean;
}

interface ProgressStats {
  totalTimeSpent: number;
  overallProgress: number;
  coursesStarted: number;
  coursesCompleted: number;
}

const courses = [
  {
    id: 'beginners',
    title: 'Beginners Course',
    description: 'Master the fundamentals of trading',
    modules: 6,
    duration: '6 hours',
    level: 'Beginner',
    levelColor: 'text-green-400',
  },
  {
    id: 'intermediate',
    title: 'Intermediate Course',
    description: 'Advanced trading strategies and techniques',
    modules: 3,
    duration: '4 hours',
    level: 'Intermediate',
    levelColor: 'text-blue-400',
  },
  {
    id: 'advanced',
    title: 'Advanced Course',
    description: 'Expert-level trading mastery',
    modules: 3,
    duration: '5 hours',
    level: 'Advanced',
    levelColor: 'text-purple-400',
  },
];

export default function TrainingOverview() {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalTimeSpent: 0,
    overallProgress: 0,
    coursesStarted: 0,
    coursesCompleted: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch individual course progress
        const progressPromises = courses.map(async (course) => {
          const progress = await getCourseProgress(course.id, user.uid);
          const isStarted = progress ? progress.currentModule > 1 || progress.completedModules.length > 0 : false;
          const isCompleted = progress ? progress.percentComplete === 100 : false;
          
          return {
            courseId: course.id,
            progress: {
              percentComplete: progress?.percentComplete || 0,
              isStarted,
              isCompleted
            }
          };
        });

        const progressResults = await Promise.all(progressPromises);
        const progressMap = progressResults.reduce((acc, { courseId, progress }) => {
          acc[courseId] = progress;
          return acc;
        }, {} as Record<string, CourseProgress>);

        // Fetch total progress stats
        const totalStats = await getTotalProgress(user.uid);

        // Calculate additional stats
        const coursesStarted = Object.values(progressMap).filter(p => p.isStarted).length;
        const coursesCompleted = Object.values(progressMap).filter(p => p.isCompleted).length;

        setCourseProgress(progressMap);
        setProgressStats({
          totalTimeSpent: 0, // This would need to be tracked separately
          overallProgress: totalStats.totalPercentage,
          coursesStarted,
          coursesCompleted
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        {/* Add loading skeleton components here */}
      </div>
    );
  }

  function formatLearningTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  }

  // Progressive unlocking logic
  const isBeginnersUnlocked = true;
  const isIntermediateUnlocked = courseProgress['beginners']?.isCompleted || false;
  const isAdvancedUnlocked = courseProgress['intermediate']?.isCompleted || false;

  const getCourseAccessibility = (courseId: string) => {
    switch (courseId) {
      case 'beginners':
        return { isAccessible: isBeginnersUnlocked, unlockMessage: '' };
      case 'intermediate':
        return { 
          isAccessible: isIntermediateUnlocked, 
          unlockMessage: 'Complete Beginners Course to unlock' 
        };
      case 'advanced':
        return { 
          isAccessible: isAdvancedUnlocked, 
          unlockMessage: 'Complete Intermediate Course to unlock' 
        };
      default:
        return { isAccessible: false, unlockMessage: '' };
    }
  };

  const coursesUnlocked = [isBeginnersUnlocked, isIntermediateUnlocked, isAdvancedUnlocked].filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Progress Overview Section */}
      <div className="bg-[#111111] rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Your Learning Journey</h2>
            <p className="text-gray-400 text-sm">Complete courses to unlock the next level</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#ffc62d]">{Math.round(progressStats.overallProgress)}%</p>
            <p className="text-sm text-gray-400">Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const { isAccessible, unlockMessage } = getCourseAccessibility(course.id);
          const progress = courseProgress[course.id] || { percentComplete: 0, isStarted: false, isCompleted: false };

          return (
            <div
              key={course.id}
              className={`bg-[#111111] rounded-lg overflow-hidden group transition-all ${
                isAccessible ? 'hover:ring-1 hover:ring-[#ffc62d]/50' : 'opacity-75'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${course.levelColor}`}>
                    {course.level}
                  </span>
                  {isAccessible ? (
                    progress.isCompleted ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-sm text-gray-400">{Math.round(progress.percentComplete)}%</span>
                    )
                  ) : (
                    <LockClosedIcon className="w-5 h-5 text-[#ffc62d]" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{course.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <span>{course.modules} Modules</span>
                  <span>{course.duration}</span>
                </div>

                {isAccessible ? (
                  <Link
                    href={`/dashboard/training/${course.id}`}
                    className="flex items-center justify-between w-full px-4 py-2 bg-[#1a1a1a] rounded-lg group-hover:bg-[#ffc62d]/10 transition-colors"
                  >
                    <span className="text-white group-hover:text-[#ffc62d]">
                      {progress.isCompleted ? 'Review Course' : progress.isStarted ? 'Continue Learning' : 'Start Course'}
                    </span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-[#ffc62d]" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-center w-full px-4 py-2 bg-[#1a1a1a] rounded-lg">
                    <span className="text-gray-500 text-sm text-center">
                      {unlockMessage}
                    </span>
                  </div>
                )}
              </div>

              {isAccessible && progress.percentComplete > 0 && (
                <div className="h-1 bg-gray-800">
                  <motion.div 
                    className="h-full bg-[#ffc62d]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentComplete}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Courses Unlocked</p>
              <p className="text-2xl font-bold text-white">
                {coursesUnlocked}/{courses.length}
              </p>
            </div>
            <AcademicCapIcon className="w-8 h-8 text-[#ffc62d]" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Courses Completed</p>
              <p className="text-2xl font-bold text-white">
                {progressStats.coursesCompleted}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-[#ffc62d]" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Progress</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(progressStats.overallProgress)}%
              </p>
            </div>
            <svg className="w-8 h-8 text-[#ffc62d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 