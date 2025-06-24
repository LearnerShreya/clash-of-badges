// src/components/button.jsx

import React from "react";

export function Button({ children, onClick, variant = "default", className = "" }) {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-all ";
  const style =
    variant === "outline"
      ? "border border-blue-500 text-blue-500 hover:bg-blue-50"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button onClick={onClick} className={`${baseStyle} ${style} ${className}`}>
      {children}
    </button>
  );
}
