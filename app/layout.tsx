import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Alex Johnson — Full Stack Developer & Designer",
    template: "%s | Alex Johnson",
  },
  description:
    "Full Stack Developer & UI/UX Designer specializing in modern web applications. View my portfolio and get in touch.",
  keywords: [
    "portfolio",
    "developer",
    "full stack",
    "react",
    "next.js",
    "designer",
  ],
  authors: [{ name: "Alex Johnson" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Alex Johnson — Full Stack Developer",
    description: "Full Stack Developer & UI/UX Designer portfolio",
    siteName: "Alex Johnson Portfolio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "#0a0a0f", color: "#e2e8f0" }}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111118",
              color: "#e2e8f0",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "10px",
            },
            success: {
              iconTheme: { primary: "#6366f1", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
