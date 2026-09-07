import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Report from "./pages/Report";
import Auth from "./pages/Auth";
import "./App.css";

function Home({ setPage, user }) {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">🔎 FindIt</div>
        <div className="nav-links">
          <a href="#" onClick={() => setPage("home")}>Home</a>
          <a href="#" onClick={() => setPage("browse")}>Browse Items</a>
          <a href="#" onClick={() => setPage("report")}>Report</a>
          {user ? (
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="secondary-button" 
              style={{ padding: "6px 12px", fontSize: "13px" }}
            >
              Logout ({user.email.split("@")[0]})
            </button>
          ) : (
            <a href="#" onClick={() => setPage("auth")} style={{ fontWeight: "bold", color: "#2563eb" }}>
              Login
            </a>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="tagline">CAMPUS LOST & FOUND</p>
          <h1>
            Lost something?
            <br />
            <span>Let's Find It.</span>
          </h1>
          <p className="description">
            A simple place for students to report lost items,
            share found items, and help return things to their owners.
          </p>

          <div className="hero-buttons">
            <button className="primary-button" onClick={() => setPage("browse")}>
              🔍 Find an Item
            </button>
            <button className="secondary-button" onClick={() => setPage("report")}>
              + Report an Item
            </button>
          </div>
        </div>
      </section>

      <section className="options">
        <h2>What happened?</h2>
        <p className="section-description">Choose an option to get started.</p>

        <div className="option-container">
          <div className="option-card">
            <div className="icon">🔑</div>
            <h3>I Lost Something</h3>
            <p>Tell other students what you lost and where you last saw it.</p>
            <button className="card-button" onClick={() => setPage("report")}>
              Report Lost Item →
            </button>
          </div>

          <div className="option-card">
            <div className="icon">📦</div>
            <h3>I Found Something</h3>
            <p>Found someone's belongings? Help them get it back.</p>
            <button className="card-button" onClick={() => setPage("report")}>
              Report Found Item →
            </button>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2026 FindIt · Helping students find what they lost.</p>
      </footer>
    </div>
  );
}

function Browse({ items, setPage, toggleStatus, deleteItem, loading, toastMessage, user }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q));

    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#1e293b",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            fontSize: "14px",
            fontWeight: "bold"
          }}
        >
          {toastMessage}
        </div>
      )}

      <nav className="navbar">
        <div className="logo">🔎 FindIt</div>
        <div className="nav-links">
          <a href="#" onClick={() => setPage("home")}>Home</a>
          <a href="#" onClick={() => setPage("browse")}>Browse Items</a>
          <a href="#" onClick={() => setPage("report")}>Report</a>
          {user ? (
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="secondary-button" 
              style={{ padding: "6px 12px", fontSize: "13px" }}
            >
              Logout ({user.email.split("@")[0]})
            </button>
          ) : (
            <a href="#" onClick={() => setPage("auth")} style={{ fontWeight: "bold", color: "#2563eb" }}>
              Login
            </a>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ color: "#172033", fontSize: "32px", textAlign: "center" }}>
          Browse Lost & Found Items
        </h1>
        <p style={{ color: "#64748b", textAlign: "center", marginBottom: "25px" }}>
          Look through items reported by other students across campus.
        </p>

        {/* Search & Category Filter Controls */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", maxWidth: "650px", margin: "0 auto 20px auto", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="🔍 Search title, location, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: "2",
              minWidth: "200px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              background: "white",
              color: "#172033"
            }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              flex: "1",
              minWidth: "160px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              background: "white",
              color: "#172033",
              fontWeight: "bold"
            }}
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Keys & ID Cards">Keys & ID Cards</option>
            <option value="Clothing & Bags">Clothing & Bags</option>
            <option value="Books & Stationary">Books & Stationary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Type Filter Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "30px" }}>
          <button className={typeFilter === "all" ? "primary-button" : "secondary-button"} onClick={() => setTypeFilter("all")}>
            All Items
          </button>
          <button className={typeFilter === "lost" ? "primary-button" : "secondary-button"} onClick={() => setTypeFilter("lost")}>
            🔑 Lost Items
          </button>
          <button className={typeFilter === "found" ? "primary-button" : "secondary-button"} onClick={() => setTypeFilter("found")}>
            📦 Found Items
          </button>
        </div>

        {/* Grid Display */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b", marginTop: "40px" }}>Loading database items...</p>
        ) : filteredItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", marginTop: "40px" }}>No matching items found.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {filteredItems.map((item) => {
              const isResolved = item.status === "resolved";
              return (
                <div 
                  key={item.id} 
                  style={{ 
                    position: "relative",
                    background: "white", 
                    borderRadius: "12px", 
                    border: "1px solid #e5e7eb", 
                    overflow: "hidden", 
                    textAlign: "left",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    opacity: isResolved ? 0.65 : 1
                  }}
                >
                  <button
                    onClick={() => deleteItem(item.id)}
                    title="Delete Report"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "14px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                      zIndex: 10
                    }}
                  >
                    🗑️
                  </button>

                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "140px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>
                      {item.type === "lost" ? "🔑" : "📦"}
                    </div>
                  )}

                  <div style={{ padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ 
                        background: item.type === "lost" ? "#fee2e2" : "#dcfce7", 
                        color: item.type === "lost" ? "#991b1b" : "#166534", 
                        padding: "4px 8px", 
                        borderRadius: "4px", 
                        fontSize: "12px", 
                        fontWeight: "bold",
                        textTransform: "uppercase"
                      }}>
                        {item.type}
                      </span>

                      {isResolved && (
                        <span style={{ background: "#e2e8f0", color: "#475569", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                          ✅ RESOLVED
                        </span>
                      )}
                    </div>

                    <h3 style={{ color: "#172033", fontSize: "18px", marginTop: "10px", marginBottom: "8px", textDecoration: isResolved ? "line-through" : "none" }}>
                      {item.title}
                    </h3>

                    <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0" }}>📍 <strong>Location:</strong> {item.location}</p>
                    <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0" }}>🏷️ <strong>Category:</strong> {item.category}</p>
                    <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0" }}>👤 <strong>Contact:</strong> {item.contact_name || "Anonymous"} ({item.contact_info || "N/A"})</p>

                    {item.description && (
                      <p style={{ color: "#475569", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>
                        "{item.description}"
                      </p>
                    )}

                    <button 
                      onClick={() => toggleStatus(item.id, item.status)}
                      style={{ 
                        marginTop: "15px", width: "100%", padding: "8px", borderRadius: "6px", border: "none", 
                        background: isResolved ? "#cbd5e1" : "#10b981", color: "white", fontWeight: "bold", cursor: "pointer" 
                      }}
                    >
                      {isResolved ? "↩️ Re-open Item" : item.type === "lost" ? "🎉 Found My Item!" : "🤝 Returned to Owner"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [user, setUser] = useState(null);

  // Check active user session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "resolved" : "active";
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );

    showToast(nextStatus === "resolved" ? "🎉 Item marked as resolved!" : "↩️ Item re-opened.");

    await supabase.from("items").update({ status: nextStatus }).eq("id", id);
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast("🗑️ Item report deleted successfully.");
      await supabase.from("items").delete().eq("id", id);
    }
  };

  if (page === "auth") return <Auth setPage={setPage} setUser={setUser} />;
  if (page === "report") return <Report setPage={setPage} refreshItems={fetchItems} user={user} />;
  if (page === "browse") return <Browse items={items} setPage={setPage} toggleStatus={toggleStatus} deleteItem={deleteItem} loading={loading} toastMessage={toastMessage} user={user} />;
  return <Home setPage={setPage} user={user} />;
}