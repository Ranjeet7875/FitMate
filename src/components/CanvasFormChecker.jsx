import { useRef, useEffect, useState } from 'react';
import { drawFormGuide, calculateFormScore } from '../utils/canvasUtils';

const CanvasFormChecker = ({ isActive, onFormScore, onError }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [formScore, setFormScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    if (isActive && videoRef.current && canvasRef.current) {
      setTimeout(() => startCamera(), 100); // Ensure DOM is ready
    }
    return () => {
      stopCamera();
    };
  }, [isActive]);

  useEffect(() => {
    if (isVideoReady && isActive) {
      const interval = setInterval(() => {
        analyzeForm();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isVideoReady, isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play(); // Play the video stream
          setIsVideoReady(true);
        };

        videoRef.current.onerror = (e) => {
          setCameraError("Video playback error.");
          if (onError) onError(e);
        };
      }

      setCameraError(null);
    } catch (error) {
      console.error("Camera error:", error);
      setCameraError(error.message);
      if (onError) onError(error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const analyzeForm = () => {
    if (!canvasRef.current || !videoRef.current) return;

    setIsChecking(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const score = calculateFormScore(ctx, canvas.width, canvas.height);
    setFormScore(score);
    if (onFormScore) onFormScore(score);

    drawFormGuide(ctx, canvas.width, canvas.height, score);
    updateFeedback(score);
    setTimeout(() => setIsChecking(false), 50);
  };

  const updateFeedback = (score) => {
    if (score >= 90) {
      setFeedback('Excellent form! Keep it up!');
    } else if (score >= 70) {
      setFeedback('Good form. Minor adjustments needed.');
    } else if (score >= 50) {
      setFeedback('Fair form. Focus on alignment.');
    } else {
      setFeedback('Poor form. Check your posture.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!isActive) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600">Camera is off. Start a workout to begin form checking.</p>
      </div>
    );
  }

  if (cameraError) {
    return (
      <div className="bg-red-50 rounded-lg p-8 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium">{cameraError}</p>
        <p className="text-sm mt-2">Please check camera permissions and try again.</p>
        <button
          onClick={startCamera}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry Camera
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 w-full h-full"
      />

      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className={`text-2xl font-bold ${getScoreColor(formScore)}`}>
            {formScore}%
          </div>
          {isChecking && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{feedback}</p>
      </div>

      {!isVideoReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasFormChecker;
