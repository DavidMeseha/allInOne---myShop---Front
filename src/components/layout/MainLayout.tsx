"use client";

import ProgressBarProvider from "@/context/ProgressBarProvider";
import UserProvider from "@/context/user";
import AllOverlays from "@/components/overlays/AllOverlays";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useState } from "react";
import BottomNav from "./includes/BottomNav";
import { QueryClient } from "@tanstack/react-query";
import { Dictionaries, Translation } from "../../dictionary";
import { TranslationProvider } from "@/context/Translation";
import { usePathname } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "@/lib/axios";
import Header from "./includes/Header";
import SideNav from "./includes/SideNav";
import NetworkErrors from "@/context/NetworkErrors";

export const queryClient = new QueryClient();
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIP_KEY ?? "");

export default function MainLayout({
  children,
  dictionary,
  lang
}: {
  children: React.ReactNode;
  dictionary: Translation;
  lang: Dictionaries;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const access_token = localStorage.getItem("session");
      config.headers.Authorization = `Bearer ${access_token}`;
      return config;
    });

    setIsLoading(false);
  }, []);

  return (
    <>
      <ProgressBarProvider>
        <QueryClientProvider client={queryClient}>
          <TranslationProvider lang={lang} translation={dictionary}>
            <NetworkErrors>
              <Elements stripe={stripePromise}>
                {isLoading ? null : (
                  <UserProvider>
                    <AllOverlays />
                    {pathname.includes("/product/") ? (
                      <>{children}</>
                    ) : (
                      <>
                        <Header />
                        <div className="mx-auto flex w-full justify-between px-0">
                          <SideNav />
                          <div className="relative mx-auto mb-[80px] mt-11 w-full md:mx-0 md:ms-[230px] md:mt-[60px]">
                            <div className="m-auto max-w-[1200px] md:px-4">{children}</div>
                          </div>
                        </div>
                        <BottomNav />
                      </>
                    )}
                  </UserProvider>
                )}
              </Elements>
            </NetworkErrors>
          </TranslationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ProgressBarProvider>
    </>
  );
}
