import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth({ setPage, setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    let response;
    if (isSignUp) {
      response = await supabase.auth.signUp({ email, password });
    } else {
      response = await supabase.auth.signInWithPassword({ email, password });
    }

    if (response.error) {
      setErrorMsg(response.error.message);
    } else {
      if (response.data.user) {
        setUser(response.data.user);
        setPage("browse");
      } else if (isSignUp) {
        alert("Check your email for the confirmation link!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
          🔎 FindIt
        </div>
        <div className="nav-links">
          <a href="#" onClick={() => setPage("home")}>Home</a>
          <a href="#" onClick={() => setPage("browse")}>Browse</a>
        </div>
      </nav>

      <div style={{ maxWidth: "400px", margin: "60px auto", padding: "30px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", color: "#1e293b" }}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
          {isSignUp ? "Sign up to post lost & found items" : "Log in to post and manage items"}
        </p>

        {errorMsg && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "6px", fontSize: "13px", marginBottom: "15px" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }}
            />
          </div>

          <button type="submit" disabled={loading} className="primary-button" style={{ marginTop: "10px" }}>
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#64748b" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: "#2563eb", fontWeight: "bold", cursor: "pointer" }}
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}