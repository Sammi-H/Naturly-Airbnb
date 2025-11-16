"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface BookingState {
  listing?: {
    _id: string;
    title: string;
    image: string;
    price: number;
    rating?: number;
  };
  guests: {
    adults: number;
    children: number;
  };
  dates: {
    start: string;
    end: string;
  };
  isLoggedIn: boolean;
  setBooking: (data: Partial<Omit<BookingState, "setBooking" | "isLoggedIn" | "setIsLoggedIn">>) => void;
  setIsLoggedIn: (value: boolean) => void;
}

const BookingContext = createContext<BookingState | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [state, setState] = useState<Omit<BookingState, "setBooking" | "isLoggedIn" | "setIsLoggedIn">>({
    listing: undefined,
    guests: { adults: 0, children: 0 },
    dates: { start: "", end: "" },
  });

  const setBooking = (data: Partial<Omit<BookingState, "setBooking" | "isLoggedIn" | "setIsLoggedIn">>) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  return (
    <BookingContext.Provider value={{ ...state, setBooking, isLoggedIn, setIsLoggedIn }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
};
