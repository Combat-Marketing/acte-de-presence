import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SideMenu from "@/components/side-menu";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Acte de Présence Admin",
  description: "Admin interface for Acte de Présence",
  icons: {
    icon: "/admin/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <SideMenu />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
