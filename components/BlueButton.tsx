import React, { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  className?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  type,
  className,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn(
        `text-base font-Montserrat text-center m-4 py-4 px-6 rounded-full border-0
        text-white bg-aja-blue transition-all cursor-pointer`,
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
