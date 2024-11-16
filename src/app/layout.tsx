import "react-toastify/dist/ReactToastify.css";
import { Dictionaries } from "@/dictionary";
import { Metadata } from "next";
import React, { ReactElement } from "react";
import "@/globals.css";
import "react-loading-skeleton/dist/skeleton.css";

export const metadata: Metadata = {
  title: "Ticktock Shop",
  description: "an ecommerce shop in the way of social media",
  openGraph: {
    type: "website",
    title: "Ticktock Shop",
    description: ""
  }
};

export default async function RootLayout({
  children,
  params
}: {
  children: ReactElement;
  params: { lang: Dictionaries };
}) {
  return (
    <html className="snap-both snap-mandatory" dir={params.lang === "ar" ? "rtl" : "ltr"} lang={params.lang}>
      <body
        className={`w-auto overflow-x-hidden md:w-screen ${params.lang === "ar" ? "md:ms-4" : ""} md:pr-4`}
        dir="ltr"
      >
        {children}
      </body>
    </html>
  );
}
