import { UserRole, roleHierarchy, courseRequirements, hasRequiredRole } from './roleUtils';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, updateDoc } from 'firebase/firestore';

export interface CourseProgress {
  currentModule: number;
  completedModules: number[];
  totalModules: number;
  percentComplete: number;
}

export interface CourseState {
  isLocked: boolean;
  isInProgress: boolean;
  isCompleted: boolean;
  nextRequiredRole: UserRole | null;
  upgradeUrl: string;
}

export interface TotalProgress {
  totalPercentage: number;
  totalModulesCompleted: number;
  totalModules: number;
}

export function getCourseState(
  courseId: keyof typeof courseRequirements,
  userRole: UserRole,
  progress?: CourseProgress
): CourseState {
  const requiredRole = courseRequirements[courseId];
  const currentRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = roleHierarchy[requiredRole];
  
  const isLocked = currentRoleLevel < requiredRoleLevel;
  const isInProgress = !isLocked && progress?.percentComplete ? progress.percentComplete > 0 : false;
  const isCompleted = !isLocked && progress?.percentComplete === 100;

  // Find the next role needed for upgrade
  const nextRequiredRole = isLocked ? requiredRole : null;

  // Get the appropriate upgrade URL based on the course
  const upgradeUrl = getUpgradeUrl(userRole, requiredRole);

  return {
    isLocked,
    isInProgress,
    isCompleted,
    nextRequiredRole,
    upgradeUrl
  };
}

export function getUpgradeUrl(currentRole: UserRole, requiredRole: UserRole): string {
  if (currentRole === 'default') {
    return '/dashboard/challenge/trader';
  }
  
  switch (requiredRole) {
    case 'ascendant_hero':
      return '/dashboard/challenge/hero';
    case 'ascendant_challenger':
      return '/dashboard/challenge/challenger';
    case 'ascendant_trader':
      return '/dashboard/challenge/trader';
    default:
      return '/dashboard/challenge';
  }
}

export async function getCourseProgress(courseId: string, userId: string): Promise<CourseProgress> {
  try {
    if (!userId) {
      return {
        currentModule: 1,
        completedModules: [],
        totalModules: getTotalModules(courseId),
        percentComplete: 0
      };
    }

    const progressRef = doc(db, 'users', userId, 'progress', courseId);
    const progressDoc = await getDoc(progressRef);

    if (!progressDoc.exists()) {
      const initialProgress: CourseProgress = {
        currentModule: 1,
        completedModules: [],
        totalModules: getTotalModules(courseId),
        percentComplete: 0
      };
      await setDoc(progressRef, initialProgress);
      return initialProgress;
    }

    const data = progressDoc.data();
    const progress: CourseProgress = {
      currentModule: data.currentModule || 1,
      completedModules: data.completedModules || [],
      totalModules: getTotalModules(courseId),
      percentComplete: calculatePercentComplete(data.completedModules || [], getTotalModules(courseId))
    };
    return progress;
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return {
      currentModule: 1,
      completedModules: [],
      totalModules: getTotalModules(courseId),
      percentComplete: 0
    };
  }
}

export async function getTotalProgress(userId: string): Promise<TotalProgress> {
  if (!userId) {
    return {
      totalPercentage: 0,
      totalModulesCompleted: 0,
      totalModules: 0
    };
  }

  try {
    const progressQuery = query(collection(db, 'users', userId, 'progress'));
    const progressDocs = await getDocs(progressQuery);
    
    let totalModules = 0;
    let totalModulesCompleted = 0;

    progressDocs.forEach(doc => {
      const data = doc.data();
      totalModules += getTotalModules(doc.id);
      totalModulesCompleted += (data.completedModules || []).length;
    });

    return {
      totalPercentage: totalModules > 0 ? (totalModulesCompleted / totalModules) * 100 : 0,
      totalModulesCompleted,
      totalModules
    };
  } catch (error) {
    console.error('Error fetching total progress:', error);
    return {
      totalPercentage: 0,
      totalModulesCompleted: 0,
      totalModules: 0
    };
  }
}

function getTotalModules(courseId: string): number {
  switch (courseId) {
    case 'beginners':
      return 12;
    case 'intermediate':
      return 15;
    case 'advanced':
      return 20;
    default:
      return 0;
  }
}

function calculatePercentComplete(completedModules: number[], totalModules: number): number {
  if (totalModules === 0) return 0;
  return (completedModules.length / totalModules) * 100;
}

export function getNextAvailableCourse(userRole: UserRole): string | null {
  const courses = ['beginners', 'intermediate', 'advanced'] as const;
  
  for (const course of courses) {
    const requiredRole = courseRequirements[course];
    if (!hasRequiredRole(userRole, requiredRole)) {
      return course;
    }
  }
  
  return null;
}

export function getUpgradeRequirements(currentRole: UserRole): {
  nextRole: UserRole;
  requirements: string[];
} {
  const roles: UserRole[] = ['ascendant_trader', 'ascendant_challenger', 'ascendant_hero'];
  const currentIndex = roles.indexOf(currentRole);
  const nextRole = currentIndex < roles.length - 1 ? roles[currentIndex + 1] : currentRole;

  const requirements: Record<Exclude<UserRole, 'default'>, string[]> = {
    'ascendant_trader': [
      'Complete beginner trading assessment',
      'Demonstrate basic market knowledge',
      'Pass trading simulation with 60% success rate'
    ],
    'ascendant_challenger': [
      'Complete intermediate trading assessment',
      'Show consistent profit in live trading',
      'Pass advanced simulation with 75% success rate'
    ],
    'ascendant_hero': [
      'Complete expert trading assessment',
      'Demonstrate mastery of all trading strategies',
      'Achieve 90% success rate in advanced simulations'
    ]
  };

  return {
    nextRole,
    requirements: nextRole !== 'default' ? requirements[nextRole] : []
  };
}

export async function updateModuleCompletion(courseId: string, userId: string, moduleId: number) {
  try {
    const progressRef = doc(db, 'users', userId, 'progress', courseId);
    const progressDoc = await getDoc(progressRef);
    const totalModules = getTotalModules(courseId);
    
    if (!progressDoc.exists()) {
      const initialProgress: CourseProgress = {
        currentModule: moduleId + 1,
        completedModules: [moduleId],
        totalModules,
        percentComplete: (1 / totalModules) * 100
      };
      await setDoc(progressRef, initialProgress);
      return initialProgress;
    }

    const currentProgress = progressDoc.data() as CourseProgress;
    const completedModules = Array.from(new Set([...currentProgress.completedModules || [], moduleId]));
    const nextModule = Math.max(currentProgress.currentModule || 1, moduleId + 1);
    
    const updatedProgress: CourseProgress = {
      currentModule: nextModule,
      completedModules,
      totalModules,
      percentComplete: (completedModules.length / totalModules) * 100
    };

    await updateDoc(progressRef, {
      currentModule: updatedProgress.currentModule,
      completedModules: updatedProgress.completedModules,
      totalModules: updatedProgress.totalModules,
      percentComplete: updatedProgress.percentComplete
    });
    
    return updatedProgress;
  } catch (error) {
    console.error('Error updating module completion:', error);
    throw error;
  }
} 