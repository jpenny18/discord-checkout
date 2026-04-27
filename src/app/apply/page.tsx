'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
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
    text: 'The mentorship program requires a one-time investment of $2,500 USD. Are you prepared to make this investment in your trading career?',
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

const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

const getAvailableDates = (): Date[] => {
  const dates: Date[] = [];
  const current = new Date();
  current.setDate(current.getDate() + 1);
  current.setHours(0, 0, 0, 0);

  while (dates.length < 10) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export default function ApplicationForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Booking states
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const calculateScore = (newAnswers: { [key: number]: any }) => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      if (question.scoringWeight) {
        maxScore += question.scoringWeight;
        
        if (question.type === 'textarea') {
          const answer = newAnswers[question.id] || '';
          const wordCount = answer.split(/\s+/).length;
          if (wordCount >= 50) totalScore += question.scoringWeight;
          else if (wordCount >= 30) totalScore += question.scoringWeight * 0.7;
          else if (wordCount >= 15) totalScore += question.scoringWeight * 0.4;
        } else if (question.scoringAnswers) {
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

  const qualifiesForBooking = (currentAnswers: { [key: number]: any }) => {
    const q11 = currentAnswers[11];
    return (
      q11 === "Yes, I'm ready to invest in my future" ||
      q11 === 'I need more information'
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const finalScore = calculateScore(answers);
      const applicationData = {
        answers,
        score: finalScore,
        status: qualifiesForBooking(answers) ? 'qualified' : 'review',
        timestamp: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'applications'), applicationData);
      setApplicationId(docRef.id);
      setScore(finalScore);
      setIsComplete(true);
    } catch (error) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsBookingSubmitting(true);
    setBookingError(null);

    try {
      const bookingData = {
        applicationId,
        applicantName: answers[1],
        applicantEmail: answers[2],
        applicantPhone: answers[3],
        date: selectedDate.toISOString(),
        time: selectedTime,
        status: 'scheduled',
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      if (applicationId) {
        await updateDoc(doc(db, 'applications', applicationId), {
          bookedCall: {
            date: selectedDate.toISOString(),
            time: selectedTime,
          },
        });
      }

      setBookingComplete(true);
    } catch (err) {
      setBookingError('Failed to book your call. Please try again.');
    } finally {
      setIsBookingSubmitting(false);
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

  // ─── Booking confirmation screen ────────────────────────────────────────────
  if (isComplete && qualifiesForBooking(answers) && bookingComplete) {
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
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Call is Booked!</h1>
          <p className="text-gray-400 mb-6">Get ready — Penny Pips will be on the line personally.</p>
          <div className="p-5 bg-[#111111] border border-[#ffc62d] rounded-xl mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-5 h-5 text-[#ffc62d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-[#ffc62d] font-semibold">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <p className="text-white text-lg font-medium">{selectedTime} CST</p>
            <p className="text-gray-400 text-sm mt-1">Strategy Call with Penny Pips</p>
          </div>
          <p className="text-gray-500 text-sm">
            A confirmation will be sent to <span className="text-gray-300">{answers[2]}</span>. We look forward to speaking with you!
          </p>
        </div>
      </div>
    );
  }

  // ─── Booking calendar screen (qualified) ────────────────────────────────────
  if (isComplete && qualifiesForBooking(answers)) {
    const availableDates = getAvailableDates();

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <Image
              src="/images/logo.png"
              alt="Ascendant Academy Logo"
              width={64}
              height={64}
              className="mx-auto rounded-full mb-5"
            />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Application Approved
            </div>
            <h1 className="text-2xl font-bold mb-2">Book Your Strategy Call</h1>
            <p className="text-gray-400">
              Schedule a personal 1-on-1 call directly with <span className="text-[#ffc62d] font-medium">Penny Pips</span> — not a sales rep.
            </p>
          </div>

          {/* Date Selection */}
          <div className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-6 mb-4">
            <h2 className="text-base font-semibold text-[#ffc62d] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Select a Date
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {availableDates.map((date, i) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                    className={`p-3 rounded-xl text-center transition-all border ${
                      isSelected
                        ? 'bg-[#ffc62d] border-[#ffc62d] text-black'
                        : 'bg-[#111111] border-gray-700 hover:border-[#ffc62d]/60 text-gray-300'
                    }`}
                  >
                    <div className={`text-xs font-medium mb-0.5 ${isSelected ? 'text-black/70' : 'text-gray-500'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-sm font-bold">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Selection */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-6 mb-4"
              >
                <h2 className="text-base font-semibold text-[#ffc62d] mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Select a Time
                </h2>
                <p className="text-gray-500 text-xs mb-4">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 rounded-xl text-sm font-medium text-center transition-all border ${
                          isSelected
                            ? 'bg-[#ffc62d] border-[#ffc62d] text-black'
                            : 'bg-[#111111] border-gray-700 hover:border-[#ffc62d]/60 text-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking Summary + Confirm */}
          <AnimatePresence>
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0A0A0A] border border-[#ffc62d]/40 rounded-xl p-6"
              >
                <h2 className="text-base font-semibold mb-4">Confirm Your Booking</h2>

                <div className="flex items-start gap-4 p-4 bg-[#111111] rounded-lg mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#ffc62d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Penny Pips</p>
                    <p className="text-gray-400 text-sm">Ascendant Academy — Strategy Call</p>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-[#ffc62d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-[#ffc62d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">{selectedTime} CST</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-[#ffc62d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300">{answers[2]}</span>
                  </div>
                </div>

                {bookingError && (
                  <p className="text-red-500 text-sm mb-4">{bookingError}</p>
                )}

                <button
                  onClick={handleBooking}
                  disabled={isBookingSubmitting}
                  className="w-full py-3 bg-[#ffc62d] text-black font-semibold rounded-xl hover:bg-[#ffd700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBookingSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-gray-600 text-xs mt-6">
            All times are in Mountain Standard Time (MST)
          </p>
        </div>
      </div>
    );
  }

  // ─── Under review screen ────────────────────────────────────────────────────
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
          <p className="text-gray-300 mb-8">
            Thank you for your interest in Ascendant ELITE. Penny Pips will review your application
            and contact you within 24 hours.
          </p>
          <div className="p-4 bg-[#111111] border border-gray-700 rounded-lg">
            <p className="text-gray-400">
              Watch your email at <span className="text-white">{answers[2]}</span> for updates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Application form ────────────────────────────────────────────────────────
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
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-4 mb-4">
            <div className="bg-[#111111] border border-[#ffc62d] rounded-xl p-4 w-full md:w-1/2 shadow">
              <h2 className="text-xl font-semibold text-[#ffc62d] mb-2 flex items-center justify-center">
                <span className="mr-2">1on1 Coaching</span>
                <span className="text-base text-white ml-2">with Penny Pips</span>
              </h2>
          
            </div>
          </div>
          <p className="text-gray-400">Fill out the form below to apply for this exclusive mentorship experience.</p>
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
