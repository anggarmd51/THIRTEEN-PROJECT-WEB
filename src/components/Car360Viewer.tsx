import React, { useRef, useState, useEffect, useCallback } from "react";
import { RotateCw, MoveHorizontal, Play, Pause, RefreshCw, AlertCircle } from "lucide-react";

interface Car360ViewerProps {
  videoUrl?: string;
  carName?: string;
  className?: string;
}

// Fallback public sample MP4 with CORS support and progressive byte streaming
export const FALLBACK_360_VIDEO_URL =
  "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4";

export default function Car360Viewer({
  videoUrl,
  carName = "Unit Mobil",
  className = "",
}: Car360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);

  const activeVideoUrl = videoUrl && videoUrl.trim() ? videoUrl.trim() : FALLBACK_360_VIDEO_URL;
  const isFallback = !videoUrl || !videoUrl.trim();

  // State
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);

  // Drag tracking refs
  const dragStartXRef = useRef<number>(0);
  const dragStartTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Set target video time using requestAnimationFrame for ultra-smooth performance
  const setVideoTimeTo = useCallback((targetTime: number) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const dur = videoRef.current.duration;
    if (!isFinite(dur) || dur <= 0) return;

    // Wrap around smoothly 0..dur
    let normalized = targetTime % dur;
    if (normalized < 0) normalized += dur;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = normalized;
        setCurrentTime(normalized);
      }
    });
  }, []);

  // Update current time on video timeupdate (for auto-spin or standard seek)
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDraggingRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (isFinite(dur) && dur > 0) {
        setDuration(dur);
        setIsLoaded(true);
        setHasError(false);
        // Position at start
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  // Drag Start (Mouse & Touch)
  const startDrag = useCallback(
    (clientX: number) => {
      if (!videoRef.current || !isLoaded) return;

      // Stop auto spin if user initiates manual drag
      if (isAutoSpinning) {
        videoRef.current.pause();
        setIsAutoSpinning(false);
      }

      isDraggingRef.current = true;
      setIsDragging(true);
      setHasInteracted(true);
      dragStartXRef.current = clientX;
      dragStartTimeRef.current = videoRef.current.currentTime;
    },
    [isLoaded, isAutoSpinning]
  );

  // Drag Move (Mouse & Touch)
  const moveDrag = useCallback(
    (clientX: number) => {
      if (!isDraggingRef.current || !videoRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width || 400;
      const deltaX = clientX - dragStartXRef.current;
      const dur = videoRef.current.duration;

      if (!isFinite(dur) || dur <= 0) return;

      // Dragging across the full container width scrubs through the entire 360-degree duration
      // Drag right moves rotation forward, drag left moves backwards
      const timeOffset = (deltaX / containerWidth) * dur;
      const targetTime = dragStartTimeRef.current + timeOffset;

      setVideoTimeTo(targetTime);
    },
    [setVideoTimeTo]
  );

  // Drag End
  const endDrag = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  }, []);

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX);
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      startDrag(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      moveDrag(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  // Global window mouse events while dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        moveDrag(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        endDrag();
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [moveDrag, endDrag]);

  // Toggle Auto Spin
  const toggleAutoSpin = () => {
    if (!videoRef.current) return;
    setHasInteracted(true);

    if (isAutoSpinning) {
      videoRef.current.pause();
      setIsAutoSpinning(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsAutoSpinning(true);
    }
  };

  // Reset rotation to 0°
  const handleReset = () => {
    if (!videoRef.current) return;
    if (isAutoSpinning) {
      videoRef.current.pause();
      setIsAutoSpinning(false);
    }
    setVideoTimeTo(0);
  };

  // Calculate current rotation degree (0° - 360°)
  const rotationDegree = duration > 0 ? Math.round((currentTime / duration) * 360) % 360 : 0;
  const progressRatio = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`border border-[#D4AF37]/30 bg-[#0E0F12] overflow-hidden select-none ${className}`}
    >
      {/* 360 Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#14161B] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider font-semibold">
            <RotateCw className="w-3 h-3 animate-spin-slow" />
            <span>360° INTERACTIVE VIEW</span>
          </div>
          {isFallback && (
            <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
              (Preview Mode)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-[#D4AF37]">
            {rotationDegree}°
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleAutoSpin}
              title={isAutoSpinning ? "Jeda Rotasi Otomatis" : "Putar Otomatis"}
              className="p-1.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
            >
              {isAutoSpinning ? (
                <>
                  <Pause className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono hidden md:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono hidden md:inline">Auto-Spin</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset ke Posisi Awal (0°)"
              className="p-1.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-xs flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Scrubbing Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative w-full h-[260px] sm:h-[340px] md:h-[380px] bg-black flex items-center justify-center overflow-hidden cursor-ew-resize touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        role="region"
        aria-label="Area interaktif 360 derajat mobil. Geser kiri atau kanan untuk memutar kendaraan."
      >
        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          src={activeVideoUrl}
          playsInline
          muted
          loop
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onError={handleError}
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* Loading / Buffering Overlay */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <RotateCw className="w-7 h-7 text-[#D4AF37] animate-spin mb-2" />
            <span className="text-xs font-mono text-neutral-400">
              Memuat visual 360° {carName}...
            </span>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-4 text-center">
            <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
            <span className="text-xs text-neutral-300 font-mono max-w-sm mb-3">
              Video 360° belum dapat dimuat. Pastikan URL video walkaround valid (.mp4).
            </span>
            <button
              type="button"
              onClick={() => {
                setHasError(false);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="px-3 py-1.5 bg-[#D4AF37] text-black font-semibold text-xs font-mono hover:bg-[#e0be47] transition-colors"
            >
              Coba Muat Ulang
            </button>
          </div>
        )}

        {/* Subtle Visual Hint Overlay (Fades out upon first interaction) */}
        {isLoaded && !hasError && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700 z-10 ${
              hasInteracted ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 px-5 py-3.5 shadow-2xl flex flex-col items-center gap-1.5 animate-pulse">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <MoveHorizontal className="w-5 h-5 animate-bounce-horizontal" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider">
                  Geser untuk memutar 360°
                </span>
              </div>
              <span className="text-[10px] text-neutral-300 font-sans text-center">
                Drag / swipe ke kiri atau kanan untuk melihat keliling unit
              </span>
            </div>
          </div>
        )}

        {/* Subtle Bottom Directional Hint on Hover/Active */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1 border border-white/10 text-[10px] font-mono text-neutral-300">
          <MoveHorizontal className="w-3 h-3 text-[#D4AF37]" />
          <span>{isDragging ? "Memutar Kendaraan..." : "Geser Kiri / Kanan"}</span>
        </div>

        {/* Rotation Degree Compass Watermark */}
        <div className="absolute top-3 right-3 pointer-events-none z-10 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[10px] font-mono text-[#D4AF37]">
          ROTASI: {rotationDegree}°
        </div>
      </div>

      {/* 360 Scrubbing Progress Track */}
      <div className="w-full bg-[#18191E] h-1.5 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#B38F24] via-[#D4AF37] to-[#F1D779] transition-all duration-75"
          style={{ width: `${progressRatio}%` }}
        ></div>
      </div>

      {/* Footer Notes */}
      <div className="px-4 py-2 bg-[#101216] flex items-center justify-between text-[10px] text-neutral-400 font-mono">
        <span>INTERACTIVE 360° SCRUBBER</span>
        <span>KONTROL: MOUSE DRAG / TOUCH SWIPE</span>
      </div>
    </div>
  );
}
