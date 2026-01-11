'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getCourseProgress } from '@/utils/courseUtils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface CourseProgress {
  percentComplete: number;
  isCompleted: boolean;
}

export default function TrainingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({
    beginners: { percentComplete: 0, isCompleted: false },
    intermediate: { percentComplete: 0, isCompleted: false },
    advanced: { percentComplete: 0, isCompleted: false }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const [beginnersProgress, intermediateProgress, advancedProgress] = await Promise.all([
          getCourseProgress('beginners', user.uid),
          getCourseProgress('intermediate', user.uid),
          getCourseProgress('advanced', user.uid)
        ]);

        setCourseProgress({
          beginners: {
            percentComplete: beginnersProgress?.percentComplete || 0,
            isCompleted: beginnersProgress?.percentComplete === 100
          },
          intermediate: {
            percentComplete: intermediateProgress?.percentComplete || 0,
            isCompleted: intermediateProgress?.percentComplete === 100
          },
          advanced: {
            percentComplete: advancedProgress?.percentComplete || 0,
            isCompleted: advancedProgress?.percentComplete === 100
          }
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  // Progressive unlocking: beginners always unlocked, intermediate after beginners, advanced after intermediate
  const isBeginnersUnlocked = true;
  const isIntermediateUnlocked = courseProgress.beginners.isCompleted;
  const isAdvancedUnlocked = courseProgress.intermediate.isCompleted;

  const courses = [
    {
      id: 'beginners',
      title: 'Beginners Course',
      description: 'Master the fundamentals of trading',
      modules: 6,
      isUnlocked: isBeginnersUnlocked,
      progress: courseProgress.beginners.percentComplete,
      isCompleted: courseProgress.beginners.isCompleted,
      features: [
        'Platform Knowledge',
        'Chart Knowledge',
        'MT4/MT5 Setup',
        'Trading Psychology',
        'Risk Management',
        'Entry Models'
      ]
    },
    {
      id: 'intermediate',
      title: 'Intermediate Course',
      description: 'Advanced trading strategies and techniques',
      modules: 3,
      isUnlocked: isIntermediateUnlocked,
      progress: courseProgress.intermediate.percentComplete,
      isCompleted: courseProgress.intermediate.isCompleted,
      unlockRequirement: 'Complete Beginners Course',
      features: [
        'Advanced Chart Patterns',
        'Technical Indicators',
        'Market Microstructure',
        'Volume Analysis',
        'Trade Examples',
        'Strategy Development'
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Course',
      description: 'Expert-level trading mastery',
      modules: 3,
      isUnlocked: isAdvancedUnlocked,
      progress: courseProgress.advanced.percentComplete,
      isCompleted: courseProgress.advanced.isCompleted,
      unlockRequirement: 'Complete Intermediate Course',
      features: [
        'Algorithmic Trading',
        'Quantitative Analysis',
        'High-Frequency Trading',
        'Portfolio Optimization',
        'Advanced Risk Models',
        'Institutional Methods'
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-800 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trading Education</h1>
          <p className="text-gray-400">Complete each course to unlock the next level</p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              <div 
                className={`rounded-2xl p-6 flex flex-col border h-full ${
                  course.isUnlocked 
                    ? 'bg-[#111111] border-gray-800 hover:border-[#ffc62d]/50 transition-colors' 
                    : 'bg-[#0a0a0a] border-gray-900 opacity-75'
                }`}
              >
                {/* Lock Icon */}
                {!course.isUnlocked && (
                  <div className="absolute top-4 right-4">
                    <LockClosedIcon className="w-6 h-6 text-[#ffc62d]" />
                  </div>
                )}

                {/* Completion Badge */}
                {course.isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                )}

                <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                
                {/* Module Count */}
                <div className="text-sm text-gray-500 mb-4">
                  {course.modules} modules
                </div>

                {/* Features List */}
                <ul className="space-y-2 flex-grow text-sm mb-6">
                  {course.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Progress Bar */}
                {course.isUnlocked && course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(course.progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#ffc62d]"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {course.isUnlocked ? (
                  <Link
                    href={`/dashboard/training/${course.id}`}
                    className="w-full bg-[#ffc62d] text-black py-3 rounded-lg text-sm font-semibold hover:bg-[#e6b229] transition-colors text-center block"
                  >
                    {course.isCompleted ? 'Review Course' : course.progress > 0 ? 'Continue' : 'Start Course'}
                  </Link>
                ) : (
                  <div className="w-full bg-gray-800 text-gray-500 py-3 rounded-lg text-sm font-semibold text-center cursor-not-allowed">
                    🔒 {course.unlockRequirement}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}