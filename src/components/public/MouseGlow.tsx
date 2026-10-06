import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const MouseGlow: React.FC = () => {
  const { theme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isMoving = false;
    let idleTimer: any = null;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsHovering(true);
      isMoving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 150);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      isMoving = false;
    };

    const loop = () => {
      if (isMoving) {
        const ease = 0.15;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        setMousePos({ x: Math.round(currentX), y: Math.round(currentY) });
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(idleTimer);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300 overflow-hidden"
      style={{ opacity: isHovering ? 1 : 0 }}
    >
      {/* Soft ambient cursor spotlight - Electric blue and cyan, NO purple */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full will-change-transform"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          background: isDark
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(37, 99, 235, 0.04) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(14, 165, 233, 0.03) 40%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />
    </div>
  );
};
