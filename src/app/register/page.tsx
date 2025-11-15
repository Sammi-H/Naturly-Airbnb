"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./register.module.css";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleRegister = async () => {
    setError("");

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Något gick fel");
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error("Failed to register user", err);
      setError("Något gick fel, försök igen senare");
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.registerContent}>
        <FontAwesomeIcon icon={faUser} className={styles.userIcon} />

        <label className={styles.label}>Username:</label>
        <input
          className={styles.input}
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className={styles.label}>Email:</label>
        <input
          className={styles.input}
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles.label}>Password:</label>
        <input
          className={styles.input}
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={styles.buttons}>
          <button className={styles.register} onClick={handleRegister}>
            Registrera
          </button>
          <button className={styles.register} onClick={handleLoginRedirect}>
            Logga in
          </button>
        </div>
      </div>
    </div>
  );
}
