"use client";

import { useEffect, useState } from "react";
import styles from "./MyBookings.module.css";

interface Guests {
  adults: number;
  children: number;
  pets: number;
}

interface Booking {
  _id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  guests: Guests;
  totalPrice: number;
  paymentMethod: string;
  paid: boolean;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings/bookingsme");
      if (!res.ok) throw new Error("Misslyckades med att hämta bokningar");
      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Okänt fel");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/bookingsme?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Misslyckades med att ta bort bokningen");
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Okänt fel");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className={styles.message}>Laddar bokningar...</p>;
  if (error) return <p className={`${styles.message} ${styles.error}`}>{error}</p>;
  if (bookings.length === 0) return <p className={styles.message}>Inga bokningar hittades.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mina bokningar</h1>
      <div className={styles.grid}>
        {bookings.map((b) => (
          <div key={b._id} className={styles.card}>
            <p><span className={styles.label}>Boende ID:</span> {b.listingId}</p>
            <p><span className={styles.label}>Datum:</span> {b.startDate} → {b.endDate}</p>
            <p>
              <span className={styles.label}>Gäster:</span> {b.guests.adults} vuxna, {b.guests.children} barn, {b.guests.pets} husdjur
            </p>
            <p><span className={styles.label}>Pris:</span> {b.totalPrice} kr</p>
            <p><span className={styles.label}>Betalmetod:</span> {b.paymentMethod}</p>
            <p><span className={styles.label}>Status:</span> {b.paid ? "Betald ✅" : "Ej betald ❌"}</p>
            <button className={styles.deleteBtn} onClick={() => handleDelete(b._id)}>Ta bort</button>
          </div>
        ))}
      </div>
    </div>
  );
}
