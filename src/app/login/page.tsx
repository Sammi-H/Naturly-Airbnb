"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./login.module.css";
import { useBooking } from "../context/BookingContext"; 

export default function Login() {
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { setIsLoggedIn } = useBooking(); 

  const handleLogin = async () => {
    try {
      setError("");

      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Något gick fel");
        return;
      }

      setIsLoggedIn(true); 
      router.push("/");

    } catch (error) {
      console.error("Login error:", error);
      setError("Något gick fel vid inloggning");
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContent}>
        <FontAwesomeIcon icon={faUser} className={styles.userIcon} />

        <label className={styles.label}>Username:</label>
        <input
          className={styles.input}
          type="text"
          value={username}
          placeholder="Användarnamn"
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label className={styles.label}>Password:</label>
        <input
          className={styles.input}
          type="password"
          value={password}
          placeholder="Lösenord"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={styles.buttons}>
          <button className={styles.loginBtn} onClick={handleLogin}>
            Logga in
          </button>
          <button className={styles.registerBtn} onClick={handleRegister}>
            Registrera
          </button>
        </div>
      </div>
    </div>
  );
}
