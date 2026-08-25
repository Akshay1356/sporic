import { useState, useEffect, useRef } from 'react';

/**
 * useCursorPosition — tracks normalized cursor position (0-1)
 * within a target element (or the window if no ref provided).
 */
export function useCursorPosition(elementRef) {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const ticking = useRef(false);

  useEffect(() => {
    const el = elementRef?.current || window;

    const handleMove = (e) => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const rect = elementRef?.current
            ? elementRef.current.getBoundingClientRect()
            : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          setPos({
            x: Math.max(0, Math.min(1, x)),
            y: Math.max(0, Math.min(1, y)),
          });
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    el.addEventListener('mousemove', handleMove, { passive: true });
    return () => el.removeEventListener('mousemove', handleMove);
  }, [elementRef]);

  return pos;
}
