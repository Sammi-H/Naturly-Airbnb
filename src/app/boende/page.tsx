"use client";
import { useEffect, useState } from "react";
import { ListingsDisplay } from "../listings/page";

interface Listing {
  _id: string;
  title: string;
  destination?: string;
  price?: number;
  pricePerPerson?: number;
  category: "accommodation" | "experience";
  imagePath?: string;
  petfriendly?: boolean;
  image?: string[];
}

export default function BoendePage() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings"); 
        const data: Listing[] = await res.json();
        const boenden = data.filter((l) => l.category === "accommodation");
        setListings(boenden);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    }
    fetchListings();
  }, []);

  return listings.length > 0 ? (
    <ListingsDisplay results={listings} />
  ) : (
    <p style={{ padding: "16px" }}>Inga boenden hittades</p>
  );
}
