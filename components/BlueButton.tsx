import React from "react";
import { cn } from "@/utils/cn";
import { ButtonProps } from "@/contexts/Interfaces";

type ButtonSize = "default" | "slim" | "large";

interface CustomButtonProps extends ButtonProps {
  size?: ButtonSize;
}

const Button = ({
  children,
  onClick,
  type,
  className,
  disabled = false,
  size = "default",
}: CustomButtonProps) => {
  const sizeClasses = {
    default: "m-4 py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base",
    slim: "m-2 py-1 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm",
    large: "m-6 py-3 sm:py-4 px-6 sm:px-8 text-sm sm:text-base",
  }[size];

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn(
        `
        text-sm sm:text-base font-Montserrat text-center rounded-full
        text-white bg-aja-blue border border-aja-blue transition-all
        cursor-pointer duration-300 hover:bg-orange-third hover:text-white
        hover:border hover:border-orange-third
        `,
        sizeClasses,
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
