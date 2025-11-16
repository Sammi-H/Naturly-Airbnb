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
    { name: "Logga in", href: "/login" },
    { name: "Favoriter", href: "/favoriter" },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="topbar">

        {/* LOGO */}
        <Link href="/" onClick={() => resetFilter && resetFilter()}>
          <h1 className="league-spartan-bold logo" style={{ cursor: "pointer" }}>
            Naturly
          </h1>
        </Link>

        {/* TOP LINKS (desktop + tablet) */}
        <div className="nav-links">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link open-sans"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* HAMBURGER MENU */}
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
                      {link.name === "Logga in" && <span className="icon">👤 </span>}
                      {link.name === "Favoriter" && <span className="icon">❤️ </span>}
                      {link.name}
                    </Link>
                  </li>
                ))}

                {isLoggedIn && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="open-sans dropdown-link logout-btn"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      <span className="icon">🚪 </span> Logga ut
                    </button>
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
