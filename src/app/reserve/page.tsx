"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoginModal from "../components/modal";
import styles from "./reserve.module.css";

export default function BookingOverview() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const start = searchParams.get("start") || "";
  const end = searchParams.get("end") || "";
  const adults = Number(searchParams.get("adults") || 0);
  const children = Number(searchParams.get("children") || 0);

  const [listing, setListing] = useState<any>(null);
  const [nights, setNights] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Hämta listing
  useEffect(() => {
    if (!listingId) return;
    fetch(`/api/listings/${listingId}`)
      .then((res) => res.json())
      .then((data) => setListing(data));
  }, [listingId]);

  // Beräkna nätter
  useEffect(() => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 0);
    }
  }, [start, end]);

  if (!listing) return <p className="no-booking">Inga bokningar valda</p>;

  const totalPrice = (listing.price || 0) * nights;

  const handleBooking = () => {
    if (!isLoggedIn) return setShowModal(true);
    setConfirmation("Din bokning är nu betald och genomförd.");
  };

  return (
    <div className={styles["booking-wrapper"]}>
      <h1 className={styles["booking-header"]}>Bokningsöversikt</h1>

      <div className={styles["overview-section"]}>
        <img
          src={Array.isArray(listing.image) ? listing.image[0] : listing.image}
          alt={listing.title}
          className={styles["listing-image"]}
        />

        <div className={styles["details-wrapper"]}>
          <h2>{listing.title}</h2>
          <p>Omdöme: {listing.rating || "Ej betygsatt"}</p>
          <p>Datum: {start || "-"} – {end || "-"}</p>
          <p>Gäster: {adults} vuxna, {children} barn</p>
          <p>Antal nätter: {nights}</p>
        </div>
      </div>

      <div className={styles["price-section"]}>
        <p>Pris per natt: {listing.price} kr</p>
        <p>Antal nätter: {nights}</p>
        <p>Totalt att betala: {totalPrice} kr</p>
      </div>

      <div className={styles["payment-section"]}>
        {["Swish", "Visa", "Mastercard", "Paypal"].map((method) => (
          <div key={method}>
            <span>{method}</span>
            <input
              type="radio"
              name="payment"
              value={method}
              checked={selectedPayment === method}
              onChange={(e) => setSelectedPayment(e.target.value)}
            />
          </div>
        ))}

        <button onClick={handleBooking}>Boka och betala</button>
      </div>

      {confirmation && <p>{confirmation}</p>}
      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
