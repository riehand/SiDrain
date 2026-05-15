import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/lib/auth-context";
import { ReportsProvider } from "@/lib/reports-context";
import ToastNotifications from "@/components/glass/ToastNotifications";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "SiDrain — Sistem Pelaporan Saluran Air Tersumbat",
  description:
    "Platform digital untuk membantu masyarakat melaporkan masalah drainase seperti saluran tersumbat, sampah menumpuk, dan genangan air agar dapat segera ditindaklanjuti untuk pencegahan banjir.",
  keywords: "drainase, banjir, laporan, saluran air, pencegahan banjir",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        <SessionProvider>
          <AuthProvider>
            <ReportsProvider>
              {children}
              <ToastNotifications />
            </ReportsProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
