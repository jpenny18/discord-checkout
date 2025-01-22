'use client';

import { useState } from 'react';
import { Quiz, Question } from '@/types/course';

interface LessonQuizProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  isCompleted?: boolean;
}

export default function LessonQuiz({ quiz, onComplete, isCompleted = false }: LessonQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalScore = calculateScore();
      setScore(finalScore);
      setShowResults(true);
      onComplete(finalScore);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="rounded-lg bg-green-900/50 p-4">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-green-400">Quiz Completed</span>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="rounded-lg bg-[#111111] p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">Quiz Results</h3>
        <div className="space-y-2">
          <p className="text-gray-400">Your score: {score}%</p>
          <p className="text-gray-400">
            {score >= quiz.passingScore 
              ? 'Congratulations! You passed the quiz.' 
              : 'Keep practicing! You can retake the quiz to improve your score.'}
          </p>
        </div>
        {score < quiz.passingScore && (
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setSelectedAnswers({});
              setShowResults(false);
              setScore(0);
            }}
            className="rounded-lg bg-[#ffc62d] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd35f]"
          >
            Retry Quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[#111111] p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Question {currentQuestionIndex + 1} of {totalQuestions}</h3>
        <span className="text-sm text-gray-400">Passing Score: {quiz.passingScore}%</span>
      </div>

      <div className="space-y-4">
        <p className="text-white">{currentQuestion.text}</p>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              className={`w-full rounded-lg p-3 text-left transition-colors ${
                selectedAnswers[currentQuestion.id] === index
                  ? 'bg-[#ffc62d] text-black'
                  : 'bg-[#1a1a1a] text-white hover:bg-gray-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!(currentQuestion.id in selectedAnswers)}
          className="rounded-lg bg-[#ffc62d] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd35f] disabled:opacity-50"
        >
          {isLastQuestion ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
} 