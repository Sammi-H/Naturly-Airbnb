"use client";
import { useEffect, useState, useContext } from "react";
import { FiltersContext } from "@/app/layout";



interface Listings {
  _id: string;
  name: string;
  category: "accommodation" | "experiences";
  destination: string;
  petFriendly: boolean;
}

type Tab = "filters" | "var" | "datum" | "vem" | "sök" | null;


type DestinationTabProps = {
  onSelect: (destination: string) => void;
  destinations: Listings[];
  setActivateTab: React.Dispatch<React.SetStateAction<Tab>>;
};

function DestinationTab({
  onSelect,
  destinations = [],
  setActivateTab,
}: DestinationTabProps) {
  const uniqueDestinations = Array.from(
    new Set(destinations.map((d) => d.destination))
  );
  return (
    <div className="destination-buttons">
      {uniqueDestinations.length > 0 ? (
        uniqueDestinations.map((dest) => (
          <button key={dest} onClick={() => onSelect(dest)}>
            {dest}
          </button>
        ))
      ) : (
        <p>Inga destinationer tillgängliga</p>
      )}
      <button onClick={() => setActivateTab("filters")}>Tillbaka</button>
    </div>
  );
}


type DateContentProps = {
  setActivateTab: React.Dispatch<React.SetStateAction<Tab>>;
};

function DatesTab({ setActivateTab }: DateContentProps) {
  const { filters, setFilters } = useContext(FiltersContext)!;

  const handleDateChange = (type: "startDate" | "endDate", value: string) => {
    setFilters({ ...filters, [type]: value });
    console.log("Filters efter datumändring:", { ...filters, [type]: value });
  };

  return (
    <div className="dates-tab">
      <div className="date-field">
        <label>Startdatum</label>
        <input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => handleDateChange("startDate", e.target.value)}
        />
      </div>
      <div className="date-field">
        <label>Slutdatum</label>
        <input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => handleDateChange("endDate", e.target.value)}
        />
      </div>
      <button onClick={() => setActivateTab("filters")}>Klar</button>
    </div>
  );
}


type WhoContentProps = {
  setActivateTab: React.Dispatch<React.SetStateAction<Tab>>;
};

function WhoTab({ setActivateTab }: WhoContentProps) {
  const { filters, setFilters } = useContext(FiltersContext)!;

  return (
    <div className="who-tab">
      <div className="who-field">
        <label>Vuxna</label>
        <div className="counter">
          <button
            onClick={() =>
              setFilters({
                ...filters,
                adults: Math.max(0, filters.adults - 1),
              })
            }
          >
            -
          </button>
          <span>{filters.adults || 0}</span>
          <button
            onClick={() =>
              setFilters({ ...filters, adults: (filters.adults || 0) + 1 })
            }
          >
            +
          </button>
        </div>
      </div>
      <div className="who-field">
        <label>Barn</label>
        <div className="counter">
          <button
            onClick={() =>
              setFilters({
                ...filters,
                children: Math.max(0, filters.children - 1),
              })
            }
          >
            -
          </button>
          <span>{filters.children || 0}</span>
          <button
            onClick={() => {
              const newFilters = {
                ...filters,
                children: (filters.children || 0) + 1,
              };
              setFilters(newFilters);
              console.log("Filters efter barn +:", newFilters);
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="who-field">
        <label>Pet?</label>
        <input
          type="checkbox"
          checked={filters.petFriendly || false}
          onChange={(e) =>
            setFilters({ ...filters, petFriendly: e.target.checked })
          }
        />
      </div>
      <button onClick={() => setActivateTab("filters")}>Klar</button>
    </div>
  );
}


type FiltersProps = {
  setActivateTab: React.Dispatch<React.SetStateAction<Tab>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function FiltersTab({ setActivateTab, setDropdownOpen }: FiltersProps) {
  return (
    <div className="tabs">
      <button onClick={() => setActivateTab("var")}>Var</button>
      <button onClick={() => setActivateTab("datum")}>Datum</button>
      <button onClick={() => setActivateTab("vem")}>Vem</button>
      <button onClick={() => setDropdownOpen(false)}>Stäng</button>
    </div>
  );
}


interface SearchBarProps {
  onSelectDestination: (destination: string) => void;
}

export default function SearchBar({ onSelectDestination }: SearchBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activateTab, setActivateTab] = useState<Tab>("filters");
  const { filters, setFilters } = useContext(FiltersContext)!;
  const [destinationsList, setDestinationsList] = useState<Listings[]>([]);

 const handleDestinationChange = (destination: string) => {
  const newFilters = { ...filters, destination }; 
  setFilters(newFilters); 
  console.log("Filters efter destination:", newFilters); 
  onSelectDestination(destination);
  setActivateTab("filters");
  setDropdownOpen(false);
};


  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/listings?category=accommodation");
      const data: Listings[] = await response.json();
      setDestinationsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch destinations", error);
    }
  };

  useEffect(() => {
    if (activateTab === "var") fetchDestinations();
  }, [activateTab]);
  useEffect(() => {
    if (!dropdownOpen) setActivateTab("filters");
  }, [dropdownOpen]);

  return (
    <div className="searchbar-wrapper">
      <span className="search-icon">🔍</span>
      <input
        className="searchbar-input"
        type="text"
        placeholder="Påbörja din sökning"
        readOnly
        value={filters.destination || ""}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      />

      {dropdownOpen && (
        <div className="dropdown">
          {activateTab === "filters" && (
            <FiltersTab
              setActivateTab={setActivateTab}
              setDropdownOpen={setDropdownOpen}
            />
          )}
          {activateTab === "var" && (
            <DestinationTab
              onSelect={handleDestinationChange}
              destinations={destinationsList}
              setActivateTab={setActivateTab}
            />
          )}
          {activateTab === "datum" && (
            <DatesTab setActivateTab={setActivateTab} />
          )}
          {activateTab === "vem" && <WhoTab setActivateTab={setActivateTab} />}
        </div>
      )}
    </div>
  );
}
