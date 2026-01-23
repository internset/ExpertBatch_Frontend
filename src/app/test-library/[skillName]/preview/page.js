'use client';

import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';
import { 
  FiArrowLeft,
  FiArrowRight,
  FiBook,
  FiEye,
  FiX
} from 'react-icons/fi';
import Image from 'next/image';

export default function PreviewQuestionsPage() {
  const router = useRouter();
  const params = useParams();
  const skillName = params.skillName ? decodeURIComponent(params.skillName) : '';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Dummy questions data - 5 lorem ipsum questions
  const [questions] = useState([
    {
      id: 'preview-1',
      questionText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?',
      options: [
        { id: 'opt-1-1', text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris' },
        { id: 'opt-1-2', text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse' },
        { id: 'opt-1-3', text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa' },
        { id: 'opt-1-4', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem' }
      ],
      difficultyLevel: 'Intermediate'
    },
    {
      id: 'preview-2',
      questionText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam?',
      options: [
        { id: 'opt-2-1', text: 'Eaque ipsa quae ab illo inventore veritatis et quasi architecto' },
        { id: 'opt-2-2', text: 'Beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem' },
        { id: 'opt-2-3', text: 'Quia voluptas sit aspernatur aut odit aut fugit, sed quia' },
        { id: 'opt-2-4', text: 'Consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt' }
      ],
      difficultyLevel: 'Beginner'
    },
    {
      id: 'preview-3',
      questionText: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit?',
      options: [
        { id: 'opt-3-1', text: 'Sed quia non numquam eius modi tempora incidunt ut labore' },
        { id: 'opt-3-2', text: 'Et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima' },
        { id: 'opt-3-3', text: 'Veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam' },
        { id: 'opt-3-4', text: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel' }
      ],
      difficultyLevel: 'Advanced'
    },
    {
      id: 'preview-4',
      questionText: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti?',
      options: [
        { id: 'opt-4-1', text: 'Atque corrupti quos dolores et quas molestias excepturi sint' },
        { id: 'opt-4-2', text: 'Occaecati cupiditate non provident, similique sunt in culpa qui' },
        { id: 'opt-4-3', text: 'Officia deserunt mollitia animi, id est laborum et dolorum' },
        { id: 'opt-4-4', text: 'Fuga. Et harum quidem rerum facilis est et expedita distinctio' }
      ],
      difficultyLevel: 'Intermediate'
    },
    {
      id: 'preview-5',
      questionText: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat?',
      options: [
        { id: 'opt-5-1', text: 'Facere possimus, omnis voluptas assumenda est, omnis dolor repellendus' },
        { id: 'opt-5-2', text: 'Temporibus autem quibusdam et aut officiis debitis aut rerum' },
        { id: 'opt-5-3', text: 'Necessitatibus saepe eveniet ut et voluptates repudiandae sint' },
        { id: 'opt-5-4', text: 'Et molestiae non recusandae. Itaque earum rerum hic tenetur' }
      ],
      difficultyLevel: 'Beginner'
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (questionId, optionId) => {
    setSelectedAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      let newAnswers;
      
      if (currentAnswers.includes(optionId)) {
        newAnswers = currentAnswers.filter(id => id !== optionId);
      } else {
        newAnswers = [...currentAnswers, optionId];
      }
      
      return {
        ...prev,
        [questionId]: newAnswers
      };
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).filter(qId => selectedAnswers[qId] && selectedAnswers[qId].length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 sm:flex-initial">
              <Link
                href={`/test-library/${encodeURIComponent(skillName)}`}
                className="text-[#ED2024] hover:text-[#C91A1A] transition-colors"
              >
                <FiArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Preview: {skillName} Assessment
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto justify-start sm:justify-end">
              <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                Q {currentQuestionIndex + 1} / {questions.length}
              </div>
              <div className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-xs sm:text-sm font-medium">
                Preview Mode
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 sm:mb-6">
          <div className="flex items-start gap-3">
            <FiEye className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm sm:text-base text-blue-800 font-medium mb-1">
                Preview Mode - Sample Questions
              </p>
              <p className="text-xs sm:text-sm text-blue-700">
                This is a preview of the assessment format. These are sample questions (Lorem Ipsum) and do not represent actual exam content.
              </p>
            </div>
          </div>
        </div>

        {/* Question Navigation Pills */}
        <div className="mb-4 sm:mb-6 flex flex-wrap gap-1.5 sm:gap-2">
          {questions.map((q, index) => {
            const isAnswered = selectedAnswers[q.id] && selectedAnswers[q.id].length > 0;
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(index)}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors min-w-[32px] sm:min-w-[36px] ${
                  isCurrent
                    ? 'bg-[#4B5B71] text-white'
                    : isAnswered
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Question Display */}
        {currentQuestion ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {selectedAnswers[currentQuestion.id] && selectedAnswers[currentQuestion.id].length > 0 && (
                  <span className="text-xs text-gray-600 whitespace-nowrap">
                    ({selectedAnswers[currentQuestion.id].length} selected)
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 break-words leading-relaxed">
              {currentQuestion.questionText}
            </p>

            {currentQuestion.difficultyLevel && (
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 break-words">
                Difficulty: <span className="capitalize">{currentQuestion.difficultyLevel}</span>
              </p>
            )}

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswers[currentQuestion.id]?.includes(option.id) || false;
                return (
                  <label
                    key={option.id}
                    className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded border-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#4B5B71] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => handleOptionChange(currentQuestion.id, option.id)}
                      className="mt-0.5 sm:mt-2 flex-shrink-0"
                    />
                    <span className="flex-1 text-sm sm:text-base text-gray-700 break-words leading-relaxed">
                      {option.text}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
              >
                <FiArrowLeft className="h-4 w-4" />
                <span className="whitespace-nowrap">Previous</span>
              </button>

              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left order-1 sm:order-2 whitespace-nowrap">
                Answered: {answeredCount} / {questions.length}
              </div>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium text-sm sm:text-base order-3"
                >
                  <span className="whitespace-nowrap">Next</span>
                  <FiArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  href={`/test-library/${encodeURIComponent(skillName)}`}
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium text-sm sm:text-base order-3"
                >
                  <span className="whitespace-nowrap">Back to Details</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 text-center">
            <FiBook className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600 mb-2 break-words">No questions available</p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-6">
          <Link
            href={`/test-library/${encodeURIComponent(skillName)}`}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Assessment Details
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
