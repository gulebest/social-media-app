// src/app/(protected)/home/page.tsx
import React from "react";

export default function HomePage() {
  return (
    <div className="h-screen flex justify-center items-center bg-[var(--color-dark-1)] px-4 py-8">
      <div className="w-full max-w-sm bg-[var(--color-dark-2)] rounded-2xl shadow-xl p-8">

        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-gray-100 mb-2">Welcome Home</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          You are successfully logged in!
        </p>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-300 text-sm">
            This is a protected area. Only authenticated users can access this page.
          </p>

          <div className="w-full p-4 bg-[var(--color-dark-1)] rounded-lg shadow-md">
            <p className="text-gray-300 text-sm">
              Example content card — you can put your dashboard, posts, or stats here.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
