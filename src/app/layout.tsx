"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { FavoritesContextProvider } from "../app/listings/page";
import { BookingProvider } from "./context/BookingContext";

// ----- Filters Context -----
interface Filters {
  destination: string;
  startDate: string | null;
  endDate: string | null;
  adults: number;
  children: number;
  petFriendly: boolean;
}

interface FiltersContextType {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const FiltersContext = createContext<FiltersContextType | null>(null);

export const useFilters = () => {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters måste användas inom FiltersProvider");
  return ctx;
};

// ----- FiltersProvider -----
export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filters>({
    destination: "",
    startDate: null,
    endDate: null,
    adults: 0,
    children: 0,
    petFriendly: false,
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

// ----- Fonts -----
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ----- RootLayout -----
export default function RootLayout({ children }: { children: ReactNode }) {
  const resetFilter = () => {
    // Detta reset är kvar för SearchBar/NavBar
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <FavoritesContextProvider>
          <FiltersProvider>
            <BookingProvider>
              <NavBar resetFilter={resetFilter} />
              {children}
              <Footer />
            </BookingProvider>
          </FiltersProvider>
        </FavoritesContextProvider>
      </body>
    </html>
  );
}
