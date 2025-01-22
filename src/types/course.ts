export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'technical' | 'fundamental' | 'psychology' | 'risk-management';
  duration: number; // in minutes
  lessons: Lesson[];
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  requirements: string[];
  objectives: string[];
  updatedAt: Date;
  featured: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  order: number;
  resources?: {
    title: string;
    url: string;
    type: 'pdf' | 'link' | 'file';
  }[];
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: Question[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[]; // array of lesson IDs
  quizScores: {
    [quizId: string]: {
      score: number;
      completedAt: Date;
      attempts: number;
    };
  };
  lastAccessed: Date;
  certificateEarned: boolean;
  startedAt: Date;
  completedAt?: Date;
} 