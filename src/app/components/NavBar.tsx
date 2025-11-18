"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";

interface NavBarProps {
  resetFilter?: () => void;
}

export default function NavBar({ resetFilter }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useBooking();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainLinks = [
    { name: "Boende", href: "/boende" },
    { name: "Upplevelse", href: "/upplevelse" },
  ];

  const menuLinks = [
    { name: "Logga in", href: "/login", icon: "👤" },
    { name: "Favoriter", href: "/favoriter", icon: "❤️" },
    ...(isLoggedIn ? [{ name: "Mina bokningar", href: "/bookingme", icon: "📖" }] : []),
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="topbar">
        <Link href="/" onClick={() => resetFilter && resetFilter()}>
          <h1 className="league-spartan-bold logo" style={{ cursor: "pointer" }}>
            Naturly
          </h1>
        </Link>

        <div className="nav-links">
          {mainLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link open-sans">
              {link.name}
            </Link>
          ))}
        </div>

        <div ref={menuRef} className="menu-container">
          <button onClick={() => setOpen(!open)} className="hamburger">
            ☰
          </button>

          {open && (
            <div className="dropdown-login">
              <ul>
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="open-sans dropdown-link">
                      <span className="icon">{link.icon} </span>
                      {link.name}
                    </Link>
                  </li>
                ))}

                {isLoggedIn && (
                  <li>
                    <Link
                      href="/"
                      onClick={handleLogout}
                      className="open-sans dropdown-link logout-link"
                    >
                      <span className="icon">🚪 </span> Logga ut
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="bottombar"></div>
    </nav>
  );
}
