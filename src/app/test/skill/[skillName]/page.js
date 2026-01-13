'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { examsAPI } from '@/lib/api';
import { RingLoader } from 'react-spinners';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiBook, FiArrowRight, FiArrowLeft as FiPrev, FiAlertCircle, FiCamera } from 'react-icons/fi';
import Image from 'next/image';
import { toPng } from 'html-to-image';

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
  const [sessionId, setSessionId] = useState(null);
  const [userId] = useState('public-user-id'); // You can make this dynamic later
  
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
  
  const STORAGE_KEY_CHEATING = `exam_cheating_${skillName}`;
  const STORAGE_KEY_SESSION = `exam_session_${skillName}`;
  const STORAGE_KEY_SCREENSHOTS = `exam_screenshots_${skillName}`;
  const STORAGE_KEY_CAMERA = `exam_camera_${skillName}`;
  const STORAGE_KEY_WARNING_ACK = `exam_warning_ack_${skillName}`;
  const STORAGE_KEY_CHEATING_ATTEMPTS = `exam_cheating_attempts_${skillName}`;

  useEffect(() => {
    setMounted(true);
    
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

    console.log('Cheating detection:', { currentAttempts, newAttempts, isWarningAcknowledged });

    if (newAttempts === 1 && !isWarningAcknowledged) {
      // First offense - show warning modal
      console.log('First offense - showing warning modal');
      setShowWarningModal(true);
      cheatingDetectionLockRef.current = false;
    } else if (newAttempts >= 2) {
      // Second offense - ban the user (only if warning was acknowledged)
      if (isWarningAcknowledged) {
        console.log('Second offense - banning user');
        setCheatingDetected(true);
        localStorage.setItem(STORAGE_KEY_CHEATING, 'true');
        setShowWarningModal(false);
      } else {
        // If warning wasn't acknowledged yet, just show the warning
        console.log('Second offense but warning not acknowledged - showing warning');
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
      console.log('Step 1: Fetching skill data for:', decodedSkillName);
      const skillData = await examsAPI.getSkillByName(decodedSkillName, true);
      console.log('Skill data received:', skillData);
      
      if (!skillData || !skillData.id) {
        throw new Error(`Skill "${decodedSkillName}" not found. Please check the skill name and try again.`);
      }
      
      setSkill(skillData);
      setSkillId(skillData.id);
      
      console.log('Step 2: Fetching questions with sessionId for skillId:', skillData.id, 'userId:', userId, 'skillName:', decodedSkillName);
      const questionsResponse = await examsAPI.getQuestions(skillData.id, userId, true, decodedSkillName);
      console.log('Questions response received:', questionsResponse);
      
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
        console.log('SessionId stored:', receivedSessionId);
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
  }, [skillName, userId]);

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

  // Separate fallback screenshot creation function
  const createFallbackScreenshot = useCallback(async (currentSessionId) => {
    try {
      console.log('📸 Creating fallback screenshot...');
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
      console.log('✅ Fallback screenshot created, length:', fallbackDataUrl.length);
      
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
      console.log('📸 Capturing screenshot with html-to-image...');
      
      // Find the best target element
      const targetElement = document.querySelector('main') || 
                           document.querySelector('[class*="container"]') ||
                           document.querySelector('[class*="exam"]') ||
                           document.body;
      
      console.log('Target element:', targetElement.tagName, targetElement.className);
      
      // Capture with html-to-image (handles modern CSS natively)
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
      
      console.log('✅ Screenshot captured successfully! Length:', screenshotDataUrl.length, 'bytes');
      
      // Update state and localStorage
      setScreenshots(prev => {
        const updated = [...prev, screenshotDataUrl];
        try {
          localStorage.setItem(STORAGE_KEY_SCREENSHOTS, JSON.stringify(updated));
          console.log('💾 Screenshot saved to localStorage. Total screenshots:', updated.length);
        } catch (e) {
          console.error('Error saving screenshot to localStorage:', e);
        }
        return updated;
      });
      
      return screenshotDataUrl;
    } catch (err) {
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
            console.log('✅ Stream re-attached and video playing');
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
            console.log('🔧 Enabling video track...');
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
          console.log('▶️ Video play() called');
          // Wait a bit after play() to let video initialize
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (playErr) {
          console.warn('⚠️ Error playing video:', playErr);
        }
      }
      
      // Check if video is ready and has valid dimensions
      if (video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
        console.log(`✅ Video ready on attempt ${attempt + 1}. Dimensions: ${video.videoWidth}x${video.videoHeight}, ReadyState: ${video.readyState}`);
        return true;
      }
      
      console.log(`⏳ Waiting for video to be ready (attempt ${attempt + 1}/${maxAttempts}). ReadyState: ${video.readyState}, Dimensions: ${video.videoWidth}x${video.videoHeight}, Paused: ${video.paused}`);
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    console.warn('⚠️ Video not ready after all attempts');
    return false;
  }, [cameraStream]);

  // Capture camera image - async with retry logic
  const captureCameraImage = useCallback(async () => {
    try {
      console.log('📷 Capturing real camera image...');
      
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
        console.log('Creating temporary canvas for camera capture...');
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
      console.log('✅ Real camera capture taken! Length:', imageDataUrl.length, 'bytes', 
                 `(${video.videoWidth}x${video.videoHeight})`);
      
      // Update state and localStorage
      setCameraCaptures(prev => {
        const updated = [...prev, imageDataUrl];
        try {
          localStorage.setItem(STORAGE_KEY_CAMERA, JSON.stringify(updated));
          console.log('💾 Camera capture saved to localStorage. Total captures:', updated.length);
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
    console.log('🔍 sendAutomaticScreenshot called', {
      sessionId: !!sessionId,
      examStarted,
      examSubmitted,
      cheatingDetected
    });

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
      console.log('📸 Starting automatic screenshot capture...');
      
      // Capture screenshot
      let screenshotDataUrl = await captureScreenshot();
      console.log('📸 Screenshot capture result:', screenshotDataUrl ? 'Success' : 'Failed', screenshotDataUrl ? `length: ${screenshotDataUrl.length}` : '');
      
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
          console.log('✅ Fallback screenshot created in sendAutomaticScreenshot, length:', screenshotDataUrl.length);
        } catch (fallbackErr) {
          console.error('❌ Could not create fallback screenshot:', fallbackErr);
          return; // Can't proceed without any image
        }
      }
      console.log('✅ Screenshot ready, length:', screenshotDataUrl.length);

      // Convert screenshot to Blob and create FormData
      console.log('🔄 Converting screenshot to Blob...');
      let screenshotBlob;
      try {
        screenshotBlob = dataURLtoBlob(screenshotDataUrl);
        console.log('✅ Blob created, size:', screenshotBlob.size);
      } catch (blobErr) {
        console.error('❌ Error converting to Blob:', blobErr);
        return;
      }
      
      const screenshotFile = new File([screenshotBlob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
      console.log('✅ File created:', screenshotFile.name, 'size:', screenshotFile.size);
      
      const screenshotFormData = new FormData();
      screenshotFormData.append('file', screenshotFile);
      screenshotFormData.append('type', 'screencapture');
      screenshotFormData.append('sessionId', sessionId);
      console.log('✅ FormData created with keys:', Array.from(screenshotFormData.keys()));

      console.log('📤 Sending screenshot to proctoring API...', {
        fileSize: screenshotFile.size,
        fileName: screenshotFile.name,
        sessionId: sessionId,
        type: 'screencapture'
      });

      // Send to proctoring API (fire and forget - don't block UI)
      console.log('🚀 About to call examsAPI.proctoring...');
      examsAPI.proctoring(screenshotFormData, true)
        .then(async (response) => {
          console.log('✅ Automatic screenshot sent successfully to /api/v1/exams/proctoring:', response);
          
          // If response indicates camera capture needed, capture and send camera image
          if (response?.success === true) {
            console.log('📷 Response indicates camera capture needed');
            // Wait 5 seconds after screencapture before capturing camera image
            console.log('⏳ Waiting 5 seconds before camera capture...');
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

              console.log('📤 Sending camera image to proctoring API...', {
                fileSize: cameraFile.size,
                fileName: cameraFile.name,
                sessionId: sessionId,
                type: 'facecapture'
              });

              examsAPI.proctoring(cameraFormData, true).then(response => {
                console.log('✅ Camera image sent successfully to /api/v1/exams/proctoring:', response);
              }).catch(err => {
                console.error('❌ Error sending camera image:', err);
              });
            } else {
              console.warn('❌ Failed to capture camera image');
            }
          } else {
            console.log('ℹ️ Proctoring API did not request camera capture');
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
      console.log('📝 examsAPI.proctoring call initiated (async)');
    } catch (err) {
      console.error('❌ Error in automatic screenshot capture:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      // Don't throw - we don't want to break the exam flow
    }
  }, [sessionId, examStarted, examSubmitted, cheatingDetected, captureScreenshot, captureCameraImage]);

  // Proctoring API call - sends screenshot first, then camera if response is true
  const sendProctoringData = useCallback(async () => {
    if (!sessionId || !examStarted || examSubmitted || cheatingDetected) {
      return;
    }

    try {
      console.log('Starting proctoring check...');
      
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

      console.log('Sending screenshot to proctoring API...');
      const proctoringResponse = await examsAPI.proctoring(screenshotFormData, true);
      console.log('Proctoring response:', proctoringResponse);

      // Step 3: If response indicates we should capture camera (response.success === true)
      const shouldCaptureCamera = proctoringResponse?.success === true;

      if (shouldCaptureCamera) {
        console.log('Proctoring API returned success, capturing camera image...');
        
        // Wait 5 seconds after screencapture before capturing camera image
        console.log('⏳ Waiting 5 seconds before camera capture...');
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

          console.log('Sending camera image to proctoring API...');
          await examsAPI.proctoring(cameraFormData, true);
          console.log('Camera image sent successfully');
        } else {
          console.warn('Failed to capture camera image for proctoring');
        }
      } else {
        console.log('Proctoring API did not request camera capture');
      }
    } catch (err) {
      console.error('Error in proctoring check:', err);
      // Don't throw - we don't want to break the exam flow
    }
  }, [sessionId, examStarted, examSubmitted, cheatingDetected, captureScreenshot, captureCameraImage]);

  // Automatic screenshot capture every 30 seconds (silent, non-disruptive)
  useEffect(() => {
    console.log('🔄 Automatic screenshot useEffect triggered', {
      examStarted,
      examSubmitted,
      cheatingDetected,
      hasSessionId: !!sessionId
    });

    if (!examStarted || examSubmitted || cheatingDetected || !sessionId) {
      console.log('⏸️ Conditions not met, cleaning up interval');
      // Clean up interval if exam stopped
      if (screenshotIntervalRef.current) {
        clearInterval(screenshotIntervalRef.current);
        screenshotIntervalRef.current = null;
      }
      return;
    }

    console.log('✅ Starting automatic screenshot interval...');

    // Initial screenshot immediately
    console.log('🚀 Calling sendAutomaticScreenshot immediately');
    sendAutomaticScreenshot();

    // Start automatic screenshot interval (every 30 seconds)
    screenshotIntervalRef.current = setInterval(() => {
      console.log('⏰ Automatic screenshot interval: Capturing and sending...');
      sendAutomaticScreenshot();
    }, 30000);

    return () => {
      console.log('🧹 Cleaning up automatic screenshot interval...');
      if (screenshotIntervalRef.current) {
        clearInterval(screenshotIntervalRef.current);
        screenshotIntervalRef.current = null;
      }
    };
  }, [examStarted, examSubmitted, cheatingDetected, sessionId, sendAutomaticScreenshot]);

  // NOTE: Removed duplicate sendProctoringData interval
  // Only sendAutomaticScreenshot runs now (every 30 seconds)
  // It handles both screencapture and facecapture sequentially

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

  const handleOptionChange = async (questionId, optionId, isMultiSelect) => {
    let newSelectedOptions;
    
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      let updatedAnswers;
      
      if (isMultiSelect) {
        if (currentAnswers.includes(optionId)) {
          newSelectedOptions = currentAnswers.filter((id) => id !== optionId);
          updatedAnswers = {
            ...prev,
            [questionId]: newSelectedOptions,
          };
        } else {
          newSelectedOptions = [...currentAnswers, optionId];
          updatedAnswers = {
            ...prev,
            [questionId]: newSelectedOptions,
          };
        }
      } else {
        newSelectedOptions = [optionId];
        updatedAnswers = {
          ...prev,
          [questionId]: newSelectedOptions,
        };
      }
      
      // Remove from skipped if answered
      if (updatedAnswers[questionId] && updatedAnswers[questionId].length > 0) {
        setSkippedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
      }
      
      return updatedAnswers;
    });

    // Submit answer to backend if sessionId exists
    if (sessionId && examStarted && !examSubmitted) {
      try {
        const answerData = {
          sessionId: sessionId,
          questionId: questionId,
          selectedOptionIds: newSelectedOptions,
        };

        // Call submit-answer API (fire and forget - don't block UI)
        examsAPI.submitAnswer(answerData, true).catch(err => {
          console.error('Error submitting answer:', err);
          // Don't show error to user - answer is saved locally
        });
      } catch (err) {
        console.error('Error preparing answer submission:', err);
      }
    }
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

    if (!sessionId) {
      setError('Unable to submit exam. Session information is missing.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

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
          finalCameraCapture = await captureCameraImage();
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
      
      // Stop camera stream after capturing
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      // Backend only expects sessionId - all other data is retrieved from database using sessionId
      const submitData = {
        sessionId: sessionId,
      };

      console.log('Submitting exam with sessionId:', sessionId);

      const resultData = await examsAPI.submit(submitData, true);
      setResult(resultData);
      setExamSubmitted(true);

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY_CHEATING);
      localStorage.removeItem(STORAGE_KEY_SESSION);
      localStorage.removeItem(STORAGE_KEY_SCREENSHOTS);
      localStorage.removeItem(STORAGE_KEY_CAMERA);
      localStorage.removeItem(STORAGE_KEY_WARNING_ACK);
      localStorage.removeItem(STORAGE_KEY_CHEATING_ATTEMPTS);
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
