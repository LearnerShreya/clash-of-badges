// src/components/card.jsx

import React from "react";

export function Card({ children }) {
  return <div className="bg-white rounded-xl shadow-md p-4">{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-sm ${className}`}>{children}</div>;
}
