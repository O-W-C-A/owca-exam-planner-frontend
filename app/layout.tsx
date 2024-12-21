import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const globalMetadata = {
  title: "Exams Planner",
  description: "Exams Planner for USV by OWCA organization",
};

export const metadata = globalMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pageTitle = globalMetadata.title;
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/usv_logo.ico" />
        {/* Page Title */}
        <title>{pageTitle}</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-50`}>
        {children}
      </body>
    </html>
  );
}
