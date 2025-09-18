import React from "react";

export default function Spinner({ size = 8 }: { size?: number }) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500`}
      style={{ width: `${size}rem`, height: `${size}rem` }}
    ></div>
  );
}
