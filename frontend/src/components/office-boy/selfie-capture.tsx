'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SelfieCaptureProps {
  photo: string | null;
  onPhotoChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}

export function SelfieCapture({ photo, onPhotoChange, disabled }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError('');
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setCameraError('Camera access is required. Please allow camera permission and try again.');
      setCameraOn(false);
    }
  }, [stopCamera]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const maxWidth = 640;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    const width = Math.round(video.videoWidth * scale);
    const height = Math.round(video.videoHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    onPhotoChange(dataUrl);
    stopCamera();
  }, [onPhotoChange, stopCamera]);

  const retakePhoto = () => {
    onPhotoChange(null);
    startCamera();
  };

  useEffect(() => {
    if (!photo && !disabled) {
      startCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-black">Take your selfie</p>
        {photo && (
          <span className="flex items-center gap-1 text-xs font-medium text-[#0d955a]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Photo captured
          </span>
        )}
      </div>

      <p className="text-xs text-[#737373]">
        Required for attendance login. Stored on this device only.
      </p>

      {cameraError && (
        <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {cameraError}
          <button
            type="button"
            className="mt-2 w-full rounded-lg border border-[#edf1f3] bg-white py-2 text-sm font-medium"
            onClick={startCamera}
          >
            Retry Camera
          </button>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[10px] border border-[#edf1f3] bg-neutral-900">
        {photo ? (
          <img src={photo} alt="Your selfie" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="aspect-[4/3] w-full object-cover [-webkit-transform:scaleX(-1)] [transform:scaleX(-1)]"
          />
        )}
        {!photo && cameraOn && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-center text-xs text-white">
            Position your face in the frame
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!photo ? (
          <>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black py-3 text-sm font-semibold text-white disabled:opacity-60"
              onClick={capturePhoto}
              disabled={disabled || !cameraOn}
            >
              <Camera className="h-4 w-4" />
              Capture Photo
            </button>
            {!cameraOn && !cameraError && (
              <button
                type="button"
                className="rounded-lg border border-[#edf1f3] px-4 py-3 text-sm font-medium text-[#737373] disabled:opacity-60"
                onClick={startCamera}
                disabled={disabled}
              >
                Open Camera
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#edf1f3] py-3 text-sm font-medium text-black disabled:opacity-60"
            onClick={retakePhoto}
            disabled={disabled}
          >
            <RefreshCw className="h-4 w-4" />
            Retake Photo
          </button>
        )}
      </div>
    </div>
  );
}
