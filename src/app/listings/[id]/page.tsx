"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./listingsID.module.css";
import { useBooking } from "../../context/BookingContext"; 
import { FiltersContext } from "@/app/layout";

interface Listing {
  _id: string;
  title: string;
  category: "accommodation" | "experience";
  location: string;
  price?: number;
  pricePerPerson?: number;
  description?: string;
  details?: string;
  image: string[];
  mapImage?: string;
  bedrooms?: number;
  rating?: number;
  rules?: string;
  activities?: string;
}

export default function ListingPage() {
  const params = useParams();
  const id = params?.id;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const { setBooking } = useBooking();
  const filtersContext = useContext(FiltersContext);
  const router = useRouter();

  if (!filtersContext) throw new Error("FiltersContext saknas!");

  const isExperience = listing?.category === "experience";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState({ adults: 0, children: 0, pets: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data: Listing = await res.json();

        if (Array.isArray(data.image) && data.image.length === 1 && data.image[0].includes(",")) {
          data.image = data.image[0].split(",").map((url) => url.trim());
        }

        setListing(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found</p>;

  const handleReserve = () => {
    setBooking({
      listing: {
        _id: listing._id,
        title: listing.title,
        image: listing.image[0],
        price: listing.price || listing.pricePerPerson || 0,
        rating: listing.rating,
      },
      dates: { start: startDate, end: endDate },
      guests,
    });

    router.push(`/reserve?listingId=${listing._id}`);
  };

  const changeGuest = (type: "adults" | "children" | "pets", delta: number) => {
    setGuests((prev) => {
      const newValue = Math.max(0, prev[type] + delta);
      return { ...prev, [type]: newValue };
    });
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <main className={style.mainBlock}>
          <div className={style.imageWrapper}>
            <img
              src={listing.image[currentImage]}
              alt={`${listing.title} ${currentImage + 1}`}
              className={style.cardImgTag}
            />
            {listing.image.length > 1 && (
              <div className={style.overlay}>
                <span className={style.imageCounter}>
                  {currentImage + 1} / {listing.image.length}
                </span>
                <div className={style.buttons}>
                  <button
                    onClick={() =>
                      setCurrentImage(
                        (prev) => (prev - 1 + listing.image.length) % listing.image.length
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage((prev) => (prev + 1) % listing.image.length)
                    }
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={style.titleRow}>
            <h1 className={style.title}>{listing.title}</h1>
            <p className={style.location}>{listing.location}</p>
          </div>

          <div className={style.detailsWrapper}>
            <div className={style.leftColumn}>
              {!isExperience && (
                <p className={style.description}>
                  Sovrum & gäster: {listing.bedrooms}
                </p>
              )}
              <p className={style.description}>Betyg: {listing.rating}</p>
              {!isExperience && <p className={style.description}>Regler: {listing.rules}</p>}
              <p className={style.description}>
                Beskrivning: {listing.details || listing.description}
              </p>
              <p className={style.description}>Aktiviteter: {listing.activities}</p>
            </div>

            <div className={style.rightColumn}>
              <div className={style.bookingCard}>
                <label>Incheckning</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

                <label>Utcheckning</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

                <label>Gäster</label>
                <div className={style.guestDropdown}>
                  <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {guests.adults} vuxna, {guests.children} barn, {guests.pets} djur
                  </button>
                  {dropdownOpen && (
                    <div className={style.dropdownContent}>
                      {(["adults", "children", "pets"] as const).map((type) => (
                        <div key={type} className={style.guestRow}>
                          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                          <button onClick={() => changeGuest(type, -1)}>-</button>
                          <span>{guests[type]}</span>
                          <button onClick={() => changeGuest(type, 1)}>+</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p>
                  Pris per natt: <strong>{listing.price || listing.pricePerPerson} kr</strong>
                </p>
                    <button onClick={handleReserve} className={style.reserve}>
                  Reservera
                </button>
              
              </div>
            </div>
          </div>

          {listing.mapImage && (
            <img
              src={listing.mapImage}
              alt={`Karta för ${listing.title}`}
              className={style.mapImg}
            />
          )}
        </main>
      </div>
    </div>
  );
}
