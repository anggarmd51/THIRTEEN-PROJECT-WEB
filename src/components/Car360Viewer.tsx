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

  // Direct DOM references for 60fps/120fps display updates without React re-render overhead
  const degreeHeaderRef = useRef<HTMLSpanElement>(null);
  const degreeWatermarkRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const activeVideoUrl = videoUrl && videoUrl.trim() ? videoUrl.trim() : FALLBACK_360_VIDEO_URL;
  const isFallback = !videoUrl || !videoUrl.trim();

  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);

  // Performance & physics refs (managed inside requestAnimationFrame loop)
  const isLoadedRef = useRef(false);
  const durationRef = useRef(0);
  const virtualTimeRef = useRef(0);
  const targetTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isAutoSpinningRef = useRef(false);
  const lastClientXRef = useRef(0);
  const lastMoveTimeRef = useRef(0);

  // Helper to directly update HUD displays (Degrees and Progress Track)
  const updateDisplay = useCallback((time: number, dur: number) => {
    if (dur <= 0) return;
    const deg = Math.round((time / dur) * 360) % 360;
    const pct = Math.min(100, Math.max(0, (time / dur) * 100));

    if (degreeHeaderRef.current) {
      degreeHeaderRef.current.textContent = `${deg}°`;
    }
    if (degreeWatermarkRef.current) {
      degreeWatermarkRef.current.textContent = `ROTASI: ${deg}°`;
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${pct}%`;
    }
  }, []);

  // Metadata Loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (isFinite(dur) && dur > 0) {
        durationRef.current = dur;
        virtualTimeRef.current = 0;
        targetTimeRef.current = 0;
        velocityRef.current = 0;
        isLoadedRef.current = true;
        setIsLoaded(true);
        setHasError(false);
        videoRef.current.currentTime = 0;
        updateDisplay(0, dur);
      }
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    isLoadedRef.current = false;
  };

  // Drag start
  const startDrag = useCallback((clientX: number) => {
    if (!videoRef.current || !isLoadedRef.current) return;

    if (isAutoSpinningRef.current) {
      setIsAutoSpinning(false);
      isAutoSpinningRef.current = false;
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    setHasInteracted(true);
    velocityRef.current = 0;
    lastClientXRef.current = clientX;
    lastMoveTimeRef.current = performance.now();
  }, []);

  // Drag move with velocity tracking
  const moveDrag = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    const deltaX = clientX - lastClientXRef.current;

    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width || 400;
    const dur = durationRef.current;

    if (dur > 0 && containerWidth > 0) {
      // Dragging across the full container width scrubs through the entire 360 duration
      const timeOffset = (deltaX / containerWidth) * dur;
      targetTimeRef.current += timeOffset;

      if (dt > 4) {
        const instantVelocity = (timeOffset / dt) * 1000;
        // Exponential moving average for smooth velocity
        velocityRef.current = velocityRef.current * 0.35 + instantVelocity * 0.65;
        lastMoveTimeRef.current = now;
        lastClientXRef.current = clientX;
      }
    }
  }, []);

  // Drag end with inertia momentum
  const endDrag = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);

      // Clamp inertia velocity to avoid endless wild spinning
      const dur = durationRef.current;
      const maxVelocity = dur * 2.5; // Max 2.5 rotations per second
      velocityRef.current = Math.max(-maxVelocity, Math.min(maxVelocity, velocityRef.current));
    }
  }, []);

  // Native Touch Event Listeners on container with { passive: false } to prevent mobile vertical jitter
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        // Prevent vertical scrolling on the page when user is scrubbing horizontally
        if (e.cancelable) {
          e.preventDefault();
        }
        moveDrag(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      endDrag();
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [startDrag, moveDrag, endDrag]);

  // Global Mouse listeners when dragging outside container bounds
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        moveDrag(e.clientX);
      }
    };

    const onMouseUp = () => {
      if (isDraggingRef.current) {
        endDrag();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [moveDrag, endDrag]);

  // Unified RequestAnimationFrame Loop: Lerp + Inertia + Auto-Spin
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const rawDelta = (now - lastTime) / 1000;
      const dt = Math.min(Math.max(rawDelta, 0.001), 0.1);
      lastTime = now;

      const dur = durationRef.current;
      const video = videoRef.current;

      if (dur > 0 && video && isLoadedRef.current) {
        // 1. Auto Spin Mode
        if (isAutoSpinningRef.current) {
          // 1 complete rotation every 9 seconds
          const spinSpeed = dur / 9;
          targetTimeRef.current += spinSpeed * dt;
          velocityRef.current = 0;
        }
        // 2. Inertia Momentum on Release
        else if (!isDraggingRef.current && Math.abs(velocityRef.current) > 0.01) {
          targetTimeRef.current += velocityRef.current * dt;
          // Fluid friction decay per frame
          const friction = Math.pow(0.91, dt * 60);
          velocityRef.current *= friction;
          if (Math.abs(velocityRef.current) < 0.01) {
            velocityRef.current = 0;
          }
        }

        // 3. Smooth Lerp Interpolation towards targetTime
        const lerpFactor = isDraggingRef.current ? 0.32 : 0.2;
        const t = 1 - Math.pow(1 - lerpFactor, dt * 60);
        virtualTimeRef.current += (targetTimeRef.current - virtualTimeRef.current) * t;

        // 4. Smooth cyclic wrap-around 0..dur
        let normalizedTime = ((virtualTimeRef.current % dur) + dur) % dur;

        // 5. Update HTML5 video currentTime smoothly
        const diff = Math.abs(video.currentTime - normalizedTime);
        if (diff > 0.015) {
          video.currentTime = normalizedTime;
        }

        // 6. Direct DOM update for 60fps/120fps display without React re-render
        updateDisplay(normalizedTime, dur);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [updateDisplay]);

  // Toggle Auto Spin
  const toggleAutoSpin = () => {
    setHasInteracted(true);
    const next = !isAutoSpinning;
    setIsAutoSpinning(next);
    isAutoSpinningRef.current = next;
    velocityRef.current = 0;
  };

  // Reset to 0°
  const handleReset = () => {
    if (isAutoSpinningRef.current) {
      setIsAutoSpinning(false);
      isAutoSpinningRef.current = false;
    }
    velocityRef.current = 0;
    targetTimeRef.current = 0;
    virtualTimeRef.current = 0;
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    updateDisplay(0, durationRef.current);
  };

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
          <span
            ref={degreeHeaderRef}
            className="text-xs font-mono font-semibold text-[#D4AF37]"
          >
            0°
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
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag(e.clientX);
        }}
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
              hasInteracted ? "opacity-0 pointer-events-none" : "opacity-100"
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
        <div
          ref={degreeWatermarkRef}
          className="absolute top-3 right-3 pointer-events-none z-10 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[10px] font-mono text-[#D4AF37]"
        >
          ROTASI: 0°
        </div>
      </div>

      {/* 360 Scrubbing Progress Track */}
      <div className="w-full bg-[#18191E] h-1.5 relative overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#B38F24] via-[#D4AF37] to-[#F1D779] transition-none"
          style={{ width: "0%" }}
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
