import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "snip.link — Shorten any link. Track every click.",
  description:
    "Turn long URLs into sharp, trackable links with real-time analytics on clicks, referrers, and geography.",
  keywords: ["url shortener", "link shortener", "analytics", "tracking"],
  openGraph: {
    title: "snip.link",
    description: "Shorten any link. Track every click.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-snip-text antialiased overflow-x-hidden">
        <div
          className="fixed inset-0 dot-grid-bg opacity-35 pointer-events-none z-0"
          aria-hidden="true"
        />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
