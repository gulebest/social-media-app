import React from "react";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/general/Navbar";
import LeftSidebar from "@/components/general/LeftSidebar";
import RightSidebar from "@/components/general/RightSidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Navbar />

      {/* Main 3-column layout */}
      <div className="mt-20 flex w-full justify-center px-4 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="hidden lg:block w-[300px]">
          <LeftSidebar />
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-[600px] text-white">
          {children}
        </main>

        {/* RIGHT SIDEBAR */}
        <div className="hidden xl:block w-[300px]">
          <RightSidebar />
        </div>
      </div>
    </>
  );
}
