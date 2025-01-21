import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";

const inter = Inter({
  subsets: ["latin"],
  display: "block",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const globalMetadata = {
  title: "Exams Planner",
  description: "Exams Planner for USV by OWCA organization",
};

export const metadata = globalMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${notoSans.className}`}>
      <head>
        <link rel="icon" href="/usv_logo.ico" />
        <title>{globalMetadata.title}</title>
      </head>
      <body className="antialiased bg-blue-50">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
