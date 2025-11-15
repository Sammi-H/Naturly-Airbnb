"use client";
import { useEffect, useState, createContext, useContext } from "react";
import styles from "./ListingCard.module.css";
import Link from "next/link";

// ---------- FAVORITES CONTEXT ----------
interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
});
export const useFavorites = () => useContext(FavoritesContext);

// ---------- MAIN COMPONENT ----------
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

type ListingsDisplayProps = {
  results: Listing[];
  filteredDestination?: string; // ✅ Filtrering baserat på vald destination
};

export function ListingsDisplay({
  results,
  filteredDestination,
}: ListingsDisplayProps) {
  const [images, setImages] = useState<
    { path: string; destination: string; place: string }[]
  >([]);

  // 🔧 FIX: Filtrering sker här direkt för vald destination
  const filteredResults = filteredDestination
    ? results.filter((l) => l.destination === filteredDestination)
    : results;

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/listings-images");
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    }
    fetchImages();
  }, []);

  const boenden = filteredResults.filter((i) => i.category === "accommodation");
  const dogFriendly = boenden.filter((b) => b.petfriendly);
  const experiences = filteredResults.filter(
    (i) => i.category === "experience"
  );

  // ---------- IMAGE MATCHING ----------
  const formatName = (name?: string) =>
    name
      ? name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";

  const getImagePath = (listing: Listing) => {
    const dest = listing.destination ? formatName(listing.destination) : "";
    const match = images.find(
      (img) =>
        img.path.toLowerCase().includes(dest) &&
        img.path.toLowerCase().endsWith("main.png")
    );
    return match ? match.path : "";
  };

  return (
    <FavoritesContextProvider>
      <div className={styles.listingsGrid}>
        {boenden.length > 0 && (
          <>
            <h2>Upptäck boenden</h2>
            <br />
            {boenden.map((l) => (
              <ListingCard
                key={l._id}
                listing={l}
                imagePath={getImagePath(l)}
              />
            ))}
          </>
        )}

        <br />

        {dogFriendly.length > 0 && (
          <>
            <h2>Hundvänliga boenden</h2>
            <br />
            {dogFriendly.map((l) => (
              <ListingCard
                key={l._id}
                listing={l}
                imagePath={getImagePath(l)}
                showDogIcon
              />
            ))}
          </>
        )}

        {experiences.length > 0 && (
          <>
            <h2>Upptäck upplevelser</h2>
            <br />
            {experiences.map((l) => (
              <ExperienceCard
                key={l._id}
                listing={l}
                imagePath={getImagePath(l)}
              />
            ))}
          </>
        )}
      </div>
    </FavoritesContextProvider>
  );
}

// ---------- FAVORITES PROVIDER ----------
export function FavoritesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ---------- LISTING CARD ----------
export function ListingCard({
  listing,
  imagePath,
  showDogIcon,
}: {
  listing: Listing;
  imagePath?: string;
  showDogIcon?: boolean;
}) {
  const { favorites, toggleFavorite } = useFavorites();
  const liked = favorites.includes(listing._id);

  const thumbnail = listing?.image?.[0] || imagePath;

  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <Link href={`/listings/${listing._id}`}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={listing.title}
              className={styles.cardImgTag}
            />
          ) : (
            <div>Ingen bild</div>
          )}
        </Link>

        <button
          className={styles.favoriteButton}
          onClick={() => toggleFavorite(listing._id)}
        >
          {liked ? "❤️" : "♡"}
        </button>
      </div>

      <div className={styles.cardInfo}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{listing.title}</span>
          {listing.petfriendly && showDogIcon && (
            <span className={styles.dogIconText}>🐾</span>
          )}
        </div>
        {listing.destination && (
          <p className={styles.destination}>{listing.destination}</p>
        )}
        {listing.price && (
          <p className={styles.price}>{listing.price} kr / natt</p>
        )}
      </div>
    </div>
  );
}

// ---------- EXPERIENCE CARD ----------
export function ExperienceCard({
  listing,
  imagePath,
}: {
  listing: Listing;
  imagePath?: string;
}) {
  const { favorites, toggleFavorite } = useFavorites();
  const liked = favorites.includes(listing._id);

  const thumbnail = listing?.image?.[0] || imagePath;

  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <Link href={`/listings/${listing._id}`}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={listing.title}
              className={styles.cardImgTag}
            />
          ) : (
            <div>Ingen bild</div>
          )}
        </Link>

        <button
          className={styles.favoriteButton}
          onClick={() => toggleFavorite(listing._id)}
        >
          {liked ? "❤️" : "♡"}
        </button>
      </div>

      <div className={styles.cardInfo}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{listing.title}</span>
        </div>
        {listing.pricePerPerson && (
          <p className={styles.price}>{listing.pricePerPerson} kr / person</p>
        )}
      </div>
    </div>
  );
}
