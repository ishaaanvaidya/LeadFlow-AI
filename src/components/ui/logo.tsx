import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: "h-5 w-5", text: "text-sm" },
    md: { icon: "h-6 w-6", text: "text-lg" },
    lg: { icon: "h-8 w-8", text: "text-2xl" },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        className={`${sizes[size].icon} text-neutral-900 dark:text-neutral-100`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="5 3 19 3 19 6 5 6 5 3" />
        <path d="M12 6v15M9 21h6" />
      </svg>
      {showText && (
        <span className={`font-bold tracking-tight text-neutral-900 dark:text-neutral-50 ${sizes[size].text}`}>
          LeadFlow<span className="text-neutral-500 font-normal">.AI</span>
        </span>
      )}
    </div>
  );
}
