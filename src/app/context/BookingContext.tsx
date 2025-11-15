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
  setBooking: (data: Partial<Omit<BookingState, "setBooking">>) => void;
}

const BookingContext = createContext<BookingState | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  // Initiera med samma struktur som BookingState
  const [state, setState] = useState<Omit<BookingState, "setBooking">>({
    listing: undefined,
    guests: { adults: 0, children: 0 },
    dates: { start: "", end: "" },
  });

  const setBooking = (data: Partial<Omit<BookingState, "setBooking">>) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  return (
    <BookingContext.Provider value={{ ...state, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
};
