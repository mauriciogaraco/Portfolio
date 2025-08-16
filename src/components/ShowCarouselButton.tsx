// src/components/ShowCarouselButton.tsx
import React, { useEffect, useState } from "react";
import Draggable3DImageRing from "./Draggable3DImageRing";
import { createPortal } from "react-dom";

type Props = { images: string[]; label?: string };

export default function ShowCarouselButton({ images, label = "View" }: Props) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);
  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 border
         border-white/10 bg-white/5 hover:bg-white/10 transition"
        onClick={() => setOpen(true)}
        aria-label="Open gallery"
      >
        {label}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative w-screen h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 z-[10000] rounded-md px-3 py-1.5 bg-white/10 hover:bg-white/20"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                Close
              </button>
              <div className="w-full h-full">
                <Draggable3DImageRing
                  images={images}
                  width={400}
                  imageDistance={500}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
