"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2 } from "lucide-react";

const NAV = [
  { id: "home",     label: "Home" },
  { id: "about",    label: "About" },
  { id: "skills",   label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact",  label: "Contact" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [active,      setActive]      = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const ids = [...NAV].map(n => n.id).reverse();
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    scrollTo(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          background: scrolled
            ? "rgba(7,7,15,0.94)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          padding: scrolled ? "0.7rem 0" : "1.1rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 var(--container-pad)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          {/* ── Logo ── */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={() => scrollTo("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Code2 size={17} color="#fff" />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              <span className="gradient-text">Alex</span>
              <span style={{ color: "#64748b" }}>.dev</span>
            </span>
          </motion.button>

          {/* ── Desktop nav ── */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
            className="desktop-nav"
          >
            {NAV.map(link => {
              const isActive = active === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`nav-link${isActive ? " active" : ""}`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.45rem 0.85rem",
                    borderRadius: 8,
                    position: "relative",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-highlight"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 8,
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                      }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 1 }}>
                    {link.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* ── CTA + mobile toggle ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            {/* Hire Me */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNav("contact")}
              className="hire-btn"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.38)",
                border: "none",
                borderRadius: 10,
                padding: "0.55rem 1.3rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              Hire Me
            </motion.button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                cursor: "pointer",
              }}
              className="mobile-only"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              zIndex: 40,
              background: "rgba(7,7,15,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              padding: "0.75rem 1.25rem 1rem",
            }}
          >
            {NAV.map(link => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  background: active === link.id ? "rgba(99,102,241,0.1)" : "transparent",
                  border: "none",
                  color: active === link.id ? "#a78bfa" : "#94a3b8",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  marginBottom: "0.25rem",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("contact")}
              style={{
                display: "block",
                width: "100%",
                marginTop: "0.5rem",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                color: "#fff",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Hire Me
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Responsive utilities ── */}
      <style>{`
        .desktop-nav { display: none; }
        .hire-btn    { display: none; }
        .mobile-only { display: flex !important; }

        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .hire-btn    { display: inline-flex !important; }
          .mobile-only { display: none !important; }
        }
      `}</style>
    </>
  );
}
