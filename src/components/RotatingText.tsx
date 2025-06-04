// RotatingText.tsx
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  CSSProperties,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RotatingText.css";

interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  loop?: boolean;
  auto?: boolean;
  onNext?: (index: number) => void;
  mainClassName?: string;
}

const RotatingText = forwardRef<any, RotatingTextProps>((props, ref) => {
  const {
    texts,
    rotationInterval = 2000,
    loop = true,
    auto = true,
    onNext,
    mainClassName,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => {
      goNext();
    }, rotationInterval);
    return () => clearTimeout(timer);
  }, [currentIndex, auto, rotationInterval]);

  const goNext = useCallback(() => {
    const next = currentIndex === texts.length - 1
      ? loop
        ? 0
        : currentIndex
      : currentIndex + 1;
    if (next !== currentIndex) {
      setCurrentIndex(next);
      onNext?.(next);
    }
  }, [currentIndex, loop, texts.length, onNext]);

  const goPrev = useCallback(() => {
    const prev = currentIndex === 0
      ? loop
        ? texts.length - 1
        : currentIndex
      : currentIndex - 1;
    if (prev !== currentIndex) {
      setCurrentIndex(prev);
      onNext?.(prev);
    }
  }, [currentIndex, loop, texts.length, onNext]);

  useImperativeHandle(ref, () => ({
    next: goNext,
    previous: goPrev,
    reset: () => setCurrentIndex(0),
    jumpTo: (i: number) => {
      const clamped = Math.max(0, Math.min(i, texts.length - 1));
      setCurrentIndex(clamped);
      onNext?.(clamped);
    },
  }));

  const maxTextWidth = useMemo(() => {
    if (typeof window === "undefined") return 0;
    const container = document.createElement("span");
    container.style.position = "absolute";
    container.style.whiteSpace = "nowrap";
    container.style.visibility = "hidden";
    document.body.appendChild(container);
    let maxW = 0;
    for (const t of texts) {
      container.innerText = t;
      const w = container.getBoundingClientRect().width;
      if (w > maxW) maxW = w;
    }
    document.body.removeChild(container);
    return maxW;
  }, [texts]);

  const wrapperStyle: CSSProperties = {
    display: "inline-block",
    minWidth: maxTextWidth > 0 ? `${maxTextWidth}px` : undefined,
    textAlign: "left",
  };

  return (
    <motion.span
      className={["rt-wrapper", mainClassName].filter(Boolean).join(" ")}
      style={wrapperStyle}
      layout
      layoutTransition={{ type: "tween", ease: "easeInOut", duration: 0.45 }}
    >
      <span className="rt-sr-only">{texts[currentIndex]}</span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          className="rt-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {texts[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText;
