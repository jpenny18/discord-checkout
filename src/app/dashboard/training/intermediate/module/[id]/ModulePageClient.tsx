'use client';

import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { getCourseProgress, CourseProgress, updateModuleCompletion } from '@/utils/courseUtils';
import { moduleContent, ModuleContent } from '@/utils/moduleContent';
import ReactMarkdown from 'react-markdown';

function NavigationButtons({ moduleId, totalModules, canAccessNextModule, courseId, isModuleCompleted }: {
  moduleId: number;
  totalModules: number;
  canAccessNextModule: boolean;
  courseId: string;
  isModuleCompleted: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <Link 
        href={`/dashboard/training/${courseId}`}
        className="group flex items-center text-gray-400 hover:text-[#ffc62d] transition-colors duration-200"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-2" />
        <span>Back to Course</span>
      </Link>
      <div className="flex items-center space-x-4">
        {moduleId > 1 && (
          <Link
            href={`/dashboard/training/${courseId}/module/${moduleId - 1}`}
            className="text-gray-400 hover:text-[#ffc62d] transition-colors duration-200"
          >
            Previous Module
          </Link>
        )}
        {moduleId < totalModules && isModuleCompleted && (
          <Link
            href={`/dashboard/training/${courseId}/module/${moduleId + 1}`}
            className="text-gray-400 hover:text-[#ffc62d] transition-colors duration-200"
          >
            Next Module
          </Link>
        )}
      </div>
    </div>
  );
}

export function ModulePageClient({ 
  params,
  searchParams 
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const { role } = useRole();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<CourseProgress>();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const moduleId = parseInt(params.id);
  const courseId = 'intermediate';

  const moduleData = moduleContent[courseId]?.[moduleId];

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const courseProgress = await getCourseProgress(courseId, user.uid);
        setProgress(courseProgress);

        // Allow access to completed modules and the next unlocked module
        if (moduleId > (courseProgress?.currentModule || 1) + 1) {
          router.push(`/dashboard/training/${courseId}`);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, [user, courseId, moduleId, router]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleQuizSubmit = async () => {
    if (!moduleData.quiz || !user) return;

    // Check if all questions are answered
    if (selectedAnswers.length !== moduleData.quiz.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Calculate score
    const correctAnswers = moduleData.quiz.questions.reduce((count, question, index) => {
      return count + (question.correctAnswer === selectedAnswers[index] ? 1 : 0);
    }, 0);

    const score = (correctAnswers / moduleData.quiz.questions.length) * 100;
    const passed = score >= 70; // 70% passing threshold

    setQuizSubmitted(true);
    setQuizPassed(passed);

    if (passed) {
      try {
        // Update module completion in Firebase
        await updateModuleCompletion(courseId, user.uid, moduleId);
        
        // Update local progress state
        const updatedProgress = await getCourseProgress(courseId, user.uid);
        setProgress(updatedProgress);
      } catch (error) {
        console.error('Error updating module completion:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-800 rounded" />
          <div className="h-4 w-96 bg-gray-800 rounded" />
          <div className="aspect-video bg-gray-800 rounded" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-800 rounded" />
            <div className="h-4 w-5/6 bg-gray-800 rounded" />
            <div className="h-4 w-4/6 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!moduleData) {
    router.push(`/dashboard/training/${courseId}`);
    return null;
  }

  const canAccessNextModule = progress?.completedModules?.includes(moduleId) || 
                           moduleId <= (progress?.currentModule || 1);
  const isModuleCompleted = progress?.completedModules?.includes(moduleId) || false;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Top Navigation */}
          <NavigationButtons 
            moduleId={moduleId}
            totalModules={progress?.totalModules || 6}
            canAccessNextModule={canAccessNextModule}
            courseId={courseId}
            isModuleCompleted={isModuleCompleted}
          />

          {/* Module Content */}
          <div className="bg-[#111111] rounded-lg p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl font-bold text-white mb-2">{moduleData.title}</h1>
              <p className="text-gray-400 mb-6">{moduleData.description}</p>

              {/* Video Player */}
              {moduleData.videoUrl && (
                <div className="aspect-video bg-black mb-6 rounded-lg">
                  <div className="w-full h-full flex items-center justify-center text-gray-500 border border-gray-800 rounded-lg">
                    Video Player Placeholder
                  </div>
                </div>
              )}

              {/* Module Content */}
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{moduleData.content}</ReactMarkdown>
              </div>

              {/* Quiz Section */}
              {moduleData.quiz && (
                <div className="mt-8 border-t border-gray-800 pt-8">
                  <h2 className="text-xl font-bold text-white mb-6">Module Quiz</h2>
                  <div className="space-y-6">
                    {moduleData.quiz.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="bg-[#1a1a1a] rounded-lg p-6">
                        <p className="text-white mb-4">{question.question}</p>
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => !quizSubmitted && handleAnswerSelect(questionIndex, optionIndex)}
                              className={`w-full text-left p-3 rounded-lg transition-colors ${
                                selectedAnswers[questionIndex] === optionIndex
                                  ? 'bg-[#ffc62d]/10 text-[#ffc62d]'
                                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                              } ${
                                quizSubmitted
                                  ? optionIndex === question.correctAnswer
                                    ? 'bg-green-500/10 text-green-500'
                                    : selectedAnswers[questionIndex] === optionIndex
                                    ? 'bg-red-500/10 text-red-500'
                                    : ''
                                  : ''
                              }`}
                              disabled={quizSubmitted}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        className="w-full py-3 px-4 bg-[#ffc62d] text-black font-semibold rounded-lg hover:bg-[#ffd65c] transition-colors duration-200"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <div className={`p-4 rounded-lg ${quizPassed ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {quizPassed ? (
                          <>
                            <h3 className="font-bold mb-2">Congratulations! You passed the quiz!</h3>
                            <p>You can now proceed to the next module.</p>
                          </>
                        ) : (
                          <>
                            <h3 className="font-bold mb-2">Quiz not passed</h3>
                            <p>Please review the material and try again.</p>
                            <button
                              onClick={() => {
                                setQuizSubmitted(false);
                                setSelectedAnswers([]);
                              }}
                              className="mt-4 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                              Retry Quiz
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {quizSubmitted && quizPassed && (
                    <div className="mt-6">
                      <Link
                        href={`/dashboard/training/${courseId}/module/${moduleId + 1}`}
                        className="block w-full py-3 px-4 bg-[#ffc62d] text-black font-semibold rounded-lg hover:bg-[#ffd65c] text-center transition-colors duration-200"
                      >
                        Continue to Next Module
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Bottom Navigation */}
          <NavigationButtons 
            moduleId={moduleId}
            totalModules={progress?.totalModules || 6}
            canAccessNextModule={canAccessNextModule}
            courseId={courseId}
            isModuleCompleted={isModuleCompleted}
          />
        </div>
      </div>
    </div>
  );
} 