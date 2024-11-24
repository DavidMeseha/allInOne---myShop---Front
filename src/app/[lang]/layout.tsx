import { ToastContainer } from "react-toastify";
import MainLayout from "../../components/layout/MainLayout";
import { Dictionaries, getDictionary, langs } from "../../dictionary";
import React, { ReactElement } from "react";
import { cookies } from "next/headers";
import axios from "@/lib/axios";
import { User } from "@/types";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  const dictionary = await getDictionary(params.lang);

  const token = cookies().get("session")?.value;
  const user = await axios
    .get<User>("/api/auth/check", { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data)
    .catch(() => null);

  return (
    <html className="snap-both snap-mandatory" dir={params.lang === "ar" ? "rtl" : "ltr"} lang={params.lang}>
      <body
        className={`w-auto overflow-x-hidden md:w-screen ${params.lang === "ar" ? "md:ms-4" : ""} md:pr-4`}
        dir="ltr"
      >
        <div dir={params.lang === "ar" ? "rtl" : "ltr"}>
          <MainLayout dictionary={dictionary} lang={params.lang} token={token} user={user ?? null}>
            {children}
            <ToastContainer />
          </MainLayout>
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
