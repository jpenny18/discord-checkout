import { motion } from 'framer-motion';

export default function CourseLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-[#111111] rounded-lg p-6">
        <div className="h-8 w-48 bg-gray-800 rounded mb-4" />
        <div className="h-4 w-96 bg-gray-800 rounded" />
      </div>

      {/* Course Status Skeleton */}
      <div className="bg-[#111111] rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-6 w-6 bg-gray-800 rounded" />
          <div className="h-6 w-32 bg-gray-800 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-800 rounded" />
              <div className="h-4 w-64 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Module List Skeleton */}
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#111111] rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-6 w-48 bg-gray-800 rounded mb-2" />
                <div className="h-4 w-32 bg-gray-800 rounded" />
              </div>
              <div className="h-8 w-8 bg-gray-800 rounded" />
            </div>
            <div className="h-4 w-full bg-gray-800 rounded mt-4" />
          </div>
        ))}
      </div>

      {/* Progress Bar Skeleton */}
      <div className="bg-[#111111] rounded-lg p-6">
        <div className="flex justify-between mb-2">
          <div className="h-4 w-24 bg-gray-800 rounded" />
          <div className="h-4 w-12 bg-gray-800 rounded" />
        </div>
        <div className="h-2 w-full bg-gray-800 rounded">
          <motion.div
            className="h-full bg-[#ffc62d]/20 rounded"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </div>
    </div>
  );
} 