'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/utils/roleUtils';
import Image from 'next/image';
import Link from 'next/link';

interface CourseSection {
  title: string;
  content: React.ReactNode;
}

export default function TrainingPage() {
  const { user } = useAuth();
  const { role } = useRole();
  const [selectedCourse, setSelectedCourse] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // Course sections content - this would ideally come from a CMS or database
  const courseSections: CourseSection[] = [
    {
      title: 'Section 1 - Setup',
      content: 'Content for section 1'
    },
    {
      title: 'Section 2 - Setup',
      content: 'Content for section 2'
    },
    {
      title: 'Section 3 - Setup',
      content: 'Content for section 3'
    },
    {
      title: 'Section 4 - Setup',
      content: 'Content for section 4'
    },
    {
      title: 'Section 5 - Setup',
      content: 'Content for section 5'
    },
    {
      title: 'Section 6 - Setup',
      content: 'Content for section 6'
    }
  ];

  const handleLearnMore = (course: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedCourse(course);
    // Scroll to course content section with offset for mobile header
    const element = document.getElementById('course-content');
    if (element) {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      const offset = isMobile ? -100 : 0; // Add offset for mobile
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition + offset,
        behavior: 'smooth'
      });
    }
  };

  const handleGetStarted = async (course: 'beginner' | 'intermediate' | 'advanced' | 'mentorship') => {
    // Stripe payment links - replace these with your actual Stripe payment links
    const paymentLinks = {
      beginner: process.env.NEXT_PUBLIC_STRIPE_BEGINNER_COURSE_LINK,
      intermediate: process.env.NEXT_PUBLIC_STRIPE_INTERMEDIATE_COURSE_LINK,
      advanced: process.env.NEXT_PUBLIC_STRIPE_ADVANCED_COURSE_LINK,
      mentorship: process.env.NEXT_PUBLIC_STRIPE_MENTORSHIP_APPLICATION_LINK
    };

    if (course === 'mentorship') {
      // Open Typeform for mentorship application
      // Replace with your actual Typeform URL
      const typeformUrl = process.env.NEXT_PUBLIC_TYPEFORM_MENTORSHIP_URL;
      if (typeformUrl) {
        window.open(typeformUrl, '_blank');
      } else {
        console.error('Typeform URL not configured');
      }
    } else {
      // Redirect to Stripe payment link
      const paymentLink = paymentLinks[course];
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        console.error('Payment link not configured for', course);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Pricing Cards Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Beginners Education */}
        <div className="bg-[#111111] rounded-2xl p-5 flex flex-col">
          <h2 className="text-xl font-bold mb-1">Beginners Education</h2>
          <p className="text-gray-400 text-sm mb-3">Video/Text Course</p>
          <div className="text-3xl font-bold mb-4">$297</div>
          <ul className="space-y-2.5 flex-grow text-sm">
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              <span className="text-[#ffc62d]">Ascendant Traders</span>
              <span className="ml-1">have access</span>
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              40 video modules
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Platform Knowledge
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Chart Knowledge
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              MT4/MT5 Setup
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Crucial "Un-Brainwash Psychology" Videos
            </li>
          </ul>
          <button
            onClick={() => handleLearnMore('beginner')}
            className="mt-4 w-full bg-[#ffc62d] text-black py-2 rounded-lg text-sm font-semibold hover:bg-[#e6b229] transition-colors"
          >
            LEARN MORE
          </button>
        </div>

        {/* Intermediate Education */}
        <div className="bg-[#111111] rounded-2xl p-5 flex flex-col">
          <h2 className="text-xl font-bold mb-1">Intermediate Education</h2>
          <p className="text-gray-400 text-sm mb-3">Video/Text Course</p>
          <div className="text-3xl font-bold mb-4">$499</div>
          <ul className="space-y-2.5 flex-grow text-sm">
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              <span className="text-[#ffc62d]">Ascendant Challengers</span>
              <span className="ml-1">have access</span>
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              50 video modules
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Chart Breakdowns
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Foundational knowledge for strategy creation and implementation
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Trade Examples
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Risk Management
            </li>
          </ul>
          <button
            onClick={() => handleLearnMore('intermediate')}
            className="mt-4 w-full bg-[#ffc62d] text-black py-2 rounded-lg text-sm font-semibold hover:bg-[#e6b229] transition-colors"
          >
            LEARN MORE
          </button>
        </div>

        {/* Advanced Education */}
        <div className="bg-[#111111] rounded-2xl p-5 flex flex-col">
          <h2 className="text-xl font-bold mb-1">Advanced Education</h2>
          <p className="text-gray-400 text-sm mb-3">Video/Text Course</p>
          <div className="text-3xl font-bold mb-4">$999</div>
          <ul className="space-y-2.5 flex-grow text-sm">
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              <span className="text-[#ffc62d]">Ascendant Heroes</span>
              <span className="ml-1">have access</span>
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              30 video modules
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              3 Price Action Strategies
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Strategy and Edge Creation
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              Risk Management
            </li>
            <li className="flex items-center">
              <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
              VIP Chatroom with 6 & 7+ figure traders (verified earnings)
            </li>
          </ul>
          <button
            onClick={() => handleLearnMore('advanced')}
            className="mt-4 w-full bg-[#ffc62d] text-black py-2 rounded-lg text-sm font-semibold hover:bg-[#e6b229] transition-colors"
          >
            LEARN MORE
          </button>
        </div>
      </div>

      {/* Mentorship Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-[#111111] rounded-2xl p-5">
          <h2 className="text-xl font-bold mb-1">Ascendant Mentorship</h2>
          <p className="text-gray-400 text-sm mb-3">Live Daily Support</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Application ONLY</h3>
              <p className="text-gray-400 text-sm mb-4">$99 USD (25 Spots/month)</p>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center">
                  <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
                  5-7 Personalized Live Calls per week
                </li>
                <li className="flex items-center">
                  <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
                  Free 200K Challenge Account
                </li>
                <li className="flex items-center">
                  <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
                  Psychology Breakdown so we can understand what kind of trading will work the best for you
                </li>
                <li className="flex items-center">
                  <span className="text-[#ffc62d] mr-2 text-xs">✓</span>
                  Walk you through and support you through strategy and edge creation and most importantly implementation.
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <div className="bg-[#0a0a0a] p-5 rounded-xl">
                <p className="text-[#ffc62d] text-sm font-semibold mb-4">*ONLY FOR PEOPLE WHO WANT TO PURSUE TRADING AS A CAREER OTHERWISE WE WILL JUST FAIL AND WASTE BOTH OF OUR TIMES*</p>
                <button
                  onClick={() => handleGetStarted('mentorship')}
                  className="w-full bg-[#ffc62d] text-black py-2 rounded-lg text-sm font-semibold hover:bg-[#e6b229] transition-colors"
                >
                  APPLY NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      {selectedCourse && (
        <div id="course-content" className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Inside the {selectedCourse.charAt(0).toUpperCase() + selectedCourse.slice(1)} Course</h2>
          <div className="space-y-4">
            {courseSections.map((section, index) => (
              <div key={index} className="bg-[#1a1a1a] rounded-lg">
                <button
                  onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between"
                >
                  <span className="text-lg font-semibold">{section.title}</span>
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      expandedSection === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSection === index && (
                  <div className="px-6 py-4 border-t border-gray-700">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => handleGetStarted(selectedCourse)}
              className="bg-[#ffc62d] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#e6b229] transition-colors"
            >
              GET STARTED
            </button>
          </div>
        </div>
      )}
    </div>
  );
}