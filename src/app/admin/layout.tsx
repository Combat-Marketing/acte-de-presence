import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
    title: "Acte de Présence",
    description: "Acte de Présence",
    icons: {
        icon: "/admin/favicon/favicon.ico",
        apple: "/admin/favicon/apple-touch-icon.png",
        other: [
            { rel: "icon", type: "image/png", url: "/admin/favicon/favicon.png" },
            { rel: "icon", type: "image/png", url: "/admin/favicon/favicon-32x32.png" },
            { rel: "icon", type: "image/png", url: "/admin/favicon/favicon-16x16.png" },
        ]
    },
    manifest: "/admin/favicon/site.webmanifest",
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
