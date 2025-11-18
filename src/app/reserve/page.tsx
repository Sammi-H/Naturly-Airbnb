"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./reserve.module.css";
import { useBooking } from "../context/BookingContext";
import Modal from "../components/Modal";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

type Dates = {
  start: string;
  end: string;
};

export default function BookingOverview() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const router = useRouter();

  const { listing: bookedListing, guests, dates, isLoggedIn, setBooking } =
    useBooking();
  const { adults = 0, children = 0, pets = 0 } = guests;
  const { start = "", end = "" } = dates;

  const [listing, setListing] = useState<any>(null);
  const [nights, setNights] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("");

  const [editingDates, setEditingDates] = useState(false);
  const [editingGuests, setEditingGuests] = useState(false);
  const [tempDates, setTempDates] = useState<Dates>({ start, end });
  const [tempGuests, setTempGuests] = useState<Guests>({
    adults,
    children,
    pets,
  });

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    onClose?: () => void;
  }>({ isOpen: false, title: "" });

  useEffect(() => {
    async function fetchFullListing(id: string) {
      const res = await fetch(`/api/listings/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setListing(data);
    }

    if (bookedListing && bookedListing._id === listingId) {
      setListing(bookedListing);
    } else if (listingId) {
      fetchFullListing(listingId);
    }
  }, [listingId, bookedListing]);

  useEffect(() => {
    if (start && end) {
      const diff =
        Math.ceil(
          (new Date(end).getTime() - new Date(start).getTime()) /
            (1000 * 60 * 60 * 24)
        ) || 0;
      setNights(diff > 0 ? diff : 0);
      setTempDates({ start, end });
    }
  }, [start, end]);

  useEffect(() => {
    setTempGuests({ adults, children, pets });
  }, [adults, children, pets]);

  if (!listing) return <p className="no-booking">Inga bokningar valda</p>;

  const totalPrice = (listing.price || 0) * nights;

  const handleBooking = async () => {
  if (!isLoggedIn) {
    return setModalConfig({
      isOpen: true,
      title: "Du måste logga in först",
      onClose: () => setModalConfig({ isOpen: false, title: "" }),
    });
  }

  if (!selectedPayment) {
    return setModalConfig({
      isOpen: true,
      title: "Välj ett betalningsalternativ",
      onClose: () => setModalConfig({ isOpen: false, title: "" }),
    });
  }

  try {
    // Skicka POST med cookie automatiskt
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({
        listingId: listing._id,
        startDate: start,
        endDate: end,
        guests,
        totalPrice,
        paymentMethod: selectedPayment,
        paid: true,
      }),
    });

    if (res.status === 401) throw new Error("Inte auktoriserad. Logga in igen.");
    if (!res.ok) throw new Error("Misslyckades med bokning");

    setModalConfig({
      isOpen: true,
      title: "Din bokning är nu betald och genomförd.",
      onClose: () => {
        setBooking({
          listing: undefined,
          guests: { adults: 0, children: 0, pets: 0 },
          dates: { start: "", end: "" },
        });
        setSelectedPayment("");
        router.push("/");
      },
    });
  } catch (err) {
    console.error(err);
    setModalConfig({
      isOpen: true,
      title: err instanceof Error ? err.message : "Kunde inte slutföra bokningen. Försök igen.",
      onClose: () => setModalConfig({ isOpen: false, title: "" }),
    });
  }
};



  const saveDates = () => {
    setBooking({ listing: bookedListing, guests, dates: tempDates });
    setEditingDates(false);
  };

  const saveGuests = () => {
    setBooking({ listing: bookedListing, guests: tempGuests, dates });
    setEditingGuests(false);
  };

  return (
    <div className={styles["booking-wrapper"]}>
      <h1 className={styles["booking-header"]}>Bokningsöversikt</h1>

      <div className={styles["main-content"]}>
        {/* Vänsterspalt */}
        <div className={styles["left-column"]}>
          <div className={styles["overview-section"]}>
            <img
              src={Array.isArray(listing.image) ? listing.image[0] : listing.image}
              alt={listing.title}
              className={styles["listing-image"]}
            />
            <div className={styles["details-wrapper"]}>
              <h2>{listing.title}</h2>
              <p>Omdöme: {listing.rating || "Ej betygsatt"}</p>
            </div>
          </div>

          <div className={styles["price-section"]}>
            {/* Datum */}
            <div className={styles["row"]}>
              {!editingDates ? (
                <>
                  <span>
                    Datum: {start || "-"} – {end || "-"}
                  </span>
                  <div className={styles["guest-buttons"]}>
                    <button
                      className={styles["edit-button"]}
                      onClick={() => setEditingDates(true)}
                    >
                      Ändra
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <input
                    type="date"
                    value={tempDates.start}
                    onChange={(e) =>
                      setTempDates({ ...tempDates, start: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    value={tempDates.end}
                    onChange={(e) =>
                      setTempDates({ ...tempDates, end: e.target.value })
                    }
                  />
                  <div className={styles["guest-buttons"]}>
                    <button className={styles["edit-button"]} onClick={saveDates}>
                      Spara
                    </button>
                    <button
                      className={styles["edit-button"]}
                      onClick={() => setEditingDates(false)}
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gäster */}
            <div className={styles["row"]}>
              {!editingGuests ? (
                <>
                  <span>
                    Gäster: {adults} vuxna, {children} barn, {pets} husdjur
                  </span>
                  <button
                    className={styles["edit-button"]}
                    onClick={() => setEditingGuests(true)}
                  >
                    Ändra
                  </button>
                </>
              ) : (
                <div className={styles["guest-inputs"]}>
                  <div className={styles["guest-input"]}>
                    <label>Vuxna</label>
                    <input
                      type="number"
                      min={0}
                      value={tempGuests.adults}
                      onChange={(e) =>
                        setTempGuests({
                          ...tempGuests,
                          adults: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className={styles["guest-input"]}>
                    <label>Barn</label>
                    <input
                      type="number"
                      min={0}
                      value={tempGuests.children}
                      onChange={(e) =>
                        setTempGuests({
                          ...tempGuests,
                          children: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className={styles["guest-input"]}>
                    <label>Husdjur</label>
                    <input
                      type="number"
                      min={0}
                      value={tempGuests.pets}
                      onChange={(e) =>
                        setTempGuests({
                          ...tempGuests,
                          pets: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className={styles["guest-buttons"]}>
                    <button className={styles["edit-button"]} onClick={saveGuests}>
                      Spara
                    </button>
                    <button
                      className={styles["edit-button"]}
                      onClick={() => setEditingGuests(false)}
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p>Antal nätter: {nights}</p>
            <p>Pris per natt: {listing.price} kr</p>
            <p>Totalt att betala: {totalPrice} kr</p>
          </div>
        </div>

        {/* Högerspalt */}
        <div className={styles["right-column"]}>
          <div className={styles["payment-column"]}>
            <h3 style={{ textAlign: "center", marginBottom: "1.5em" }}>
              Betalningsalternativ
            </h3>
            {["Swish", "Visa", "Mastercard", "Paypal"].map((method) => (
              <div key={method} className={styles["payment-method"]}>
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
            <div style={{ textAlign: "center", marginTop: "1.5em" }}>
              <button className={styles.paymentbtn} onClick={handleBooking}>
                Boka & betala
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        onClose={modalConfig.onClose}
      />
    </div>
  );
}
