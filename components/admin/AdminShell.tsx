"use client";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginLeft: 0,
        minHeight: "100vh",
        paddingTop: "56px",   /* mobile top-bar */
      }}
      className="admin-shell"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem" }}>
        {children}
      </div>

      {/* Inline responsive override — guaranteed to work regardless of Tailwind */}
      <style>{`
        @media (min-width: 768px) {
          .admin-shell {
            margin-left: 256px !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
