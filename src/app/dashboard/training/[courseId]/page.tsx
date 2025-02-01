'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, Lesson, UserProgress } from '@/types/course';
import Image from 'next/image';
import LessonQuiz from '@/components/LessonQuiz';

interface CoursePageProps {
  params: {
    courseId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function CoursePage({ params, searchParams }: CoursePageProps) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch course data
        const courseDoc = await getDoc(doc(db, 'courses', params.courseId));
        if (!courseDoc.exists()) {
          throw new Error('Course not found');
        }

        const courseData = {
          id: courseDoc.id,
          ...courseDoc.data(),
          updatedAt: courseDoc.data().updatedAt.toDate()
        } as Course;
        setCourse(courseData);
        
        // Set initial lesson if none selected
        if (!currentLesson) {
          setCurrentLesson(courseData.lessons[0]);
        }

        // Fetch or initialize user progress
        const progressDoc = await getDoc(doc(db, `users/${user.uid}/progress`, params.courseId));
        if (progressDoc.exists()) {
          const progressData = {
            ...progressDoc.data(),
            lastAccessed: progressDoc.data().lastAccessed.toDate(),
            startedAt: progressDoc.data().startedAt.toDate(),
            completedAt: progressDoc.data().completedAt?.toDate()
          } as UserProgress;
          setProgress(progressData);
        } else {
          // Initialize progress for new user
          const newProgress: UserProgress = {
            userId: user.uid,
            courseId: params.courseId,
            completedLessons: [],
            quizScores: {},
            lastAccessed: new Date(),
            certificateEarned: false,
            startedAt: new Date()
          };
          await setDoc(doc(db, `users/${user.uid}/progress`, params.courseId), newProgress);
          setProgress(newProgress);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, params.courseId]);

  const handleLessonComplete = async () => {
    if (!user || !course || !currentLesson || !progress) return;

    setSaving(true);
    try {
      // Only add the lesson if it's not already completed
      const completedLessons = progress.completedLessons.includes(currentLesson.id)
        ? progress.completedLessons
        : [...progress.completedLessons, currentLesson.id];

      const updatedProgress = {
        ...progress,
        completedLessons,
        lastAccessed: new Date()
      };

      // Check if course is completed
      const allLessonsCompleted = course.lessons.every(lesson =>
        updatedProgress.completedLessons.includes(lesson.id)
      );

      if (allLessonsCompleted) {
        updatedProgress.certificateEarned = true;
        updatedProgress.completedAt = new Date();
      }

      await updateDoc(doc(db, `users/${user.uid}/progress`, course.id), updatedProgress);
      setProgress(updatedProgress);

      // Move to next lesson if available
      const currentIndex = course.lessons.findIndex(lesson => lesson.id === currentLesson.id);
      if (currentIndex < course.lessons.length - 1) {
        setCurrentLesson(course.lessons[currentIndex + 1]);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  if (!course || !currentLesson) return null;

  const isLessonCompleted = (lessonId: string) =>
    progress?.completedLessons.includes(lessonId);

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="rounded-lg bg-[#111111] p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            <p className="mt-2 text-gray-400">{course.description}</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm text-gray-400">{course.instructor.name}</span>
              </div>
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
              <span className="text-sm text-gray-400">{course.duration} mins</span>
            </div>
          </div>
          {progress?.certificateEarned && (
            <div className="rounded-lg bg-green-900/50 px-4 py-2">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-green-400">Course Completed</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Video Player and Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            <iframe
              src={currentLesson.videoUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="rounded-lg bg-[#111111] p-6">
            <h2 className="text-xl font-semibold text-white">{currentLesson.title}</h2>
            <p className="mt-2 text-gray-400">{currentLesson.description}</p>

            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white">Resources</h3>
                <div className="mt-2 space-y-2">
                  {currentLesson.resources.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-[#ffc62d] hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{resource.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  const currentIndex = course.lessons.findIndex(
                    lesson => lesson.id === currentLesson.id
                  );
                  if (currentIndex > 0) {
                    setCurrentLesson(course.lessons[currentIndex - 1]);
                  }
                }}
                disabled={course.lessons[0].id === currentLesson.id}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
              >
                Previous Lesson
              </button>
              <button
                onClick={handleLessonComplete}
                disabled={saving || isLessonCompleted(currentLesson.id)}
                className="rounded-lg bg-[#ffc62d] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd35f] disabled:opacity-50"
              >
                {isLessonCompleted(currentLesson.id)
                  ? 'Completed'
                  : saving
                  ? 'Marking as Complete...'
                  : 'Mark as Complete'}
              </button>
            </div>
          </div>

          {currentLesson.quiz && (
            <div className="mt-6">
              <LessonQuiz
                quiz={currentLesson.quiz}
                isCompleted={Boolean(
                  currentLesson.quiz &&
                  progress?.quizScores?.[currentLesson.id]?.score &&
                  currentLesson.quiz.passingScore &&
                  progress.quizScores[currentLesson.id].score >= currentLesson.quiz.passingScore
                )}
                onComplete={async (score) => {
                  if (!user || !course || !progress) return;
                  
                  try {
                    const updatedProgress = {
                      ...progress,
                      quizScores: {
                        ...progress.quizScores,
                        [currentLesson.id]: {
                          score,
                          completedAt: new Date(),
                          attempts: (progress.quizScores[currentLesson.id]?.attempts || 0) + 1
                        }
                      }
                    };

                    await updateDoc(doc(db, `users/${user.uid}/progress`, course.id), updatedProgress);
                    setProgress(updatedProgress);
                  } catch (error) {
                    console.error('Error updating quiz score:', error);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Lesson List */}
        <div className="rounded-lg bg-[#111111] p-6">
          <h2 className="text-lg font-semibold text-white">Course Content</h2>
          <div className="mt-4 space-y-2">
            {course.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors ${
                  currentLesson.id === lesson.id
                    ? 'bg-[#ffc62d] text-black'
                    : 'bg-[#1a1a1a] text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isLessonCompleted(lesson.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        currentLesson.id === lesson.id ? 'text-black' : 'text-green-400'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        currentLesson.id === lesson.id ? 'text-black' : 'text-gray-400'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{lesson.title}</span>
                </div>
                <span className="text-xs">
                  {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60)
                    .toString()
                    .padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="mt-6 space-y-2 border-t border-gray-800 pt-4">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress</span>
              <span>
                {progress
                  ? Math.round(
                      (progress.completedLessons.length / course.lessons.length) * 100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="h-1 rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-[#ffc62d]"
                style={{
                  width: `${
                    progress
                      ? (progress.completedLessons.length / course.lessons.length) * 100
                      : 0
                  }%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 