import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SideMenu from "@/components/side-menu";
import { auth } from "@/auth";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Acte de Présence",
  description: "Acte de Présence",
  icons: {
      icon: "/img/favicon/favicon.ico",
      apple: "/img/favicon/apple-touch-icon.png",
      other: [
          { rel: "icon", type: "image/png", url: "/img/favicon/favicon.png" },
          { rel: "icon", type: "image/png", url: "/img/favicon/favicon-32x32.png" },
          { rel: "icon", type: "image/png", url: "/img/favicon/favicon-16x16.png" },
      ]
  },
  manifest: "/img/favicon/site.webmanifest",
  generator: "Acte de Présence",
  applicationName: "Acte de Présence",
  referrer: "strict-origin-when-cross-origin",
  keywords: ["Acte de Présence", "Acte de Présence", "Acte de Présence"],
  authors: [{ name: "Combat Jongerenmarketing", url: "https://combat.nl" }],
  publisher: "Combat Jongerenmarketing",
  robots: {
      index: false,
      follow: false,
  },
};
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
