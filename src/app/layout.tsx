import "react-toastify/dist/ReactToastify.css";
import { Metadata } from "next";
import React, { ReactElement } from "react";
import "@/globals.css";
import "react-loading-skeleton/dist/skeleton.css";

export const metadata: Metadata = {
  title: "TechShop",
  description: "an ecommerce shop in the way of social Interaction",
  openGraph: {
    type: "website",
    title: "TechShop",
    description: ""
  },
  verification: {
    google: "LNXuD0OB-K9UiZBq_wJGKs72Ypb6eJ2Y1I-GvhN7a_o"
  }
};

export default async function RootLayout({ children }: { children: ReactElement<any> }) {
  return <>{children}</>;
}
