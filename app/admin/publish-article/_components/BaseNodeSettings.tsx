// BaseNodeSettings.tsx
"use client";
import {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { X, GripHorizontal } from "lucide-react";

interface BaseProps {
  show: boolean;
  menuPos: { top: number; left: number };
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const BaseNodeSettings = ({
  show,
  menuPos,
  onClose,
  title,
  children,
}: BaseProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (show) {
      setPosition({ x: menuPos.left, y: menuPos.top + 50 });
    }
  }, [show, menuPos.left, menuPos.top]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!show) return null;

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  return (
    <div
      className="menu-container w-72 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden text-slate-900 select-none"
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 1000,
        transition: isDragging
          ? "none"
          : "all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1)",
      }}
    >
      <div
        onMouseDown={handleHeaderMouseDown}
        className="bg-slate-900 text-white px-3 py-2 flex justify-between items-center cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <GripHorizontal size={14} className="text-slate-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
            {title}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div className="p-4 space-y-5 bg-white">{children}</div>
    </div>
  );
};

export default memo(BaseNodeSettings);
