import React from "react";

export default function NotificationsSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <div className="bg-dark-3 p-4 rounded-2xl my-3"key={index}>
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 bg-dark-4 rounded-full animate-pulse"></div>
            <div className="animate-pulse">
              <div className="w-50 bg-dark-4 h-2 rounded-full"></div>
              <div className="w-30 bg-dark-4 h-2 rounded-full mt-3"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}