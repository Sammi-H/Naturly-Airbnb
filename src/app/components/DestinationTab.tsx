"use client";
import { useState, useEffect } from "react";

interface DestinationTabProps {
  onSelect: (destination: string) => void;
}

interface Listing {
  destination?: string;
}

export function DestinationTab({ onSelect }: DestinationTabProps) {
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch("/api/listings");
        const data = await response.json();
        console.log("Listings från DB:", data);

        // Om datan inte är en array, försök hämta rätt fält
        const listings: Listing[] = Array.isArray(data)
          ? data
          : Array.isArray(data.listings)
          ? data.listings
          : [];

        const uniqueDestinations = Array.from(
          new Set(
            listings
              .map((item) => item.destination)
              .filter((dest): dest is string => Boolean(dest))
          )
        );

        setLocations(uniqueDestinations);
      } catch (error) {
        console.error("Fel vid hämtning av destinationer:", error);
      }
    }

    fetchLocations();
  }, []);

  return (
    <div className="destination-tab">
      {locations.map((loc) => (
        <button
          key={loc}
          className="destination-btn"
          onClick={() => onSelect(loc)}
        >
          {loc}
        </button>
      ))}
      <button className="destination-btn" onClick={() => onSelect("")}>
        Avbryt
      </button>
    </div>
  );
}
