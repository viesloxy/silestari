"use client";

import { useEffect, useRef, PropsWithChildren, CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren<{
  /**
   * Rotasi (derajat) saat scrollY=0. Posisi awal.
   * Contoh: +8 = miring kanan sedikit di awal (untuk mascot kiri yang akan tilt kiri).
   */
  initialRotate?: number;
  /**
   * Rotasi (derajat) saat scroll penuh (scrollY=scrollRange).
   * Contoh: -25 = miring kiri jauh di akhir (untuk mascot kiri).
   */
  finalRotate?: number;
  initialY?: number;
  finalY?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
  scrollRange?: number;
}>;

export function ScrollRotate({
  children,
  initialRotate = 10,
  finalRotate = -20,
  initialY = 0,
  finalY = -20,
  flip = false,
  className,
  style,
  scrollRange = 800,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const flipScale = flip ? -1 : 1;
  // Initial transform di-render server-side, match client hydration
  const initialTransform = `translateY(${initialY}px) rotate(${initialRotate}deg) scaleX(${flipScale})`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      const progress = Math.max(0, Math.min(scrollY / scrollRange, 1));
      const currentRotate =
        initialRotate + (finalRotate - initialRotate) * progress;
      const currentY = initialY + (finalY - initialY) * progress;
      el.style.transform = `translateY(${currentY}px) rotate(${currentRotate}deg) scaleX(${flipScale})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [initialRotate, finalRotate, initialY, finalY, flipScale, scrollRange]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        transformOrigin: "50% 90%",
        willChange: "transform",
        transform: initialTransform,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
