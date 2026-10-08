import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Facility Maintenance System | Woxsen University",
  description:
    "Campus Facility Maintenance Request Management System built with Next.js and Prisma ORM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
