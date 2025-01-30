import { motion, AnimatePresence } from 'framer-motion';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';
import { UserRole } from '@/utils/roleUtils';
import { getUpgradeRequirements } from '@/utils/courseUtils';
import Link from 'next/link';

interface CourseLockStatusProps {
  isLocked: boolean;
  currentRole: UserRole;
  requiredRole: UserRole;
  upgradeUrl: string;
}

export default function CourseLockStatus({
  isLocked,
  currentRole,
  requiredRole,
  upgradeUrl
}: CourseLockStatusProps) {
  const { requirements } = getUpgradeRequirements(currentRole);

  return (
    <AnimatePresence mode="wait">
      {isLocked ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-[#111111] rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
                transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
              }}
            >
              <LockClosedIcon className="w-6 h-6 text-[#ffc62d]" />
            </motion.div>
            <h3 className="text-lg font-semibold text-white">Course Locked</h3>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Requirements to unlock:
            </p>
            <ul className="space-y-2">
              {requirements.map((req, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 text-sm text-gray-400"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{req}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <Link
            href={upgradeUrl}
            className="mt-4 inline-flex items-center px-4 py-2 bg-[#ffc62d] text-black rounded-lg hover:bg-[#ffd65c] transition-colors"
          >
            Upgrade Now
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center space-x-3 text-green-400"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
            }}
          >
            <LockOpenIcon className="w-6 h-6" />
          </motion.div>
          <span>Course Unlocked</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 