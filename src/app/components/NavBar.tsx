"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NavLink {
  name: string;
  href: string;
}

interface NavBarProps {
  resetFilter?: () => void; 
}

export default function NavBar({ resetFilter }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainLinks: NavLink[] = [
    { name: "Boende", href: "/boende" },
    { name: "Upplevelse", href: "/upplevelse" },
  ];

  const menuLinks: NavLink[] = [
    { name: "Logga in", href: "/login" },
    { name: "Favoriter", href: "/favoriter" },
  ];

  return (
    <nav className="navbar">
      <div className="topbar">
        <div>
          <Link href="/">
            <h1
              className="league-spartan-bold"
              style={{ cursor: "pointer" }}
              onClick={() => resetFilter && resetFilter()} 
            >
              Naturly
            </h1>
          </Link>
        </div>

        <div>
          {mainLinks.map((link) => (
            <a key={link.href} href={link.href} className="open-sans">
              {link.name}
            </a>
          ))}
        </div>

        <div ref={menuRef}>
          <button onClick={() => setOpen(!open)} className="hamburger">
            ☰
          </button>
          {open && (
            <div className="dropdown-login">
              <ul>
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="open-sans dropdown-link">
                      {link.name === "Logga in" && <span className="icon">👤 </span>}
                      {link.name === "Favoriter" && <span className="icon">❤️ </span>}
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="bottombar"></div>
    </nav>
  );
}
