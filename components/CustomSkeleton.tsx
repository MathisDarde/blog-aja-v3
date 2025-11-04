"use client";

import { cn } from "@/utils/cn";
import React from "react";

type SkeletonProps = {
  width?: string | number;
  height?: number | string;
  borderRadius?: string;
  className?: string;
  animated?: boolean;
};

export default function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = "rounded-md",
  className,
  animated = true,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-300 dark:bg-gray-700",
        borderRadius,
        animated && "animate-skeleton-breathe",
        className
      )}
      style={style}
    >
      {animated && (
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-skeleton-shimmer" />
      )}
      <style jsx>{`
        @keyframes skeleton-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-skeleton-shimmer {
          animation: skeleton-shimmer 1.5s infinite;
        }

        @keyframes skeleton-breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.03);
            opacity: 0.9;
          }
        }
        .animate-skeleton-breathe {
          animation: skeleton-breathe 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}