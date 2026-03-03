// src/components/Login.tsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface LoginProps {
  onLogin: (userId: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep user logged in across reloads / devices
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        onLogin(data.session.user.id);
      }
    };
    getUser();

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          onLogin(session.user.id);
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return;

    setLoading(true);
    try {
      if (isRegister) {
        // Register new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin }, // optional confirmation link
        });
        if (error) throw error;

        if (data.user) {
          // If email confirmation is enabled, notify user
          if (!data.user.confirmed_at) {
            alert(
              "Registration successful! Please check your email to confirm your account."
            );
          } else {
            onLogin(data.user.id);
          }
        }
      } else {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onLogin(data.user.id);
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Register" : "Login"} - Finance Tracker</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>
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