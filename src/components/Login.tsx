// src/components/Login.tsx
import { useState } from "react";

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  // Simple hash function for demonstration (not production-grade)
  const hash = (str: string) =>
    Array.from(str).reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    const storedUser = localStorage.getItem(`user_${username}`);

    if (isRegister) {
      if (storedUser) {
        setError("Username already exists");
        return;
      }
      // Save new user with hashed password
      localStorage.setItem(`user_${username}`, JSON.stringify({ passwordHash: hash(password) }));
      onLogin(username);
    } else {
      if (!storedUser) {
        setError("User not found");
        return;
      }
      const data = JSON.parse(storedUser);
      if (data.passwordHash === hash(password)) {
        onLogin(username);
      } else {
        setError("Incorrect password");
        return;
      }
    }
    // Clear error and password after successful login/register
    setError("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Register" : "Login"} - Finance Tracker</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="toggle-text">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          className="toggle-btn"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}