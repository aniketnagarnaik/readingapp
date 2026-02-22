import { useRef, useCallback } from 'react';

export function useTap(handler) {
  const touchStartPos = useRef(null);
  const moved = useRef(false);

  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    moved.current = false;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!touchStartPos.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.current.x);
    const dy = Math.abs(touch.clientY - touchStartPos.current.y);
    if (dx > 10 || dy > 10) {
      moved.current = true;
    }
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!moved.current && touchStartPos.current) {
      e.preventDefault();
      handler();
    }
    touchStartPos.current = null;
    moved.current = false;
  }, [handler]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClick: handler,
  };
}
