'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { moduleContent } from '@/utils/moduleContent';
import { getCourseProgress, CourseProgress } from '@/utils/courseUtils';

export default function AdvancedCoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [clickedModuleId, setClickedModuleId] = useState<number | null>(null);
  const [progress, setProgress] = useState<CourseProgress>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const courseProgress = await getCourseProgress('advanced', user.uid);
        setProgress(courseProgress);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  // All modules are unlocked - no restrictions
  const isModuleCompleted = (moduleId: number) => {
    return progress?.completedModules?.includes(moduleId) || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-gray-800 rounded w-3/4" />
          <div className="h-2 bg-gray-800 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalModules = Object.keys(moduleContent.advanced || {}).length;
  const percentComplete = progress?.percentComplete || 0;
  const completedModules = progress?.completedModules || [];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Advanced Trading Course</h1>
            <p className="text-gray-400 mt-2">Master advanced trading techniques with our expert-level course. Learn complex strategies, institutional trading methods, and advanced risk management.</p>
          </div>

          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#ffc62d] bg-[#ffc62d]/10">
                  Course Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-[#ffc62d]">
                  {Math.round(percentComplete)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[#1a1a1a]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentComplete}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#ffc62d]"
              />
            </div>
            <p className="text-gray-400 text-sm text-center">
              {completedModules.length} of {totalModules} modules completed
            </p>
          </div>

          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(moduleContent.advanced || {}).map(([id, module]) => {
              const moduleId = parseInt(id);
              const completed = isModuleCompleted(moduleId);

              return (
                <motion.div
                  key={moduleId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: moduleId * 0.1 }}
                  className="relative group"
                >
                  <Link
                    href={`/dashboard/training/advanced/module/${moduleId}`}
                    className="block h-full"
                    onClick={() => setClickedModuleId(moduleId)}
                  >
                    <div 
                      className="bg-[#111111] rounded-lg p-6 h-full transition-all duration-200 hover:shadow-lg hover:shadow-[#ffc62d]/10 hover:scale-[1.02] border border-gray-800/50"
                    >
                      <div className="flex flex-col mb-4">
                        {completed && (
                          <div className="self-end mb-2">
                            <span className="flex items-center text-green-500 text-sm font-medium px-2 py-1 bg-green-500/10 rounded">
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Completed
                            </span>
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-white">
                          Module {moduleId}: {module.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm">{module.description}</p>

                      {/* Loading Overlay */}
                      {clickedModuleId === moduleId && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center"
                        >
                          <div className="text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
                            <p className="mt-2 text-[#ffc62d]">Loading...</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 