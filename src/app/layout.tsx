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
  }
};

export default async function RootLayout({ children }: { children: ReactElement }) {
  return <>{children}</>;
}
