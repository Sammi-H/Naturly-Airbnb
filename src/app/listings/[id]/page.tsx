"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./listingsID.module.css";
import { useBooking } from "../../context/BookingContext"; 
import { FiltersContext } from "../../layout"; // path till FiltersContext

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
  const { filters } = useContext(FiltersContext)!; // använder FiltersContext
  const router = useRouter();

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

  const isExperience = listing.category === "experience";

  const handleReserve = () => {
    console.log("Filters vid reservering:", filters); 
    setBooking({
      listing: {
        _id: listing._id,
        title: listing.title,
        image: listing.image[0],
        price: listing.price || listing.pricePerPerson || 0,
        rating: listing.rating,
      },
      dates: {
        start: filters.startDate || "",
        end: filters.endDate || "",
      },
      guests: {
        adults: filters.adults || 0,
        children: filters.children || 0,
      },
    });
    console.log("Filters:", filters);

router.push(
  `/reserve?listingId=${listing._id}&start=${filters.startDate}&end=${filters.endDate}&adults=${filters.adults}&children=${filters.children}`
);



  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <main className={style.mainBlock}>
          <h1 className={style.title}>{listing.title}</h1>

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
                        (prev) =>
                          (prev - 1 + listing.image.length) %
                          listing.image.length
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage(
                        (prev) => (prev + 1) % listing.image.length
                      )
                    }
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={style.infoCard}>
            <p className={style.location}>Plats: {listing.location}</p>
            <p className={style.description}>Betyg: {listing.rating}</p>
            <p className={style.description}>
              Beskrivning: {listing.details || listing.description}
            </p>
            <p className={style.description}>
              Aktiviteter: {listing.activities}
            </p>

            {!isExperience && (
              <>
                <p className={style.description}>
                  Sovrum & gäster: {listing.bedrooms}
                </p>
                <p className={style.description}>Regler: {listing.rules}</p>
              </>
            )}

            <p className={style.price}>
              Pris:{" "}
              <strong>{listing.price || listing.pricePerPerson} kr</strong>
            </p>
          </div>

          {listing.mapImage && (
            <img
              src={listing.mapImage}
              alt={`Karta för ${listing.title}`}
              className={style.mapImg}
            />
          )}

          <button onClick={handleReserve} className={style.reserve}>
            Reservera
          </button>
        </main>
      </div>
    </div>
  );
}
