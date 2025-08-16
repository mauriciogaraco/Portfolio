"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  easeOut,
} from "framer-motion";

type Props = {
  images: string[];
  width?: number;
  perspective?: number;
  imageDistance?: number;
  initialRotation?: number;
  animationDuration?: number;
  staggerDelay?: number;
  hoverOpacity?: number;
  backgroundColor?: string;
  draggable?: boolean;
  mobileBreakpoint?: number;
  mobileScaleFactor?: number;
  inertiaPower?: number;
  inertiaTimeConstant?: number;
  inertiaVelocityMultiplier?: number;
};

export default function Draggable3DImageRing({
  images,
  width = 300,
  perspective = 2000,
  imageDistance = 500,
  initialRotation = 180,
  animationDuration = 1.2,
  staggerDelay = 0.08,
  hoverOpacity = 0.5,
  backgroundColor,
  draggable = true,

  mobileBreakpoint = 768,
  mobileScaleFactor = 0.8,
  inertiaPower = 0.8,
  inertiaTimeConstant = 300,
  inertiaVelocityMultiplier = 20,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const rotationY = useMotionValue(initialRotation);
  const startX = useRef(0);
  const currentRotationY = useRef(initialRotation);
  const isDragging = useRef(false);
  const velocity = useRef(0);

  const [currentScale, setCurrentScale] = useState(1);
  const [showImages, setShowImages] = useState(false);

  const angle = useMemo(
    () => 360 / Math.max(images.length, 1),
    [images.length]
  );

  const getBgPos = (idx: number, currentRot: number, scale: number) => {
    const scaled = imageDistance * scale;
    const effective = currentRot - 180 - idx * angle;
    const off = (((effective % 360) + 360) % 360) / 360;
    return `${-(off * (scaled / 1.5))}px 0px`;
  };

  useEffect(() => {
    const unsub = rotationY.on("change", (latest) => {
      if (ringRef.current) {
        Array.from(ringRef.current.children).forEach((el, i) => {
          (el as HTMLElement).style.backgroundPosition = getBgPos(
            i,
            latest,
            currentScale
          );
        });
      }
      currentRotationY.current = latest;
    });
    return () => unsub();
  }, [rotationY, currentScale, angle]);

  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      setCurrentScale(vw <= mobileBreakpoint ? mobileScaleFactor : 1);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [mobileBreakpoint, mobileScaleFactor]);

  useEffect(() => setShowImages(true), []);

  const onDragStart = (ev: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    isDragging.current = true;
    const x = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
    startX.current = x;
    rotationY.stop();
    velocity.current = 0;
    if (ringRef.current) ringRef.current.style.cursor = "grabbing";
    document.addEventListener("mousemove", onDrag as any);
    document.addEventListener("mouseup", onDragEnd as any);
    document.addEventListener("touchmove", onDrag as any, { passive: true });
    document.addEventListener("touchend", onDragEnd as any);
  };

  const onDrag = (ev: MouseEvent | TouchEvent) => {
    if (!draggable || !isDragging.current) return;
    const x =
      "touches" in ev
        ? (ev as TouchEvent).touches[0].clientX
        : (ev as MouseEvent).clientX;
    const dx = x - startX.current;
    velocity.current = -dx * 0.5;
    rotationY.set(currentRotationY.current + velocity.current);
    startX.current = x;
  };

  const onDragEnd = () => {
    isDragging.current = false;
    if (ringRef.current) {
      ringRef.current.style.cursor = "grab";
      currentRotationY.current = rotationY.get();
    }
    document.removeEventListener("mousemove", onDrag as any);
    document.removeEventListener("mouseup", onDragEnd as any);
    document.removeEventListener("touchmove", onDrag as any);
    document.removeEventListener("touchend", onDragEnd as any);

    const initial = rotationY.get();
    const vBoost = velocity.current * inertiaVelocityMultiplier;
    const target = initial + vBoost;

    animate(initial, target, {
      type: "inertia",
      velocity: vBoost,
      power: inertiaPower,
      timeConstant: inertiaTimeConstant,
      restDelta: 0.5,
      modifyTarget: (t) => Math.round(t / angle) * angle,
      onUpdate: (latest) => rotationY.set(latest),
    });
    velocity.current = 0;
  };

  const variants = {
    hidden: { y: 200, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[60vh] max-h-[720px] overflow-hidden select-none"
      style={{
        backgroundColor,
        transform: `scale(${currentScale})`,
        transformOrigin: "center",
      }}
      onMouseDown={draggable ? onDragStart : undefined}
      onTouchStart={draggable ? onDragStart : undefined}
    >
      <div
        style={{
          perspective: `${perspective}px`,
          width: `${width}px`,
          height: `${width * 1.33}px`,
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          ref={ringRef}
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            rotateY: rotationY,
            cursor: draggable ? "grab" : "default",
          }}
        >
          <AnimatePresence>
            {showImages &&
              images.map((url, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backfaceVisibility: "hidden",
                    rotateY: i * -angle,
                    z: -imageDistance * currentScale,
                    transformOrigin: `50% 50% ${
                      imageDistance * currentScale
                    }px`,
                    backgroundPosition: getBgPos(
                      i,
                      currentRotationY.current,
                      currentScale
                    ),
                    boxShadow: "0 30px 80px rgba(0,0,0,.35)",
                    borderRadius: "16px",
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={variants}
                  transition={{
                    delay: i * staggerDelay,
                    duration: animationDuration,
                    ease: easeOut,
                  }}
                  whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
                  onMouseEnter={() => {
                    if (isDragging.current || !ringRef.current) return;
                    Array.from(ringRef.current.children).forEach((el, idx) => {
                      if (idx !== i)
                        (el as HTMLElement).style.opacity = `${hoverOpacity}`;
                    });
                  }}
                  onMouseLeave={() => {
                    if (isDragging.current || !ringRef.current) return;
                    Array.from(ringRef.current.children).forEach((el) => {
                      (el as HTMLElement).style.opacity = "1";
                    });
                  }}
                />
              ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
