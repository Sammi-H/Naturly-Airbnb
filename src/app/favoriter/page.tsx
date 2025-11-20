"use client";
import { useEffect, useState } from "react";
import styles from "../listings/ListingCard.module.css";
import { useFavorites } from "../listings/page";
import { ListingCard } from "../listings/page"; 

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

export default function FavoritesPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const { favorites } = useFavorites();

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings");
        const data: Listing[] = await res.json();
        const favoriteListings = data.filter((l) => favorites.includes(l._id));
        setListings(favoriteListings);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    }
    fetchListings();
  }, [favorites]);

  if (listings.length === 0) return <p>Inga favoriter hittades</p>;

  return (
    <div className={styles.listingsGrid}>
      {listings.map((listing) => (
        <ListingCard
          key={listing._id}
          listing={listing}
          imagePath={listing.image?.[0] || listing.imagePath}
          showDogIcon={listing.petfriendly}
        />
      ))}
    </div>
  );
}
