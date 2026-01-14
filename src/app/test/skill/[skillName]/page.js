'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { examsAPI } from '@/lib/api';
import { RingLoader } from 'react-spinners';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiBook, FiArrowRight, FiArrowLeft as FiPrev, FiAlertCircle, FiCamera } from 'react-icons/fi';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import ExamInstructions from '@/components/ExamInstructions';
import ExamReport from '@/components/ExamReport';

export default function PublicExamPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
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
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  // Extract userId and username from URL query parameters
  const urlUserId = searchParams.get('userId') || 'public-user-id';
  const urlUsername = searchParams.get('username') || null;
  const [userId] = useState(urlUserId);
  const [username] = useState(urlUsername);
  
  // New states for single question view
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  
  // Camera and screenshot states
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [cameraCaptures, setCameraCaptures] = useState([]);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const [cheatingAttempts, setCheatingAttempts] = useState(0);
  
  // Refs for intervals and video
  const proctoringIntervalRef = useRef(null);
  const screenshotIntervalRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cheatingDetectionLockRef = useRef(false);
  const lastCheatingDetectionTimeRef = useRef(0);
  const timerIntervalRef = useRef(null);
  
  // Timer state - countdown from 40 minutes (2400 seconds)
  const [remainingTime, setRemainingTime] = useState(2400); // 40 minutes in seconds
  const EXAM_DURATION = 2400; // 40 minutes in seconds
  
  const STORAGE_KEY_CHEATING = `exam_cheating_${skillName}`;
  const STORAGE_KEY_SESSION = `exam_session_${skillName}`;
  const STORAGE_KEY_SCREENSHOTS = `exam_screenshots_${skillName}`;
  const STORAGE_KEY_CAMERA = `exam_camera_${skillName}`;
  const STORAGE_KEY_WARNING_ACK = `exam_warning_ack_${skillName}`;
  const STORAGE_KEY_CHEATING_ATTEMPTS = `exam_cheating_attempts_${skillName}`;
  const STORAGE_KEY_EXAM_STATE = `exam_state_${skillName}`;
  const STORAGE_KEY_ANSWERS = `exam_answers_${skillName}`;
  const STORAGE_KEY_RESULT = `exam_result_${skillName}`;
  const STORAGE_KEY_REMAINING_TIME = `exam_remaining_time_${skillName}`;

  // Format time as MM:SS or HH:MM:SS
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  // Update URL when question index changes
  const updateURL = useCallback((questionIndex = null, showReport = false) => {
    const baseUrl = `/test/skill/${encodeURIComponent(skillName)}`;
    
    // Preserve userId and username query parameters (use state values to preserve initial values)
    const preservedParams = [];
    if (userId && userId !== 'public-user-id') {
      preservedParams.push(`userId=${encodeURIComponent(userId)}`);
    }
    if (username) {
      preservedParams.push(`username=${encodeURIComponent(username)}`);
    }
    const preservedQuery = preservedParams.length > 0 ? `&${preservedParams.join('&')}` : '';
    
    if (showReport) {
      router.replace(`${baseUrl}?report${preservedQuery}`);
    } else if (questionIndex !== null) {
      router.replace(`${baseUrl}?question${questionIndex + 1}${preservedQuery}`);
    } else {
      const queryString = preservedParams.length > 0 ? `?${preservedParams.join('&')}` : '';
      router.replace(`${baseUrl}${queryString}`);
    }
  }, [router, skillName, userId, username]);

  useEffect(() => {
    setMounted(true);
    
    // Check URL parameters first
    const urlParam = searchParams.get('report') || searchParams.toString().match(/question(\d+)/)?.[1];
    
    // Check for cheating flag in localStorage
    const cheatingFlag = localStorage.getItem(STORAGE_KEY_CHEATING);
    if (cheatingFlag === 'true') {
      setCheatingDetected(true);
    }
    
    // Load warning acknowledgment status
    const warningAck = localStorage.getItem(STORAGE_KEY_WARNING_ACK);
    if (warningAck === 'true') {
      setWarningAcknowledged(true);
    }
    
    // Load cheating attempts count
    const attempts = localStorage.getItem(STORAGE_KEY_CHEATING_ATTEMPTS);
    if (attempts) {
      setCheatingAttempts(parseInt(attempts, 10) || 0);
    }
    
    // Load sessionId from localStorage if exists
    const cachedSessionId = localStorage.getItem(STORAGE_KEY_SESSION);
    if (cachedSessionId) {
      setSessionId(cachedSessionId);
    }
    
    // Load exam state from localStorage
    const cachedExamState = localStorage.getItem(STORAGE_KEY_EXAM_STATE);
    if (cachedExamState) {
      try {
        const examState = JSON.parse(cachedExamState);
        if (examState.examStarted) {
          setExamStarted(true);
          setStartTime(examState.startTime ? new Date(examState.startTime) : null);
          setCurrentQuestionIndex(examState.currentQuestionIndex || 0);
          setCameraPermissionGranted(examState.cameraPermissionGranted || false);
        }
        if (examState.examSubmitted) {
          setExamSubmitted(true);
        }
      } catch (e) {
        console.error('Error loading exam state:', e);
      }
    }
    
    // Load remaining time from localStorage
    const cachedRemainingTime = localStorage.getItem(STORAGE_KEY_REMAINING_TIME);
    if (cachedRemainingTime) {
      try {
        const remaining = parseInt(cachedRemainingTime, 10);
        if (!isNaN(remaining) && remaining >= 0) {
          setRemainingTime(remaining);
        }
      } catch (e) {
        console.error('Error loading remaining time:', e);
      }
    }
    
    // Load answers from localStorage
    const cachedAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
    if (cachedAnswers) {
      try {
        setAnswers(JSON.parse(cachedAnswers));
      } catch (e) {
        console.error('Error loading cached answers:', e);
      }
    }
    
    // Load result from localStorage
    const cachedResult = localStorage.getItem(STORAGE_KEY_RESULT);
    if (cachedResult) {
      try {
        setResult(JSON.parse(cachedResult));
        setExamSubmitted(true);
      } catch (e) {
        console.error('Error loading cached result:', e);
      }
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
    
    // Handle URL parameters and sync URL if needed
    const currentUrl = searchParams.toString();
    const hasReportParam = currentUrl.includes('report');
    const questionMatch = currentUrl.match(/question(\d+)/);
    
    if (hasReportParam && cachedResult) {
      // Already loaded result above, URL is correct
    } else if (questionMatch) {
      const questionNum = parseInt(questionMatch[1], 10);
      const questionIndex = questionNum - 1;
      if (cachedExamState && cachedExamState.examStarted) {
        setCurrentQuestionIndex(questionIndex);
        setExamStarted(true);
      }
    } else if (cachedExamState) {
      // State exists but URL doesn't match - sync URL
      if (cachedExamState.examSubmitted && cachedResult) {
        // Should show report
        updateURL(null, true);
      } else if (cachedExamState.examStarted) {
        // Should show current question
        const questionIndex = cachedExamState.currentQuestionIndex || 0;
        updateURL(questionIndex);
        setCurrentQuestionIndex(questionIndex);
      }
    }
  }, [skillName, searchParams, updateURL]);

  // Handle cheating detection with warning system
  const handleCheatingDetection = useCallback(() => {
    // Prevent multiple rapid triggers (debounce - max once per 2 seconds)
    const now = Date.now();
    if (now - lastCheatingDetectionTimeRef.current < 2000) {
      return;
    }
    lastCheatingDetectionTimeRef.current = now;

    // Prevent concurrent processing
    if (cheatingDetectionLockRef.current) {
      return;
    }
    cheatingDetectionLockRef.current = true;

    // Get current attempts from localStorage (more reliable than state)
    const currentAttempts = parseInt(localStorage.getItem(STORAGE_KEY_CHEATING_ATTEMPTS) || '0', 10);
    const isWarningAcknowledged = localStorage.getItem(STORAGE_KEY_WARNING_ACK) === 'true';
    
    const newAttempts = currentAttempts + 1;
    setCheatingAttempts(newAttempts);
    localStorage.setItem(STORAGE_KEY_CHEATING_ATTEMPTS, newAttempts.toString());

    if (newAttempts === 1 && !isWarningAcknowledged) {
      // First offense - show warning modal
      setShowWarningModal(true);
      cheatingDetectionLockRef.current = false;
    } else if (newAttempts >= 2) {
      // Second offense - ban the user (only if warning was acknowledged)
      if (isWarningAcknowledged) {
        setCheatingDetected(true);
        localStorage.setItem(STORAGE_KEY_CHEATING, 'true');
        setShowWarningModal(false);
      } else {
        // If warning wasn't acknowledged yet, just show the warning
        setShowWarningModal(true);
      }
      cheatingDetectionLockRef.current = false;
    } else {
      cheatingDetectionLockRef.current = false;
    }
  }, []);

  // Tab/window visibility detection
  useEffect(() => {
    if (!examStarted || examSubmitted || cheatingDetected || showWarningModal) return;

    let timeoutId = null;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized window
        // Clear any pending timeout and trigger detection
        if (timeoutId) clearTimeout(timeoutId);
        handleCheatingDetection();
      }
    };

    const handleBlur = () => {
      // Debounce blur events
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleCheatingDetection();
      }, 100);
    };

    const handleFocus = () => {
      // Don't trigger on focus - only on blur/hidden
      // Focus event fires when coming back, which would double-count
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [examStarted, examSubmitted, cheatingDetected, showWarningModal, handleCheatingDetection]);

  const fetchExamData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const decodedSkillName = decodeURIComponent(skillName);
      const skillData = await examsAPI.getSkillByName(decodedSkillName, true);
      
      if (!skillData || !skillData.id) {
        throw new Error(`Skill "${decodedSkillName}" not found. Please check the skill name and try again.`);
      }
      
      setSkill(skillData);
      setSkillId(skillData.id);
      
      // Use username if available, otherwise fall back to skill name
      const nameToPass = username || decodedSkillName;
      const questionsResponse = await examsAPI.getQuestions(skillData.id, userId, true, nameToPass);
      
      // Extract sessionId and questions from response
      let questionsData = [];
      let receivedSessionId = null;
      
      if (questionsResponse) {
        // Check if response has sessionId property
        if (questionsResponse.sessionId) {
          receivedSessionId = questionsResponse.sessionId;
        } else if (questionsResponse.data && questionsResponse.data.sessionId) {
          receivedSessionId = questionsResponse.data.sessionId;
        }
        
        // Extract questions array
        if (Array.isArray(questionsResponse)) {
          questionsData = questionsResponse;
        } else if (Array.isArray(questionsResponse.questions)) {
          questionsData = questionsResponse.questions;
        } else if (Array.isArray(questionsResponse.data)) {
          questionsData = questionsResponse.data;
        } else if (questionsResponse.data && Array.isArray(questionsResponse.data.questions)) {
          questionsData = questionsResponse.data.questions;
        }
      }
      
      // Store sessionId
      if (receivedSessionId) {
        setSessionId(receivedSessionId);
        localStorage.setItem(STORAGE_KEY_SESSION, receivedSessionId);
      } else {
        console.warn('No sessionId received from API');
      }
      
      if (Array.isArray(questionsData) && questionsData.length > 0) {
        setQuestions(questionsData);
      } else {
        console.warn('Questions data is not an array or is empty:', questionsData);
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
  }, [skillName, userId, username]);

  useEffect(() => {
    if (skillName && mounted) {
      fetchExamData();
    }
  }, [skillName, mounted, fetchExamData]);

  // Sync URL when questions load and exam state exists
  useEffect(() => {
    if (!mounted || !questions.length || loading) return;
    
    const cachedExamState = localStorage.getItem(STORAGE_KEY_EXAM_STATE);
    const currentUrl = searchParams.toString();
    const hasReport = currentUrl.includes('report');
    const questionMatch = currentUrl.match(/question(\d+)/);
    
    if (cachedExamState) {
      try {
        const examState = JSON.parse(cachedExamState);
        if (examState.examSubmitted) {
          const cachedResult = localStorage.getItem(STORAGE_KEY_RESULT);
          if (cachedResult && !hasReport) {
            updateURL(null, true);
          }
        } else if (examState.examStarted && !questionMatch) {
          // Exam started but URL doesn't have question parameter
          const questionIndex = examState.currentQuestionIndex || 0;
          if (questionIndex >= 0 && questionIndex < questions.length) {
            updateURL(questionIndex);
          }
        }
      } catch (e) {
        console.error('Error syncing URL:', e);
      }
    }
  }, [mounted, questions.length, loading, searchParams, updateURL]);

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false 
      });
      
      setCameraStream(stream);
      setCameraPermissionGranted(true);
      
      // Set up video element and wait for it to be ready
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Ensure video plays
        try {
          await videoRef.current.play();
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

  // Separate fallback screenshot creation function
  const createFallbackScreenshot = useCallback(async (currentSessionId) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(window.innerWidth, 1920);
      canvas.height = Math.min(window.innerHeight, 1080);
      const ctx = canvas.getContext('2d');
      
      // Create a more informative fallback screenshot
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add border
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Add text content
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Proctoring Screenshot', 30, 50);
      
      ctx.font = '18px Arial';
      ctx.fillText('Time: ' + new Date().toLocaleString(), 30, 85);
      ctx.fillText('Window Size: ' + window.innerWidth + 'x' + window.innerHeight, 30, 115);
      
      if (currentSessionId) {
        ctx.fillText('Session: ' + currentSessionId.substring(0, 30) + '...', 30, 145);
      }
      
      ctx.fillText('Note: This is a fallback screenshot due to CSS compatibility issues.', 30, 175);
      
      const fallbackDataUrl = canvas.toDataURL('image/png', 0.7);
      
      // Save to state and localStorage
      setScreenshots(prev => {
        const updated = [...prev, fallbackDataUrl];
        try {
          localStorage.setItem(STORAGE_KEY_SCREENSHOTS, JSON.stringify(updated));
        } catch (e) {
          console.error('Error saving fallback screenshot:', e);
        }
        return updated;
      });
      
      return fallbackDataUrl;
    } catch (fallbackErr) {
      console.error('❌ Fallback screenshot creation failed:', fallbackErr);
      return null;
    }
  }, []);

  // Capture screenshot using html-to-image (handles modern CSS like lab(), lch(), Tailwind v3+)
  const captureScreenshot = useCallback(async () => {
    try {
      // Temporarily ensure body has full height to capture everything
      const originalBodyHeight = document.body.style.height;
      const originalBodyOverflow = document.body.style.overflow;
      
      // Set body to full scrollable height to ensure complete capture
      const fullHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
      document.body.style.height = `${fullHeight}px`;
      document.body.style.overflow = 'visible';
      
      // Capture document.body to get the full page including header and all content
      const targetElement = document.body;
      
      // Capture with html-to-image (handles modern CSS natively)
      // This will capture the entire body including all visible content
      const screenshotDataUrl = await toPng(targetElement, {
        cacheBust: true,
        pixelRatio: 1,
        backgroundColor: '#ffffff',
        filter: (node) => {
          // Filter out video, canvas, and iframe elements
          return node.tagName !== 'VIDEO' && 
                 node.tagName !== 'CANVAS' && 
                 node.tagName !== 'IFRAME';
        },
      });
      
      // Restore original body styles
      document.body.style.height = originalBodyHeight;
      document.body.style.overflow = originalBodyOverflow;
      
      // Update state and localStorage
      setScreenshots(prev => {
        const updated = [...prev, screenshotDataUrl];
        try {
          localStorage.setItem(STORAGE_KEY_SCREENSHOTS, JSON.stringify(updated));
        } catch (e) {
          console.error('Error saving screenshot to localStorage:', e);
        }
        return updated;
      });
      
      return screenshotDataUrl;
    } catch (err) {
      // Restore original body styles in case of error
      if (document.body) {
        document.body.style.height = '';
        document.body.style.overflow = '';
      }
      
      console.error('❌ Error capturing screenshot with html-to-image:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      
      // Fallback to manual canvas screenshot
      const currentSessionId = sessionId || localStorage.getItem(STORAGE_KEY_SESSION) || null;
      return await createFallbackScreenshot(currentSessionId);
    }
  }, [createFallbackScreenshot, sessionId]);

  // Wait for video to be ready with retries
  const waitForVideoReady = useCallback(async (maxAttempts = 10, delayMs = 200) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const video = videoRef.current;
      
      if (!video) {
        console.warn(`⚠️ Video ref not available (attempt ${attempt + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }
      
      // Check if video stream is still active, re-attach if lost
      if (!video.srcObject) {
        console.warn('⚠️ Video srcObject is null, attempting to re-attach stream...');
        // Try to re-attach from cameraStream state
        if (cameraStream && cameraStream.active) {
          video.srcObject = cameraStream;
          try {
            await video.play();
            // Wait a bit for video to initialize
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (playErr) {
            console.warn('⚠️ Error playing video after re-attach:', playErr);
          }
        } else {
          console.warn('⚠️ Camera stream not available in state');
          return false;
        }
      }
      
      // Check stream status
      if (video.srcObject) {
        const stream = video.srcObject;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          if (videoTrack.readyState === 'ended') {
            console.warn('⚠️ Video track has ended, cannot capture');
            return false;
          }
          // Ensure track is enabled
          if (!videoTrack.enabled) {
            videoTrack.enabled = true;
          }
        } else {
          console.warn('⚠️ No video track found in stream');
          return false;
        }
      }
      
      // Try to play the video if it's paused or not playing
      if (video.paused || video.ended) {
        try {
          await video.play();
          // Wait a bit after play() to let video initialize
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (playErr) {
          console.warn('⚠️ Error playing video:', playErr);
        }
      }
      
      // Check if video is ready and has valid dimensions
      if (video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    console.warn('⚠️ Video not ready after all attempts');
    return false;
  }, [cameraStream]);

  // Capture camera image - async with retry logic
  const captureCameraImage = useCallback(async () => {
    try {
      // Wait for video to be ready (with retries)
      const isReady = await waitForVideoReady(10, 200);
      if (!isReady) {
        console.warn('⚠️ Video not ready after waiting, cannot capture');
        return null;
      }
      
      const video = videoRef.current;
      if (!video) {
        console.warn('⚠️ Video ref not available after wait');
        return null;
      }
      
      // Double-check video is ready
      if (video.readyState < video.HAVE_CURRENT_DATA || video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn('⚠️ Video still not ready after wait. ReadyState:', video.readyState, 
                    'Dimensions:', video.videoWidth, 'x', video.videoHeight);
        return null;
      }
      
      let canvas = canvasRef.current;
      
      // Create temporary canvas if ref is not available
      let tempCanvas = null;
      if (!canvas) {
        tempCanvas = document.createElement('canvas');
        canvas = tempCanvas;
      }
      
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to image data URL with high quality
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Update state and localStorage
      setCameraCaptures(prev => {
        const updated = [...prev, imageDataUrl];
        try {
          localStorage.setItem(STORAGE_KEY_CAMERA, JSON.stringify(updated));
        } catch (e) {
          console.error('Error saving camera capture to localStorage:', e);
        }
        return updated;
      });
      
      return imageDataUrl;
    } catch (err) {
      console.error('❌ Error capturing camera image:', err);
      return null;
    }
  }, [waitForVideoReady]);

  // Helper function to convert base64 data URL to Blob
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Automatic screenshot capture and send to API every 30 seconds
  const sendAutomaticScreenshot = useCallback(async () => {
    if (!sessionId) {
      console.warn('❌ No sessionId, skipping automatic screenshot');
      return;
    }
    if (!examStarted) {
      console.warn('❌ Exam not started, skipping automatic screenshot');
      return;
    }
    if (examSubmitted) {
      console.warn('❌ Exam already submitted, skipping automatic screenshot');
      return;
    }
    if (cheatingDetected) {
      console.warn('❌ Cheating detected, skipping automatic screenshot');
      return;
    }

    try {
      // Capture screenshot
      let screenshotDataUrl = await captureScreenshot();
      
      // If screenshot capture failed, create a minimal fallback image
      if (!screenshotDataUrl) {
        console.warn('❌ Screenshot capture failed, creating fallback image...');
        try {
          const fallbackCanvas = document.createElement('canvas');
          fallbackCanvas.width = 800;
          fallbackCanvas.height = 600;
          const ctx = fallbackCanvas.getContext('2d');
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
          ctx.fillStyle = '#000000';
          ctx.font = '24px Arial';
          ctx.fillText('Proctoring Screenshot', 20, 50);
          ctx.fillText('Time: ' + new Date().toLocaleString(), 20, 90);
          ctx.fillText('Session: ' + sessionId.substring(0, 20) + '...', 20, 130);
          screenshotDataUrl = fallbackCanvas.toDataURL('image/png', 0.7);
        } catch (fallbackErr) {
          console.error('❌ Could not create fallback screenshot:', fallbackErr);
          return; // Can't proceed without any image
        }
      }

      // Convert screenshot to Blob and create FormData
      let screenshotBlob;
      try {
        screenshotBlob = dataURLtoBlob(screenshotDataUrl);
      } catch (blobErr) {
        console.error('❌ Error converting to Blob:', blobErr);
        return;
      }
      
      const screenshotFile = new File([screenshotBlob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
      
      const screenshotFormData = new FormData();
      screenshotFormData.append('file', screenshotFile);
      screenshotFormData.append('type', 'screencapture');
      screenshotFormData.append('sessionId', sessionId);

      // Send to proctoring API (fire and forget - don't block UI)
      examsAPI.proctoring(screenshotFormData, true)
        .then(async (response) => {
          // If response indicates camera capture needed, capture and send camera image
          if (response?.success === true) {
            // Wait 5 seconds after screencapture before capturing camera image
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Capture camera image (now async with retry logic)
            const cameraDataUrl = await captureCameraImage();
            if (cameraDataUrl) {
              const cameraBlob = dataURLtoBlob(cameraDataUrl);
              const cameraFile = new File([cameraBlob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
              
              const cameraFormData = new FormData();
              cameraFormData.append('file', cameraFile);
              cameraFormData.append('type', 'facecapture');
              cameraFormData.append('sessionId', sessionId);

              examsAPI.proctoring(cameraFormData, true).catch(err => {
                console.error('❌ Error sending camera image:', err);
              });
            } else {
              console.warn('❌ Failed to capture camera image');
            }
          }
        })
        .catch(err => {
          console.error('❌ Error sending automatic screenshot to /api/v1/exams/proctoring:', err);
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          // Don't show error to user - silent failure
        });
    } catch (err) {
      console.error('❌ Error in automatic screenshot capture:', err);
      // Don't throw - we don't want to break the exam flow
    }
  }, [sessionId, examStarted, examSubmitted, cheatingDetected, captureScreenshot, captureCameraImage]);

  // Proctoring API call - sends screenshot first, then camera if response is true
  const sendProctoringData = useCallback(async () => {
    if (!sessionId || !examStarted || examSubmitted || cheatingDetected) {
      return;
    }

    try {
      // Step 1: Capture screenshot
      const screenshotDataUrl = await captureScreenshot();
      if (!screenshotDataUrl) {
        console.warn('Failed to capture screenshot for proctoring');
        return;
      }

      // Step 2: Convert screenshot to Blob and create FormData
      const screenshotBlob = dataURLtoBlob(screenshotDataUrl);
      const screenshotFile = new File([screenshotBlob], 'screenshot.png', { type: 'image/png' });
      
      const screenshotFormData = new FormData();
      screenshotFormData.append('file', screenshotFile);
      screenshotFormData.append('type', 'screencapture');
      screenshotFormData.append('sessionId', sessionId);

      const proctoringResponse = await examsAPI.proctoring(screenshotFormData, true);

      // Step 3: If response indicates we should capture camera (response.success === true)
      const shouldCaptureCamera = proctoringResponse?.success === true;

      if (shouldCaptureCamera) {
        // Wait 5 seconds after screencapture before capturing camera image
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Capture camera image (now async with retry logic)
        const cameraDataUrl = await captureCameraImage();
        if (cameraDataUrl) {
          // Convert camera image to Blob and create FormData
          const cameraBlob = dataURLtoBlob(cameraDataUrl);
          const cameraFile = new File([cameraBlob], 'camera.jpg', { type: 'image/jpeg' });
          
          const cameraFormData = new FormData();
          cameraFormData.append('file', cameraFile);
          cameraFormData.append('type', 'facecapture');
          cameraFormData.append('sessionId', sessionId);

          await examsAPI.proctoring(cameraFormData, true);
        } else {
          console.warn('Failed to capture camera image for proctoring');
        }
      }
    } catch (err) {
      console.error('Error in proctoring check:', err);
      // Don't throw - we don't want to break the exam flow
    }
  }, [sessionId, examStarted, examSubmitted, cheatingDetected, captureScreenshot, captureCameraImage]);

  // Automatic screenshot capture every 30 seconds (silent, non-disruptive)
  useEffect(() => {
    if (!examStarted || examSubmitted || cheatingDetected || !sessionId) {
      // Clean up interval if exam stopped
      if (screenshotIntervalRef.current) {
        clearInterval(screenshotIntervalRef.current);
        screenshotIntervalRef.current = null;
      }
      return;
    }

    // Initial screenshot immediately
    sendAutomaticScreenshot();

    // Start automatic screenshot interval (every 30 seconds)
    screenshotIntervalRef.current = setInterval(() => {
      sendAutomaticScreenshot();
    }, 30000);

    return () => {
      if (screenshotIntervalRef.current) {
        clearInterval(screenshotIntervalRef.current);
        screenshotIntervalRef.current = null;
      }
    };
  }, [examStarted, examSubmitted, cheatingDetected, sessionId, sendAutomaticScreenshot]);

  // NOTE: Removed duplicate sendProctoringData interval
  // Only sendAutomaticScreenshot runs now (every 30 seconds)
  // It handles both screencapture and facecapture sequentially

  // Timer effect - countdown from 40 minutes, updates every second when exam is started
  useEffect(() => {
    if (!examStarted || examSubmitted || cheatingDetected) {
      // Clear timer if exam not started, submitted, or cheating detected
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    // Calculate remaining time based on start time
    const calculateRemainingTime = () => {
      if (!startTime) {
        // If no start time, use stored remaining time or default to 40 minutes
        const cached = localStorage.getItem(STORAGE_KEY_REMAINING_TIME);
        return cached ? parseInt(cached, 10) : EXAM_DURATION;
      }
      
      const now = new Date();
      const start = new Date(startTime);
      const elapsed = Math.floor((now - start) / 1000); // Elapsed time in seconds
      const remaining = Math.max(0, EXAM_DURATION - elapsed);
      return remaining;
    };

    // Set initial remaining time (recalculate to account for time passed while page was closed)
    const initialRemaining = calculateRemainingTime();
    setRemainingTime(initialRemaining);
    localStorage.setItem(STORAGE_KEY_REMAINING_TIME, initialRemaining.toString());

    // Update timer every second - recalculate based on start time to stay accurate
    timerIntervalRef.current = setInterval(() => {
      const currentRemaining = calculateRemainingTime();
      setRemainingTime(currentRemaining);
      localStorage.setItem(STORAGE_KEY_REMAINING_TIME, currentRemaining.toString());
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [examStarted, examSubmitted, cheatingDetected, startTime, EXAM_DURATION]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const handleStartExam = async () => {
    // Request camera permission before starting
    const permissionGranted = await requestCameraPermission();
    if (!permissionGranted) {
      return;
    }

    const startTimeNow = new Date();
    setExamStarted(true);
    setStartTime(startTimeNow);
    setError('');
    setCurrentQuestionIndex(0);
    
    // Initialize timer to 40 minutes
    setRemainingTime(EXAM_DURATION);
    localStorage.setItem(STORAGE_KEY_REMAINING_TIME, EXAM_DURATION.toString());
    
    // Save exam state to localStorage
    const examState = {
      examStarted: true,
      startTime: startTimeNow.toISOString(),
      currentQuestionIndex: 0,
      cameraPermissionGranted: true
    };
    localStorage.setItem(STORAGE_KEY_EXAM_STATE, JSON.stringify(examState));
    
    // Update URL to first question
    updateURL(0);
  };

  const handleOptionChange = async (questionId, optionId) => {
    // Calculate new selected options from current state BEFORE updating
    // This ensures we always have the correct value to send to the API
    const currentAnswers = answers[questionId] || [];
    let newSelectedOptions;
    
    // Always allow multiple selections - toggle option on/off
    if (currentAnswers.includes(optionId)) {
      newSelectedOptions = currentAnswers.filter((id) => id !== optionId);
    } else {
      newSelectedOptions = [...currentAnswers, optionId];
    }
    
    // Ensure newSelectedOptions is always an array
    if (!Array.isArray(newSelectedOptions)) {
      console.warn('newSelectedOptions is not an array, defaulting to empty array');
      newSelectedOptions = [];
    }
    
    // Update state with the new selected options using functional update
    // This ensures we use the latest state even if there are rapid clicks
    setAnswers((prev) => {
      // Recalculate from the latest state to handle rapid clicks
      const latestAnswers = prev[questionId] || [];
      let latestSelectedOptions;
      
      if (latestAnswers.includes(optionId)) {
        latestSelectedOptions = latestAnswers.filter((id) => id !== optionId);
      } else {
        latestSelectedOptions = [...latestAnswers, optionId];
      }
      
      // Use the recalculated value to ensure consistency
      const updatedAnswers = {
        ...prev,
        [questionId]: Array.isArray(latestSelectedOptions) ? latestSelectedOptions : [],
      };
      
      // Remove from skipped if answered
      if (latestSelectedOptions.length > 0) {
        setSkippedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
      }
      
      // Save answers to localStorage immediately
      try {
        localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(updatedAnswers));
      } catch (e) {
        console.error('Error saving answers:', e);
      }
      
      return updatedAnswers;
    });

    // Note: API call removed from here - will be called only when Next button is clicked
  };

  // Helper function to submit answer for a specific question
  const submitAnswerForQuestion = useCallback((questionId) => {
    if (!sessionId || !examStarted || examSubmitted) {
      return;
    }

    // Get current selected options for this question
    const selectedOptionIds = answers[questionId] || [];
    
    // Validation: Only call API if selectedOptionIds is a non-empty array
    if (!Array.isArray(selectedOptionIds) || selectedOptionIds.length === 0) {
      console.log('Skipping API call - no options selected for question:', questionId);
      return;
    }

    try {
      const answerData = {
        sessionId: sessionId,
        questionId: questionId,
        selectedOptionIds: selectedOptionIds,
      };

      // Final validation - ensure we're sending a valid array
      if (!Array.isArray(answerData.selectedOptionIds) || answerData.selectedOptionIds.length === 0) {
        console.warn('Invalid selectedOptionIds, skipping API call:', answerData.selectedOptionIds);
        return;
      }

      // Call submit-answer API (fire and forget - don't block UI)
      examsAPI.submitAnswer(answerData, true).catch(err => {
        console.error('Error submitting answer:', err);
        // Don't show error to user - answer is saved locally
      });
    } catch (err) {
      console.error('Error preparing answer submission:', err);
    }
  }, [sessionId, examStarted, examSubmitted, answers]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Submit answer for current question before moving to next
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && currentQuestion.id) {
        submitAnswerForQuestion(currentQuestion.id);
      }
      
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      
      // Update URL and save state
      updateURL(newIndex);
      const examState = {
        examStarted: true,
        startTime: startTime?.toISOString(),
        currentQuestionIndex: newIndex,
        cameraPermissionGranted
      };
      localStorage.setItem(STORAGE_KEY_EXAM_STATE, JSON.stringify(examState));
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      
      // Update URL and save state
      updateURL(newIndex);
      const examState = {
        examStarted: true,
        startTime: startTime?.toISOString(),
        currentQuestionIndex: newIndex,
        cameraPermissionGranted
      };
      localStorage.setItem(STORAGE_KEY_EXAM_STATE, JSON.stringify(examState));
    }
  };

  const handleSubmitExam = async () => {
    if (!examStarted) return;

    if (!skillId) {
      setError('Unable to submit exam. Skill information is missing.');
      return;
    }

    if (!sessionId) {
      setError('Unable to submit exam. Session information is missing.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Submit answer for current question before final submission
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && currentQuestion.id) {
        submitAnswerForQuestion(currentQuestion.id);
      }

      // Stop intervals first to prevent new captures during submission
      if (proctoringIntervalRef.current) {
        clearInterval(proctoringIntervalRef.current);
        proctoringIntervalRef.current = null;
      }
      if (screenshotIntervalRef.current) {
        clearInterval(screenshotIntervalRef.current);
        screenshotIntervalRef.current = null;
      }

      // Capture final screenshots and camera images before submission
      // Capture final screenshot
      let finalScreenshot = null;
      try {
        finalScreenshot = await captureScreenshot();
      } catch (err) {
        console.error('Error capturing final screenshot:', err);
      }
      
      // Capture final camera image (try multiple times if needed)
      let finalCameraCapture = null;
      for (let i = 0; i < 3; i++) {
        try {
          finalCameraCapture = await captureCameraImage();
          if (finalCameraCapture) {
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
        }
        if (cachedCamera) {
          finalCameraCaptures = JSON.parse(cachedCamera);
        }
      } catch (err) {
        console.error('Error reading cached captures:', err);
      }
      
      // Fallback to state values if localStorage is empty
      if (finalScreenshots.length === 0 && screenshots.length > 0) {
        finalScreenshots = screenshots;
      }
      if (finalCameraCaptures.length === 0 && cameraCaptures.length > 0) {
        finalCameraCaptures = cameraCaptures;
      }
      
      // Ensure we have at least some captures (even if empty arrays)
      if (!finalScreenshots || !Array.isArray(finalScreenshots)) finalScreenshots = [];
      if (!finalCameraCaptures || !Array.isArray(finalCameraCaptures)) finalCameraCaptures = [];
      
      // Stop camera stream after capturing
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      // Backend only expects sessionId - all other data is retrieved from database using sessionId
      const submitData = {
        sessionId: sessionId,
      };

      const resultData = await examsAPI.submit(submitData, true);
      setResult(resultData);
      setExamSubmitted(true);
      
      // Save result to localStorage
      localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(resultData));
      
      // Update exam state
      const examState = {
        examStarted: true,
        examSubmitted: true,
        startTime: startTime?.toISOString(),
        currentQuestionIndex: currentQuestionIndex,
        cameraPermissionGranted
      };
      localStorage.setItem(STORAGE_KEY_EXAM_STATE, JSON.stringify(examState));
      
      // Update URL to report page
      updateURL(null, true);

      // Clear localStorage (but keep result and state for refresh)
      // localStorage.removeItem(STORAGE_KEY_CHEATING);
      // localStorage.removeItem(STORAGE_KEY_SESSION);
      // localStorage.removeItem(STORAGE_KEY_SCREENSHOTS);
      // localStorage.removeItem(STORAGE_KEY_CAMERA);
      // localStorage.removeItem(STORAGE_KEY_WARNING_ACK);
      // localStorage.removeItem(STORAGE_KEY_CHEATING_ATTEMPTS);
    } catch (err) {
      setError(err.message || 'Failed to submit exam. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    
    // Update URL and save state
    updateURL(index);
    const examState = {
      examStarted: true,
      startTime: startTime?.toISOString(),
      currentQuestionIndex: index,
      cameraPermissionGranted
    };
    localStorage.setItem(STORAGE_KEY_EXAM_STATE, JSON.stringify(examState));
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

  // Handle warning modal acknowledgment
  const handleAcknowledgeWarning = () => {
    setWarningAcknowledged(true);
    setShowWarningModal(false);
    localStorage.setItem(STORAGE_KEY_WARNING_ACK, 'true');
    cheatingDetectionLockRef.current = false;
    
    // Check if there's already a second offense waiting
    const currentAttempts = parseInt(localStorage.getItem(STORAGE_KEY_CHEATING_ATTEMPTS) || '0', 10);
    if (currentAttempts >= 2) {
      // If they already had 2+ attempts, ban them now
      setCheatingDetected(true);
      localStorage.setItem(STORAGE_KEY_CHEATING, 'true');
    }
  };

  // Cheating detected screen (banned)
  if (cheatingDetected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-red-200 p-8 max-w-2xl mx-4">
          <div className="text-center">
            <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">Account Banned</h1>
            <p className="text-gray-600 mb-4">
              You have been detected switching screens or opening other applications during the exam multiple times.
              This is considered cheating and your account has been banned from taking this exam.
            </p>
            <p className="text-sm text-gray-500">
              This flag has been saved. Please contact the administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Warning Modal
  const WarningModal = () => {
    if (!showWarningModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg border border-yellow-200 p-8 max-w-2xl mx-4 shadow-xl">
          <div className="text-center">
            <FiAlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-600 mb-2">Warning: Suspicious Activity Detected</h1>
            <p className="text-gray-700 mb-4 text-left">
              We have detected that you may have switched tabs, minimized the window, or opened other applications during the exam.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4 text-left">
              <p className="text-sm font-semibold text-yellow-800 mb-2">Important Notice:</p>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>This is your first warning</li>
                <li>If you perform this activity again, your account will be <strong>banned</strong></li>
                <li>You will not be able to complete this exam if banned</li>
                <li>Please stay focused on the exam window</li>
              </ul>
            </div>
            <p className="text-gray-600 mb-6">
              Please acknowledge this warning and continue with your exam. Make sure to keep the exam window active at all times.
            </p>
            <button
              onClick={handleAcknowledgeWarning}
              className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors font-medium"
            >
              I Understand, Continue Exam
            </button>
          </div>
        </div>
      </div>
    );
  };

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
      <ExamInstructions
        skill={skill}
        questions={questions}
        onStartExam={handleStartExam}
        error={error}
      />
    );
  }

  // Check if URL has report parameter or exam is submitted
  const urlParam = searchParams.toString();
  const hasReport = urlParam.includes('report');
  const showReport = hasReport || (examSubmitted && result);

  if (showReport && result) {
    return <ExamReport result={result} skill={skill} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).filter(qId => answers[qId] && answers[qId].length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Modal */}
      <WarningModal />
      
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
          // Video metadata loaded
        }}
        onCanPlay={() => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
            });
          }
        }}
        onPlaying={() => {
          // Video is playing
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
              {examStarted && !examSubmitted && (
                <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded ${
                  remainingTime <= 300 
                    ? 'bg-red-100 text-red-700' 
                    : remainingTime <= 600 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <FiClock className="h-4 w-4" />
                  <span>{formatTime(remainingTime)}</span>
                </div>
              )}
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Question Navigation Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id] && answers[q.id].length > 0;
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(index)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
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

        {/* Single Question Display */}
        {currentQuestion ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary-black">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <div className="flex items-center gap-2">
                {answers[currentQuestion.id] && answers[currentQuestion.id].length > 0 && (
                  <span className="text-xs text-gray-600">
                    ({answers[currentQuestion.id].length} selected)
                  </span>
                )}
              </div>
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
                        ? 'border-[#4B5B71] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() =>
                        handleOptionChange(currentQuestion.id, option.id)
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
                  disabled={submitting}
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
