import React from "react";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/general/Navbar";
import LeftSidebar from "@/components/general/LeftSidebar";
import Rightsidebar from "@/components/general/Rightsidebar";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }
  return <>
  <Navbar />
  <LeftSidebar />
  <div className="text-white mx-2 md:mx-20 lg:ml-110 xl:mr-200 mt-20>">
 {children}
  </div>
  <Rightsidebar />
  </>;
}