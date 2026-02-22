import { useRef, useCallback } from 'react';

export default function TapButton({ onClick, children, disabled, className, ...rest }) {
  const touchStart = useRef(null);
  const didMove = useRef(false);

  const handleTouchStart = useCallback((e) => {
    if (disabled) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    didMove.current = false;
  }, [disabled]);

  const handleTouchMove = useCallback((e) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    if (Math.abs(t.clientX - touchStart.current.x) > 8 || Math.abs(t.clientY - touchStart.current.y) > 8) {
      didMove.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!didMove.current && touchStart.current && !disabled) {
      e.preventDefault();
      onClick();
    }
    touchStart.current = null;
  }, [onClick, disabled]);

  return (
    <button
      className={className}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
