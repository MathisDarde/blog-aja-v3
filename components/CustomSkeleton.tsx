"use client";

import { cn } from "@/utils/cn";
import React from "react";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
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
        "bg-gray-300 dark:bg-gray-700",
        borderRadius,
        animated && "animate-pulse",
        className
      )}
      style={style}
    />
  );
}
