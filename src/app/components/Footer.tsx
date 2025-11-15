"use client";
import Image from "next/image";
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function BottomNav() {
  return (
    <div className={styles.bottomNav}>
      

      <div className={styles.navGrid}>
        {/* Kolumn 1 */}
        <div>
          <p className={styles.title}>Om oss</p>
          <p>Om oss</p>
        </div>

        {/* Kolumn 2 */}
        <div>
          <p className={styles.title}>Hjälp</p>
          <p>Fäk</p>
          <p>Kontakta oss</p>
          <p>Villkor</p>
          <p>Integritet</p>
        </div>

        {/* Kolumn 3 */}
        <div>
          <p className={styles.title}>Håll kontakten</p>
          <p>Nyhetsbrev</p>
          <div className={styles.icons}>
            <FaInstagram />
            <FaFacebookF />
            <FaTiktok />
            <FaWhatsapp />
          </div>
        </div>
      </div>
    </div>
  );
}
