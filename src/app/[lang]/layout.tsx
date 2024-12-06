import { ToastContainer } from "react-toastify";
import MainLayout from "../../components/layout/MainLayout";
import { getDictionary } from "../../dictionary";
import React, { ReactElement } from "react";
import { cookies } from "next/headers";
import { Language } from "@/types";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { languages } from "@/lib/misc";
import Transition from "@/context/Transition";

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function Layout(props: { children: ReactElement<any>; params: Promise<{ lang: Language }> }) {
  const params = await props.params;

  const { children } = props;

  const dictionary = await getDictionary(params.lang);
  const token = (await cookies()).get("session")?.value;

  return (
    <html className="snap-both snap-mandatory" dir={params.lang === "ar" ? "rtl" : "ltr"} lang={params.lang}>
      <body
        className={`w-auto overflow-x-hidden md:w-screen ${params.lang === "ar" ? "md:ms-4" : ""} md:pr-4`}
        dir="ltr"
      >
        <div dir={params.lang === "ar" ? "rtl" : "ltr"}>
          <MainLayout dictionary={dictionary} lang={params.lang} token={token}>
            <Transition>{children}</Transition>
            <ToastContainer />
          </MainLayout>
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
