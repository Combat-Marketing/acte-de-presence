import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SideMenu from "@/components/side-menu";
import { auth } from "@/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {isLoggedIn && <SideMenu />}
          <main className={`flex-1 overflow-auto ${!isLoggedIn ? 'w-full' : ''}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
