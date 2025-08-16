import React, { useRef, useEffect, useState, type TouchEvent } from "react";

type Carousel3DProps = {
  images: string[]; // URLs de imágenes
  autoRotate?: boolean; // rotación automática
  rotateInterval?: number; // ms
  cardHeight?: number; // alto del slide (px)
  className?: string;
  isAnApp?: boolean; // true => 9:16 (vertical); false => 16:9 (horizontal)
  fit?: "contain" | "cover"; // cómo encajar la imagen
  backfillMode?: "dominant-color" | "blur-image" | "none";
  frame?: "none" | "browser" | "phone"; // marco del slide
  isLargeMobile?: boolean;
};

const ChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const averageColor = (src: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // seguro con assets locales
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 16;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 16, 16);
      const { data } = ctx.getImageData(0, 0, 16, 16);
      let r = 0,
        g = 0,
        b = 0,
        n = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      resolve(`rgb(${(r / n) | 0}, ${(g / n) | 0}, ${(b / n) | 0})`);
    };
    img.onerror = () => resolve("rgb(20,20,20)");
    img.src = src;
  });

const Carousel3D: React.FC<Carousel3DProps> = ({
  images,
  autoRotate = true,
  rotateInterval = 4000,
  cardHeight, // si no lo pasas, se setea con base al formato
  className,
  isLargeMobile = false,
  fit = "contain",
  backfillMode = "dominant-color",
  frame = "none",
  isAnApp = false,
}) => {
  const [active, setActive] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [open, setOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [wrapWidth, setWrapWidth] = useState<number>(0);
  const [avgColors, setAvgColors] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50;

  // Aspect ratio por formato
  const aspect = isAnApp ? (isLargeMobile ? 1 / 2 : 9 / 16) : 16 / 9; // width/height
  const baseH = cardHeight ?? (isAnApp ? 520 : 380);

  // calcula tamaño del slide según el ancho disponible
  const { slideW, slideH, containerH } = React.useMemo(() => {
    // ancho máximo del slide: 90% del contenedor (y límite superior opcional)
    const maxW = Math.max(260, wrapWidth * 0.9);
    let h = baseH;
    let w = h * aspect;

    // si el ancho calculado supera el permitido, escalamos uniformemente
    if (wrapWidth > 0 && w > maxW) {
      const s = maxW / w;
      w *= s;
      h *= s;
    }

    // contenedor un poco más alto para dots/flechas
    const extra = isAnApp ? 70 : 80;
    return {
      slideW: Math.round(w),
      slideH: Math.round(h),
      containerH: Math.round(h + extra),
    };
  }, [wrapWidth, baseH, aspect, isAnApp]);

  // Detecta viewport
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || !isInView || isHovering || images.length <= 1) return;
    const id = window.setInterval(
      () => setActive((p) => (p + 1) % images.length),
      rotateInterval
    );
    return () => window.clearInterval(id);
  }, [autoRotate, isInView, isHovering, rotateInterval, images.length]);

  // Responsive: medir ancho disponible para ajustar offsets
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setWrapWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;
    Promise.all(images.map((src) => averageColor(src))).then((cols) => {
      if (mounted) setAvgColors(cols);
    });
    return () => {
      mounted = false;
    };
  }, [images]);

  const prev = () => setActive((p) => (p - 1 + images.length) % images.length);
  const next = () => setActive((p) => (p + 1) % images.length);

  // Gestos touch
  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };
  const onTouchMove = (e: TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const d = touchStart - touchEnd;
    if (d > minSwipeDistance) next();
    else if (d < -minSwipeDistance) prev();
  };

  // Offsets adaptativos según formato y ancho disponible
  const small = wrapWidth < 640; // sm
  const medium = wrapWidth >= 640 && wrapWidth < 1024; // md
  const neighborOffsetPct = isAnApp
    ? small
      ? 18
      : medium
      ? 30
      : 42 // más separación en vertical
    : small
    ? 14
    : medium
    ? 24
    : 34; // menos separación en horizontal
  const neighborScale = small ? 0.93 : 0.95;

  // Estado visual por índice
  const getSlideStyle = (index: number): React.CSSProperties => {
    let x = 0,
      scale = 1,
      opacity = 1,
      zIndex = 20;
    if (index === active) {
      x = 0;
      scale = 1;
      opacity = 1;
      zIndex = 20;
    } else if (index === (active + 1) % images.length) {
      x = neighborOffsetPct;
      scale = neighborScale;
      opacity = 0.75;
      zIndex = 10;
    } else if (index === (active - 1 + images.length) % images.length) {
      x = -neighborOffsetPct;
      scale = neighborScale;
      opacity = 0.75;
      zIndex = 10;
    } else {
      x = 0;
      scale = 0.9;
      opacity = 0;
      zIndex = 0;
    }
    return {
      width: `${slideW}px`,
      height: `${slideH}px`,
      transform: `translateX(${x}%) scale(${scale})`,
      opacity,
      zIndex,
    };
  };
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!images?.length) return null;

  return (
    <section
      className={`bg-transparent w-full flex items-center justify-center ${
        className ?? ""
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={wrapRef}
        className="relative overflow-hidden w-full max-w-6xl"
        style={{ height: containerH }}
      >
        {/* Rail centrado */}
        <div
          ref={railRef}
          className="absolute inset-0 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              onClick={() => {
                if (index === active) setOpen(true);
              }}
              className={`absolute top-0 mx-auto rounded-2xl overflow-hidden transition-all
                 duration-500 ease-out will-change-transform border
                 border-white/10 bg-transparent ${
                   index === active ? "cursor-zoom-in" : "pointer-events-none"
                 }`}
              style={getSlideStyle(index)}
              aria-hidden={index !== active}
            >
              {/* Imagen: object-contain para respetar proporciones */}
              {/* BACKFILL detras de la imagen */}
              {backfillMode !== "none" &&
                (backfillMode === "blur-image" ? (
                  <div
                    className="absolute inset-0 -z-10"
                    aria-hidden
                    style={{
                      backgroundImage: `url(${src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(28px) brightness(0.6) saturate(0.9)",
                      transform: "scale(1.1)",
                    }}
                  />
                ) : (
                  <div
                    className="absolute inset-0 -z-10"
                    aria-hidden
                    style={{
                      background: avgColors[index] || "#111",
                    }}
                  />
                ))}

              {/* FRAME + IMAGEN */}
              {frame === "browser" ? (
                <div className="h-full w-full rounded-xl overflow-hidden bg-black/40 border border-white/10">
                  <div className="h-8 flex items-center gap-2 px-3 border-b border-white/10 bg-black/30">
                    <span className="w-3 h-3 rounded-full bg-red-400/70" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <span className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                  <img
                    src={src}
                    alt={`Imagen ${index + 1}`}
                    className="w-full"
                    style={{ height: "calc(100% - 2rem)", objectFit: fit }}
                    loading={index === active ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ) : frame === "phone" ? (
                <div
                  className="h-full w-full rounded-[2rem] border-2 border-white/15 relative overflow-hidden shadow-[0_0_0_8px_rgba(0,0,0,0.4)]"
                  style={{
                    background: `radial-gradient(ellipse at 50% 30%, ${
                      avgColors[index] || "#0b0b0b"
                    } 0%, rgba(0,0,0,.65) 60%, rgba(0,0,0,.85) 100%)`,
                  }}
                >
                  {/* notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black/70 rounded-b-2xl z-10" />
                  <img
                    src={src}
                    alt={`Imagen ${index + 1}`}
                    className="h-full w-full"
                    style={{ objectFit: fit }}
                    loading={index === active ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ) : (
                <img
                  src={src}
                  alt={`Imagen ${index + 1}`}
                  className="h-full w-full"
                  style={{ objectFit: fit, background: "#000" }}
                  loading={index === active ? "eager" : "lazy"}
                  decoding="async"
                />
              )}
            </div>
          ))}
        </div>

        {/* Flechas (se posicionan en relación al contenedor, no al slide) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-gray-700 flex items-center justify-center shadow-md hover:bg-white z-30"
              onClick={prev}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-gray-700 flex items-center justify-center shadow-md hover:bg-white z-30"
              onClick={next}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots (más arriba en formato app para no quedar tan abajo) */}
        {images.length > 1 && (
          <div
            className="absolute left-0 right-0 flex justify-center items-center space-x-3 z-30"
            style={{ bottom: isAnApp ? 10 : 20 }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === active ? "bg-gray-500 w-5" : "bg-gray-300 w-2"
                }`}
                onClick={() => setActive(idx)}
                aria-label={`Ir a la imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}
        {open && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={() => {
              onTouchEnd();
            }} // swipe también en el lightbox
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }} // click en backdrop
          >
            {/* Cerrar */}
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-lg px-3 py-1 rounded bg-white/10"
            >
              ✕
            </button>

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  aria-label="Anterior"
                  onClick={prev}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-gray-700 flex items-center justify-center shadow-md hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M15 6l-6 6 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  aria-label="Siguiente"
                  onClick={next}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-gray-700 flex items-center justify-center shadow-md hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Imagen grande */}
            <img
              src={images[active]}
              alt={`Imagen ${active + 1}`}
              className="max-h-[90vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Carousel3D;
