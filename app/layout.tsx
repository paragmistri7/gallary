import type { Metadata } from "next";
import "./globals.css";// 👈 new file
import Providers from "./providers";

export const metadata: Metadata = {
  title: "My Gallary App",
  description: "Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}