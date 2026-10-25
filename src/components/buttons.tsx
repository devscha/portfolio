import { useState } from "react";

interface NavButtonProps {
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: (label: string, to: string) => void;
  className?: string;
}

export function PillButton({
  label,
  to,
  isActive = false,
  onClick,
  className = "",
}: NavButtonProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    if (onClick) {
      onClick(label, to);
    } else {
      setTimeout(() => {
        if (to.startsWith("#")) {
          document.querySelector(to)?.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = to;
        }
      }, 250);
    }
  };

  const active = isActive || clicked;

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center rounded-full px-7 py-2 font-heading tracking-wider transition-all duration-300 border text-sm sm:text-base cursor-pointer select-none ${
        active
          ? "bg-[#1B90F0] text-white border-[#1B90F0] scale-95 shadow-[0_4px_12px_rgba(27,144,240,0.35)]"
          : "bg-white text-[#000000] border-gray-300 hover:border-[#1B90F0] hover:text-[#1B90F0] hover:shadow-[0_2px_8px_rgba(27,144,240,0.15)] active:scale-95"
      } ${className}`}
    >
      {label}
    </button>
  );
}