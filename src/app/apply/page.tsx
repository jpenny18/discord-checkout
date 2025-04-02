'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Question {
  id: number;
  text: string;
  type: 'text' | 'email' | 'tel' | 'radio' | 'textarea' | 'checkbox' | 'number';
  options?: string[];
  required: boolean;
  validation?: RegExp;
  errorMessage?: string;
  placeholder?: string;
  scoringWeight?: number;
  scoringAnswers?: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "What's your full name?",
    type: 'text',
    required: true,
    placeholder: 'John Doe',
    validation: /^[a-zA-Z\s]{2,50}$/,
    errorMessage: 'Please enter a valid name (2-50 characters)',
  },
  {
    id: 2,
    text: 'What\'s your email address?',
    type: 'email',
    required: true,
    placeholder: 'john@example.com',
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Please enter a valid email address',
  },
  {
    id: 3,
    text: 'What\'s your phone number?',
    type: 'tel',
    required: true,
    placeholder: '+1 (555) 123-4567',
    validation: /^\+?[\d\s-()]{10,}$/,
    errorMessage: 'Please enter a valid phone number',
  },
  {
    id: 4,
    text: 'How long have you been trading?',
    type: 'radio',
    options: [
      'Less than 6 months',
      '6 months to 1 year',
      '1-2 years',
      '2-5 years',
      'More than 5 years'
    ],
    required: true,
    scoringWeight: 2,
    scoringAnswers: ['2-5 years', 'More than 5 years'],
  },
  {
    id: 5,
    text: 'What\'s your average monthly trading profit?',
    type: 'radio',
    options: [
      'Not profitable yet',
      '$0-$1,000',
      '$1,000-$5,000',
      '$5,000-$10,000',
      '$10,000+',
    ],
    required: true,
    scoringWeight: 2,
    scoringAnswers: ['$5,000-$10,000', '$10,000+'],
  },
  {
    id: 6,
    text: 'How many hours per day can you dedicate to trading and learning?',
    type: 'radio',
    options: [
      'Less than 2 hours',
      '2-4 hours',
      '4-6 hours',
      '6-8 hours',
      'Full time',
    ],
    required: true,
    scoringWeight: 1,
    scoringAnswers: ['4-6 hours', '6-8 hours', 'Full time'],
  },
  {
    id: 7,
    text: 'Why do you want to become a professional trader?',
    type: 'textarea',
    required: true,
    placeholder: 'Share your motivation and goals...',
    scoringWeight: 3,
  },
  {
    id: 8,
    text: 'What trading strategies are you currently using?',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your trading approach...',
    scoringWeight: 2,
  },
  {
    id: 9,
    text: 'What\'s your current trading capital?',
    type: 'radio',
    options: [
      'Less than $5,000',
      '$5,000-$10,000',
      '$10,000-$25,000',
      '$25,000-$50,000',
      '$50,000+',
    ],
    required: true,
    scoringWeight: 1,
    scoringAnswers: ['$25,000-$50,000', '$50,000+'],
  },
  {
    id: 10,
    text: 'What are your biggest challenges in trading?',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your main obstacles...',
    scoringWeight: 2,
  },
  {
    id: 11,
    text: 'The mentorship program requires a one-time investment of $5,000 USD. Are you prepared to make this investment in your trading career?',
    type: 'radio',
    options: [
      'Yes, I\'m ready to invest in my future',
      'No, this is beyond my current budget',
      'I need more information',
    ],
    required: true,
    scoringWeight: 3,
    scoringAnswers: ['Yes, I\'m ready to invest in my future'],
  },
  {
    id: 12,
    text: 'Would you like to receive updates about your application via email and text?',
    type: 'checkbox',
    required: true,
    options: ['Yes, I consent to receive updates about my application.'],
  },
];

export default function ApplicationForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  const calculateScore = (newAnswers: { [key: number]: any }) => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      if (question.scoringWeight) {
        maxScore += question.scoringWeight;
        
        if (question.type === 'textarea') {
          // Score based on length and quality of response
          const answer = newAnswers[question.id] || '';
          const wordCount = answer.split(/\s+/).length;
          if (wordCount >= 50) totalScore += question.scoringWeight;
          else if (wordCount >= 30) totalScore += question.scoringWeight * 0.7;
          else if (wordCount >= 15) totalScore += question.scoringWeight * 0.4;
        } else if (question.scoringAnswers) {
          // Score based on preferred answers
          if (question.scoringAnswers.includes(newAnswers[question.id])) {
            totalScore += question.scoringWeight;
          }
        }
      }
    });

    return (totalScore / maxScore) * 100;
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    const answer = answers[currentQ.id];

    if (currentQ.required && !answer) {
      setError('This question is required');
      return;
    }

    if (currentQ.validation && !currentQ.validation.test(answer)) {
      setError(currentQ.errorMessage || 'Invalid input');
      return;
    }

    setError(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setError(null);
    }
  };

  const handleAnswer = (value: any) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);
    setScore(calculateScore(newAnswers));
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const finalScore = calculateScore(answers);
      const applicationData = {
        answers,
        score: finalScore,
        status: finalScore >= 70 ? 'qualified' : 'review',
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, 'applications'), applicationData);
      setIsComplete(true);
    } catch (error) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
        
        {question.type === 'text' && (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-3 bg-[#111111] border border-gray-700 rounded-lg focus:border-[#ffc62d] focus:outline-none transition-colors"
          />
        )}

        {question.type === 'email' && (
          <input
            type="email"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-3 bg-[#111111] border border-gray-700 rounded-lg focus:border-[#ffc62d] focus:outline-none transition-colors"
          />
        )}

        {question.type === 'tel' && (
          <input
            type="tel"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-3 bg-[#111111] border border-gray-700 rounded-lg focus:border-[#ffc62d] focus:outline-none transition-colors"
          />
        )}

        {question.type === 'textarea' && (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={question.placeholder}
            rows={5}
            className="w-full p-3 bg-[#111111] border border-gray-700 rounded-lg focus:border-[#ffc62d] focus:outline-none transition-colors"
          />
        )}

        {question.type === 'radio' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswer(option)}
                  className="form-radio text-[#ffc62d] focus:ring-[#ffc62d]"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'checkbox' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswer(option)}
                  className="form-checkbox text-[#ffc62d] focus:ring-[#ffc62d]"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-xl w-full mx-4 text-center">
          <div className="mb-8">
            <Image
              src="/images/logo.png"
              alt="Ascendant Academy Logo"
              width={80}
              height={80}
              className="mx-auto rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold mb-4">Application Submitted!</h1>
          {score >= 70 ? (
            <>
              <p className="text-gray-300 mb-8">
                Congratulations! Based on your responses, you qualify for a personal interview.
                Our team will contact you shortly to schedule a Zoom call.
              </p>
              <div className="p-4 bg-[#111111] border border-[#ffc62d] rounded-lg">
                <p className="text-[#ffc62d] font-semibold">
                  Next Steps: Watch for an email with your interview details
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-300 mb-8">
              Thank you for your interest in Ascendant ELITE. Our team will review your application
              and contact you within 2-3 business days.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Image
            src="/images/logo.png"
            alt="Ascendant Academy Logo"
            width={80}
            height={80}
            className="mx-auto rounded-full"
          />
          <h1 className="text-3xl font-bold mt-6 mb-2">Ascendant ELITE Application</h1>
          <p className="text-gray-400">Join our exclusive mentorship program</p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ffc62d] transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-6 mb-6"
            >
              {renderQuestion()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                currentQuestion === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-800'
                  : 'bg-[#111111] hover:bg-[#1a1a1a]'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#ffc62d] text-black rounded-lg hover:bg-[#ffd700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Submitting...'
                : currentQuestion === questions.length - 1
                ? 'Submit'
                : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 