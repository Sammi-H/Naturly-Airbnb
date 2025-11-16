"use client";

import { useState, useEffect } from "react";
import { FiltersProvider } from "../app/layout";
import SearchBar from "./components/SearchBar";
import { ListingsDisplay } from "./listings/page";
import LoginModal from "./components/Modal";


export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleResetFilter = () => {
    setSelectedDestination("");
    fetchListings();
  };

  return (
    <FiltersProvider>
      <SearchBar onSelectDestination={setSelectedDestination} />
      <ListingsDisplay
        results={results}
        filteredDestination={selectedDestination}
      />
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </FiltersProvider>
  );
}
