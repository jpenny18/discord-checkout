'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import CourseLoadingSkeleton from './CourseLoadingSkeleton';
import { useRouter } from 'next/navigation';

interface CourseLayoutProps {
  courseData: {
    title: string;
    description: string;
    currentModule: number;
    totalModules: number;
    modules: {
      id: number;
      title: string;
      description: string;
      duration: string;
      completed: boolean;
    }[];
  };
  children: React.ReactNode;
  isLoading?: boolean;
  courseId: string;
}

export default function CourseLayout({ courseData, children, isLoading, courseId }: CourseLayoutProps) {
  const router = useRouter();

  if (isLoading) {
    return <CourseLoadingSkeleton />;
  }

  const completedModules = courseData.modules.filter(module => module.completed).length;
  const progress = (completedModules / courseData.modules.length) * 100;

  const handleModuleClick = (moduleId: number) => {
    router.push(`/dashboard/training/${courseId}/module/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center">
            <Link 
              href="/dashboard/training/overview"
              className="group flex items-center text-gray-400 hover:text-[#ffc62d] transition-colors duration-200"
            >
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
              </motion.div>
              <span>Back to Overview</span>
            </Link>
          </div>

          {/* Course Status (Moved from children) */}
          {children}

          {/* Course Header */}
          <div className="bg-[#111111] rounded-lg p-6 shadow-lg transition-shadow hover:shadow-[#ffc62d]/5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl font-bold text-white mb-2">{courseData.title}</h1>
              <p className="text-gray-400">{courseData.description}</p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Course Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#ffc62d] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Module Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseData.modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleModuleClick(module.id)}
                className={`bg-[#111111] rounded-lg p-6 hover:bg-[#1a1a1a] transition-colors duration-200 cursor-pointer group ${
                  module.completed ? 'ring-1 ring-[#ffc62d]/30' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#ffc62d] transition-colors duration-200">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-400">{module.duration}</p>
                  </div>
                  <div className={`text-sm font-medium ${module.completed ? 'text-[#ffc62d]' : 'text-[#ffc62d] opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
                    {module.completed ? 'Review →' : 'Start →'}
                  </div>
                </div>
                <p className="text-sm text-gray-400">{module.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 