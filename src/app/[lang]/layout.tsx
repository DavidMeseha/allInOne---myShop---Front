import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../../components/layout/MainLayout";
import { Dictionaries, getDictionary, Translation } from "../../dictionary";
import { Metadata } from "next";
import "@/globals.css";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextRequest } from "next/server";

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
  children: ReactNode;
  params: { lang: Dictionaries };
}) {
  const dictionary: Translation = await getDictionary(params.lang);

  return (
    <html className="snap-both snap-mandatory" dir={params.lang === "ar" ? "rtl" : "ltr"} lang={params.lang}>
      <body>
        <MainLayout dictionary={dictionary} lang={params.lang}>
          {children}
          <ToastContainer />
          {/* <Test /> */}
        </MainLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export const loader = async ({ req }: { req: NextRequest }) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Use the pathname as needed
  console.log(pathname);

  return {
    props: {
      pathname
    }
  };
};
