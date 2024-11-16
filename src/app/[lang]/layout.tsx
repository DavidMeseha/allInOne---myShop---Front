import { ToastContainer } from "react-toastify";
import MainLayout from "../../components/layout/MainLayout";
import { Dictionaries, getDictionary, langs, Translation } from "../../dictionary";
import { Metadata } from "next";
import React, { ReactElement } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Ticktock Shop",
  description: "an ecommerce shop in the way of social media",
  openGraph: {
    type: "website",
    title: "Ticktock Shop",
    description: ""
  }
};

export async function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactElement;
  params: { lang: Dictionaries };
}) {
  const dictionary: Translation = await getDictionary(params.lang);

  return (
    <div dir={params.lang === "ar" ? "rtl" : "ltr"}>
      <MainLayout dictionary={dictionary} lang={params.lang}>
        {children}
        <ToastContainer />
      </MainLayout>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
