"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBell, FaHeart, FaHome, FaUser } from "react-icons/fa";
import { TiSocialInstagramCircular } from "react-icons/ti";
import NotificationCount from "../notification/NotificationCount";

const links = [
  { href: "/home", icon: <FaHome /> },
  { href: "/liked-posts", icon: <FaHeart /> },
  { href: "/notifications", icon: <FaBell /> },
  { href: "/profile", icon: <FaUser /> },
];

export default function Navbar() {
  const pathname = usePathname();

  const handleSignout = async () => {
    await signOut();    
  }
  return (
    <nav className="fixed top-0 w-full flex justify-between items-center h-17 px-2 sm:px-10 bg-dark-1 z-50">

        {/* logo */}
      <div className="flex items-center gap-2 justify-center">
        <TiSocialInstagramCircular size={35} color="#5D5FEF" />
        <span className="text-2xl font-semibold tracking-wide text-gray-400">
          Circle
        </span>
      </div>

      {/* links */}
      <ul className="text-gray-300 flex space-x-5 sm:space-x-10">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li
              key={link.href}
              className={`flex relative flex-col items-center ${
                isActive ? "text-primary" : ""
              }`}
            >
              <Link href={link.href} className="hover:text-primary">
                {link.icon}
              </Link>
              {isActive && (
                <span className="mt-1 w-1.5 h-1.5 block bg-primary rounded-full"></span>
              )}
              {link.href === "/notifications" && <NotificationCount/>}
            </li>
          );
        })}
      </ul>

      {/* logout button */}
      <button onClick={handleSignout} className="bg-primary cursor-pointer px-4 py-2 text-white rounded-full">Logout</button>
    </nav>
  );
}