import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBarWrapper from "@/app/components/publico/NavBarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FutZone",
  description: "Bienvenido a FutZone, tu destino para todo lo relacionado con el fútbol",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        
         <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}
