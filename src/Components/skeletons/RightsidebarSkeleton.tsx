import React from "react";

export default function RightsidebarSkeleton() {
  return (
    <aside className="min-h-screen fixed top-17 right-20 w-[300px] hidden xl:block">
        {[...Array(3)].map((_,index) => (
             <div key={index} className="flex gap-2 items-center bg-dark-3 rounded-2xl mt-4 p-4">
        <div className="w-14 h-14 rounded-full bg-dark-4 animate-pulse"></div>
        <div className="flex-1 animate-pulse">
          <div className="bg-dark-4 w-40 h-2 rounded-lg"></div>
          <div className="bg-dark-4 w-25 h-2 rounded-lg mt-4"></div>
        </div>
      </div>
        ))}
     
    </aside>
  );
}