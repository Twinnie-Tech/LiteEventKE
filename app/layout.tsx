import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MlimaEvents",
  description: "Find concerts, weddings, church gatherings, meetups and conferences happening around Mt Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(function(){function clean(){document.querySelectorAll("[data-cursor-ref]").forEach(function(el){el.removeAttribute("data-cursor-ref")})}clean();new MutationObserver(clean).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:["data-cursor-ref"]})})();`,
        }}
      />
      <Navbar />

          <div className="pointer-events-none fixed inset-0 z-[-1]">
              <LightRays
                  raysOrigin="top-center-offset"
                  raysColor="#f5a524"
                  raysSpeed={0.5}
                  lightSpread={0.9}
                  rayLength={1.4}
                  followMouse={true}
                  mouseInfluence={0.02}
                  noiseAmount={0.0}
                  distortion={0.01}
              />
          </div>

          <main>
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}
