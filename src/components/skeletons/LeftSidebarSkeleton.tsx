import React from "react";

export default function LeftSidebarSkeleton() {
  return (
    <aside className="min-h-screen fixed top-17 left-20 w-[350px] hidden lg:block">
      <div className="bg-dark-3 rounded-2xl m-5 p-4">
        <div className="flex gap-3 items-center justify-center">
          <div className="animate-pulse flex items-center flex-col">
            <div className="w-6 h-6 rounded-lg bg-dark-4"></div>
            <div className="w-10 h-2 rounded-lg bg-dark-4 mt-2"></div>
          </div>
          <div className="animate-pulse w-20 h-20 bg-dark-4 rounded-full"></div>
          <div className="animate-pulse flex items-center flex-col">
            <div className="w-6 h-6 rounded-lg bg-dark-4"></div>
            <div className="w-10 h-2 rounded-lg bg-dark-4 mt-2"></div>
          </div>
        </div>

        <div className="my-4 flex justify-center animate-pulse">
          <div className="bg-dark-4 rounded-lg w-22 h-3"></div>
        </div>

        <div className="flex items-center animate-pulse mt-10 flex-col">
          <div className="bg-dark-4 rounded-lg w-40 h-2 mb-2"></div>
          <div className="bg-dark-4 rounded-lg w-25 h-2"></div>
        </div>
      </div>
    </aside>
  );
}