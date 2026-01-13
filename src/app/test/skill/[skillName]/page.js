'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { examsAPI } from '@/lib/api';
import { RingLoader } from 'react-spinners';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiBook, FiArrowRight, FiArrowLeft as FiPrev, FiAlertCircle, FiCamera } from 'react-icons/fi';
import Image from 'next/image';
import html2canvas from 'html2canvas';

export default function PublicExamPage() {
  const router = useRouter();
  const params = useParams();
  const skillName = params.skillName;
  const [questions, setQuestions] = useState([]);
  const [skill, setSkill] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // New states for single question view
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  
  // Camera and screenshot states
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [cameraCaptures, setCameraCaptures] = useState([]);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  
  // Refs for intervals and video
  const screenshotIntervalRef = useRef(null);
  const cameraIntervalRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const STORAGE_KEY_CHEATING = `exam_cheating_${skillName}`;
  const STORAGE_KEY_SCREENSHOTS = `exam_screenshots_${skillName}`;
  const STORAGE_KEY_CAMERA = `exam_camera_${skillName}`;

  useEffect(() => {
    setMounted(true);
    
    // Check for cheating flag in localStorage
    const cheatingFlag = localStorage.getItem(STORAGE_KEY_CHEATING);
    if (cheatingFlag === 'true') {
      setCheatingDetected(true);
    }
    
    // Load cached screenshots and camera captures
    const cachedScreenshots = localStorage.getItem(STORAGE_KEY_SCREENSHOTS);
    const cachedCamera = localStorage.getItem(STORAGE_KEY_CAMERA);
    if (cachedScreenshots) {
      try {
        setScreenshots(JSON.parse(cachedScreenshots));
      } catch (e) {
        console.error('Error loading cached screenshots:', e);
      }
    }
    if (cachedCamera) {
      try {
        setCameraCaptures(JSON.parse(cachedCamera));
      } catch (e) {
        console.error('Error loading cached camera captures:', e);
      }
    }
  }, [skillName]);

  // Tab/window visibility detection
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized window
        setCheatingDetected(true);
        localStorage.setItem(STORAGE_KEY_CHEATING, 'true');
      }
    };

    const handleBlur = () => {
      setCheatingDetected(true);
      localStorage.setItem(STORAGE_KEY_CHEATING, 'true');
    };

    const handleFocus = () => {
      // Still mark as cheating if they come back
      setCheatingDetected(true);
      localStorage.setItem(STORAGE_KEY_CHEATING, 'true');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [examStarted, examSubmitted]);

  const fetchExamData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const decodedSkillName = decodeURIComponent(skillName);
      console.log('Step 1: Fetching skill data for:', decodedSkillName);
      const skillData = await examsAPI.getQuestionsBySkillName(decodedSkillName, true);
      console.log('Skill data received:', skillData);
      
      if (!skillData || !skillData.id) {
        throw new Error(`Skill "${decodedSkillName}" not found. Please check the skill name and try again.`);
      }
      
      setSkill(skillData);
      setSkillId(skillData.id);
      
      console.log('Step 2: Fetching questions for skillId:', skillData.id);
      const questionsData = await examsAPI.getQuestions(skillData.id, true);
      console.log('Questions data received:', questionsData);
      
      if (Array.isArray(questionsData)) {
        setQuestions(questionsData);
      } else {
        console.warn('Questions data is not an array:', questionsData);
        setQuestions([]);
      }
      
      const questionsList = Array.isArray(questionsData) ? questionsData : [];
      const initialAnswers = {};
      questionsList.forEach((q) => {
        if (q && q.id) {
          initialAnswers[q.id] = [];
        }
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err.message || 'Failed to load exam. Please try again.');
      console.error('Error fetching exam data:', err);
      setQuestions([]);
      setSkill(null);
      setSkillId(null);
    } finally {
      setLoading(false);
    }
  }, [skillName]);

  useEffect(() => {
    if (skillName && mounted) {
      fetchExamData();
    }
  }, [skillName, mounted, fetchExamData]);

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false 
      });
      
      console.log('Camera permission granted. Stream active:', stream.active);
      setCameraStream(stream);
      setCameraPermissionGranted(true);
      
      // Set up video element and wait for it to be ready
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Ensure video plays
        try {
          await videoRef.current.play();
          console.log('Video play() called successfully');
        } catch (playErr) {
          console.error('Error playing video:', playErr);
        }
        
        // Wait for video to be ready before proceeding (with timeout)
        return new Promise((resolve) => {
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds max wait
          
          const checkVideoReady = () => {
            attempts++;
            const video = videoRef.current;
            
            if (video && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
              // Video is ready (HAVE_CURRENT_DATA or higher) and has valid dimensions
              console.log('Video is ready. Dimensions:', video.videoWidth, 'x', video.videoHeight, 'ReadyState:', video.readyState);
              resolve(true);
            } else if (attempts >= maxAttempts) {
              console.warn('Video ready timeout after', maxAttempts, 'attempts. ReadyState:', video?.readyState, 'Dimensions:', video?.videoWidth, 'x', video?.videoHeight);
              // Still resolve true to allow exam to proceed
              resolve(true);
            } else {
              setTimeout(checkVideoReady, 100);
            }
          };
          
          // Start checking after a short delay
          setTimeout(checkVideoReady, 200);
        });
      }
      
      return true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access is required to take the exam. Please grant camera permission and refresh.');
      return false;
    }
  };

  // Capture screenshot - using ref to avoid stale closures
  const captureScreenshot = useCallback(async () => {
    try {
      console.log('Capturing screenshot...');
      // Use html2canvas to capture the entire page
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        logging: false,
        scale: 0.5, // Reduce size for performance
        allowTaint: true,
      });
      
      const screenshotDataUrl = canvas.toDataURL('image/png', 0.7);
      console.log('Screenshot captured, length:', screenshotDataUrl.length);
      
      // Update state and localStorage
      setScreenshots(prev => {
        const updated = [...prev, screenshotDataUrl];
        try {
          localStorage.setItem(STORAGE_KEY_SCREENSHOTS, JSON.stringify(updated));
          console.log('Screenshot saved to localStorage. Total:', updated.length);
        } catch (e) {
          console.error('Error saving screenshot to localStorage:', e);
        }
        return updated;
      });
      
      return screenshotDataUrl;
    } catch (err) {
      console.error('Error capturing screenshot:', err);
      return null;
    }
  }, []);

  // Capture camera image - using ref to avoid stale closures
  const captureCameraImage = useCallback(() => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas) {
        console.warn('Video or canvas ref not available');
        return null;
      }
      
      // Check if video is ready and has valid dimensions
      if (video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to image data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Camera capture taken, length:', imageDataUrl.length);
        
        // Update state and localStorage
        setCameraCaptures(prev => {
          const updated = [...prev, imageDataUrl];
          try {
            localStorage.setItem(STORAGE_KEY_CAMERA, JSON.stringify(updated));
            console.log('Camera capture saved to localStorage. Total:', updated.length);
          } catch (e) {
            console.error('Error saving camera capture to localStorage:', e);
          }
          return updated;
        });
        
        return imageDataUrl;
      } else {
        console.warn('Video not ready for capture. ReadyState:', video.readyState, 'Dimensions:', video.videoWidth, 'x', video.videoHeight);
        return null;
      }
    } catch (err) {
      console.error('Error capturing camera image:', err);
      return null;
    }
  }, []);

  // Start monitoring intervals
  useEffect(() => {
    if (!examStarted || examSubmitted || cheatingDetected) {
      // Clean up intervals if exam stopped
      if (screenshotIntervalRef.current) {
        clearInterval(screenshotIntervalRef.current);
        screenshotIntervalRef.current = null;
      }
      if (cameraIntervalRef.current) {
        clearInterval(cameraIntervalRef.current);
        cameraIntervalRef.current = null;
      }
      return;
    }

    console.log('Starting monitoring intervals...');

    // Capture initial screenshots immediately on exam start
    const initialCapture = async () => {
      console.log('Taking initial captures...');
      
      // Capture screenshot immediately
      try {
        await captureScreenshot();
        console.log('Initial screenshot captured');
      } catch (err) {
        console.error('Error capturing initial screenshot:', err);
      }
      
      // Wait for camera to be ready, then capture (try multiple times)
      let attempts = 0;
      const tryCameraCapture = () => {
        attempts++;
        const result = captureCameraImage();
        if (result) {
          console.log('Initial camera capture successful');
        } else if (attempts < 10) {
          // Try again after 500ms
          setTimeout(tryCameraCapture, 500);
        } else {
          console.warn('Initial camera capture failed after multiple attempts');
        }
      };
      
      // Start trying after 1 second
      setTimeout(tryCameraCapture, 1000);
    };
    
    // Start initial captures
    initialCapture();

    // Start screenshot interval (every 30 seconds)
    screenshotIntervalRef.current = setInterval(async () => {
      console.log('Interval: Capturing screenshot...');
      try {
        await captureScreenshot();
      } catch (err) {
        console.error('Error in screenshot interval:', err);
      }
    }, 30000);

    // Start camera capture interval (every 30 seconds)
    cameraIntervalRef.current = setInterval(() => {
      console.log('Interval: Capturing camera image...');
      try {
        captureCameraImage();
      } catch (err) {
        console.error('Error in camera interval:', err);
      }
    }, 30000);

    return () => {
      console.log('Cleaning up intervals...');
      if (screenshotIntervalRef.current) {
        clearInterval(screenshotIntervalRef.current);
        screenshotIntervalRef.current = null;
      }
      if (cameraIntervalRef.current) {
        clearInterval(cameraIntervalRef.current);
        cameraIntervalRef.current = null;
      }
    };
  }, [examStarted, examSubmitted, cheatingDetected, captureScreenshot, captureCameraImage]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const handleStartExam = async () => {
    if (!candidateName.trim()) {
      setError('Please enter your name to start the exam.');
      return;
    }

    // Request camera permission before starting
    const permissionGranted = await requestCameraPermission();
    if (!permissionGranted) {
      return;
    }

    setExamStarted(true);
    setStartTime(new Date());
    setError('');
    setCurrentQuestionIndex(0);
  };

  const handleOptionChange = (questionId, optionId, isMultiSelect) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      
      if (isMultiSelect) {
        if (currentAnswers.includes(optionId)) {
          const updated = {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== optionId),
          };
          // Remove from skipped if answered
          if (updated[questionId].length > 0) {
            setSkippedQuestions(prev => {
              const newSet = new Set(prev);
              newSet.delete(questionId);
              return newSet;
            });
          }
          return updated;
        } else {
          const updated = {
            ...prev,
            [questionId]: [...currentAnswers, optionId],
          };
          // Remove from skipped if answered
          setSkippedQuestions(prev => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
          });
          return updated;
        }
      } else {
        const updated = {
          ...prev,
          [questionId]: [optionId],
        };
        // Remove from skipped if answered
        setSkippedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
        return updated;
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const currentQuestion = questions[currentQuestionIndex];
      // Mark as skipped if not answered
      if (!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0) {
        setSkippedQuestions(prev => new Set(prev).add(currentQuestion.id));
      }
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!examStarted) return;

    // Check for skipped questions
    const allQuestionsAnswered = questions.every(q => 
      answers[q.id] && answers[q.id].length > 0
    );

    if (!allQuestionsAnswered) {
      setError('Please answer all questions before submitting. Skipped questions are marked at the top.');
      return;
    }

    if (!skillId) {
      setError('Unable to submit exam. Skill information is missing.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Stop intervals first to prevent new captures during submission
      if (screenshotIntervalRef.current) {
        clearInterval(screenshotIntervalRef.current);
        screenshotIntervalRef.current = null;
      }
      if (cameraIntervalRef.current) {
        clearInterval(cameraIntervalRef.current);
        cameraIntervalRef.current = null;
      }

      // Capture final screenshots and camera images before submission
      console.log('Capturing final screenshots and camera images before submission...');
      
      // Capture final screenshot
      let finalScreenshot = null;
      try {
        finalScreenshot = await captureScreenshot();
        console.log('Final screenshot captured:', finalScreenshot ? 'Success' : 'Failed');
      } catch (err) {
        console.error('Error capturing final screenshot:', err);
      }
      
      // Capture final camera image (try multiple times if needed)
      let finalCameraCapture = null;
      for (let i = 0; i < 3; i++) {
        try {
          finalCameraCapture = captureCameraImage();
          if (finalCameraCapture) {
            console.log('Final camera capture successful on attempt', i + 1);
            break;
          }
        } catch (err) {
          console.error(`Error capturing final camera image (attempt ${i + 1}):`, err);
        }
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Wait a moment to ensure captures are saved to state/localStorage
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get the latest captures from localStorage (most reliable source)
      let finalScreenshots = [];
      let finalCameraCaptures = [];
      
      try {
        const cachedScreenshots = localStorage.getItem(STORAGE_KEY_SCREENSHOTS);
        const cachedCamera = localStorage.getItem(STORAGE_KEY_CAMERA);
        
        if (cachedScreenshots) {
          finalScreenshots = JSON.parse(cachedScreenshots);
          console.log('Loaded screenshots from localStorage:', finalScreenshots.length);
        }
        if (cachedCamera) {
          finalCameraCaptures = JSON.parse(cachedCamera);
          console.log('Loaded camera captures from localStorage:', finalCameraCaptures.length);
        }
      } catch (err) {
        console.error('Error reading cached captures:', err);
      }
      
      // Fallback to state values if localStorage is empty
      if (finalScreenshots.length === 0 && screenshots.length > 0) {
        finalScreenshots = screenshots;
        console.log('Using screenshots from state:', finalScreenshots.length);
      }
      if (finalCameraCaptures.length === 0 && cameraCaptures.length > 0) {
        finalCameraCaptures = cameraCaptures;
        console.log('Using camera captures from state:', finalCameraCaptures.length);
      }
      
      console.log('Final submission data - Screenshots:', finalScreenshots.length, 'Camera Captures:', finalCameraCaptures.length);
      
      // Ensure we have at least some captures (even if empty arrays)
      if (!finalScreenshots || !Array.isArray(finalScreenshots)) finalScreenshots = [];
      if (!finalCameraCaptures || !Array.isArray(finalCameraCaptures)) finalCameraCaptures = [];
      
      // Log sample data to verify
      if (finalScreenshots.length > 0) {
        console.log('Sample screenshot (first 100 chars):', finalScreenshots[0].substring(0, 100));
      }
      if (finalCameraCaptures.length > 0) {
        console.log('Sample camera capture (first 100 chars):', finalCameraCaptures[0].substring(0, 100));
      }
      
      // Stop camera stream after capturing
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const submitData = {
        skillId: skillId,
        userId: 'public-user-id',
        candidateName: candidateName.trim(),
        examName: skill?.name || decodeURIComponent(skillName) || 'Exam',
        examStartTime: startTime?.toISOString(),
        answers: Object.keys(answers).map((questionId) => ({
          questionId: questionId,
          selectedOptionIds: answers[questionId] || [],
        })),
        screenshots: finalScreenshots,
        cameraCaptures: finalCameraCaptures,
      };

      console.log('Submit data:', {
        ...submitData,
        screenshots: `${submitData.screenshots.length} items`,
        cameraCaptures: `${submitData.cameraCaptures.length} items`
      });

      const resultData = await examsAPI.submit(submitData, true);
      setResult(resultData);
      setExamSubmitted(true);

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY_CHEATING);
      localStorage.removeItem(STORAGE_KEY_SCREENSHOTS);
      localStorage.removeItem(STORAGE_KEY_CAMERA);
    } catch (err) {
      setError(err.message || 'Failed to submit exam. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RingLoader color="#ED2024" size={60} loading={true} />
          <p className="text-[0.9rem] font-medium text-[#666]">Loading exam...</p>
        </div>
      </div>
    );
  }

  // Cheating detected screen
  if (cheatingDetected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-red-200 p-8 max-w-2xl mx-4">
          <div className="text-center">
            <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">Cheating Detected</h1>
            <p className="text-gray-600 mb-4">
              You have been detected switching screens or opening other applications during the exam.
              This is considered cheating and you cannot proceed with the exam.
            </p>
            <p className="text-sm text-gray-500">
              This flag has been saved. Please contact the administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !skill) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-red-200 p-8">
            <div className="text-center">
              <FiXCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-primary-black mb-2">Error Loading Exam</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-primary-black mb-4">
              {skill?.name || 'Exam'} - Instructions
            </h1>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Exam Details:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Total Questions: {Array.isArray(questions) ? questions.length : 0}</li>
                  <li>Skill: {skill?.name || 'N/A'}</li>
                  <li>Some questions may have multiple correct answers</li>
                  <li>Read each question carefully before answering</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>You must answer all questions before submitting</li>
                  <li>Camera access is required to take this exam</li>
                  <li>Screenshots and camera captures will be taken automatically every 30 seconds</li>
                  <li>Do not switch tabs or open other applications during the exam</li>
                  <li>You can navigate between questions using Previous/Next buttons</li>
                  <li>Once submitted, you cannot change your answers</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ED2024] focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleStartExam}
                disabled={!candidateName.trim()}
                className="cursor-pointer px-6 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Exam
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (examSubmitted && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-primary-black mb-2">Exam Submitted Successfully!</h1>
              <p className="text-gray-600">Your exam has been submitted and graded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Your Results:</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Score</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.overall?.score?.toFixed(2) || 0} / {result.overall?.maxScore || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.overall?.percentage || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.overall?.absoluteScore || '0 / 0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentile</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.overall?.percentile?.toFixed(1) || 'N/A'}%
                  </p>
                </div>
              </div>
            </div>

            {result.topics && result.topics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Topic-wise Breakdown:</h3>
                <div className="space-y-3">
                  {result.topics.map((topic, index) => (
                    <div key={index} className="bg-gray-50 rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{topic.topicName}</span>
                        <span className="text-sm text-gray-600">
                          {topic.absoluteScore}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Score: {topic.score?.toFixed(2) || 0} / {topic.maxScore || 0} ({topic.percentage || 0}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Thank you for taking the exam!</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const skippedQuestionIds = Array.from(skippedQuestions);
  const answeredCount = Object.keys(answers).filter(qId => answers[qId] && answers[qId].length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden video and canvas for camera and screenshots */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ 
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '320px', 
          height: '240px',
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
        onLoadedMetadata={() => {
          console.log('Video metadata loaded. Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
        }}
        onCanPlay={() => {
          console.log('Video can play. ReadyState:', videoRef.current?.readyState);
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
            });
          }
        }}
        onPlaying={() => {
          console.log('Video is playing');
        }}
      />
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
      />

      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                className="h-8 w-auto"
              />
              <h1 className="text-lg font-semibold text-primary-black">
                {skill?.name || 'Exam'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} / {questions.length}
              </div>
              {cameraPermissionGranted && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FiCamera className="h-4 w-4" />
                  <span>Camera Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Skipped Questions Alert */}
        {skippedQuestionIds.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="h-5 w-5" />
              <span className="font-semibold">Skipped Questions:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skippedQuestionIds.map((qId) => {
                const qIndex = questions.findIndex(q => q.id === qId);
                return (
                  <button
                    key={qId}
                    onClick={() => goToQuestion(qIndex)}
                    className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-sm font-medium transition-colors"
                  >
                    Question {qIndex + 1}
                  </button>
                );
              })}
            </div>
            <p className="text-sm mt-2">Please answer all questions before submitting.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Question Navigation Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id] && answers[q.id].length > 0;
            const isSkipped = skippedQuestions.has(q.id);
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(index)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-[#ED2024] text-white'
                    : isAnswered
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : isSkipped
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Single Question Display */}
        {currentQuestion ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-black">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              {currentQuestion.multiSelect && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Multiple Answers
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4">{currentQuestion.questionText}</p>

            {currentQuestion.difficultyLevel && (
              <p className="text-sm text-gray-500 mb-4">
                Difficulty: <span className="capitalize">{currentQuestion.difficultyLevel}</span>
              </p>
            )}

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id]?.includes(option.id) || false;
                return (
                  <label
                    key={option.id}
                    className={`flex items-start gap-3 p-3 rounded border-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#ED2024] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type={currentQuestion.multiSelect ? 'checkbox' : 'radio'}
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() =>
                        handleOptionChange(currentQuestion.id, option.id, currentQuestion.multiSelect)
                      }
                      className="mt-1"
                    />
                    <span className="flex-1 text-gray-700">{option.text}</span>
                  </label>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPrev className="h-4 w-4" />
                Previous
              </button>

              <div className="text-sm text-gray-600">
                Answered: {answeredCount} / {questions.length}
              </div>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="cursor-pointer flex items-center gap-2 px-6 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium"
                >
                  Next
                  <FiArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  disabled={submitting || answeredCount < questions.length}
                  className="cursor-pointer flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FiBook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No questions available</p>
            <p className="text-sm text-gray-500">Please check if the skill name is correct.</p>
          </div>
        )}
      </main>
    </div>
  );
}
