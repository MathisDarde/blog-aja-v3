"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export type TimelineEntry = {
  id: number;
  headline: string;
  subtitle: string;
  description: string;
};

export type TimelineProps = {
  items: TimelineEntry[];
  className?: string;
};

export default function TimelineLift({ items, className = "" }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col space-y-24 ${className} max-w-[1300px] mx-auto`}
    >
      {/* Ligne verticale */}
      <div className="absolute left-1/2 top-0 w-2 md:w-4 bg-aja-blue -translate-x-1/2 h-full" />

      {/* Timeline steps */}
      {items.map((item, index) => (
        <TimelineStepLift key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

function TimelineStepLift({
  item,
  index,
}: {
  item: TimelineEntry;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-start">
      {/* Point central */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-8 md:border-[10px] border-aja-blue bg-white shadow-lg" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.92 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.08,
        }}
        className={`
          bg-white shadow-lg rounded-xl p-6 md:p-8 w-full md:w-[42%] mt-12
          ${isLeft ? "mr-auto text-left" : "ml-auto text-right"}
        `}
      >
        <div className="font-semibold text-aja-blue uppercase font-Bai_Jamjuree text-xl md:text-2xl">
          {item.headline}
        </div>
        <p className="text-lg md:text-xl font-Montserrat font-semibold text-slate-700">
          {item.subtitle}
        </p>
        <p className="text-sm md:text-base font-Montserrat text-slate-500 mt-2">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
}
