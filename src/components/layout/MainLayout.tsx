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
import { usePathname, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "@/lib/axios";
import Header from "./includes/Header";
import SideNav from "./includes/SideNav";
import NetworkErrors from "@/context/NetworkErrors";
import { User } from "@/types";
import { toast } from "react-toastify";

export const queryClient = new QueryClient();
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIP_KEY ?? "");

export default function MainLayout({
  children,
  dictionary,
  lang,
  user,
  token
}: {
  children: React.ReactNode;
  dictionary: Translation;
  lang: Dictionaries;
  user: User | null;
  token: string | undefined;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    // setIsLoading(false);
  }, [token]);

  useEffect(() => {
    if (message) toast.error(message);
  }, [message]);

  return (
    <>
      <ProgressBarProvider>
        <QueryClientProvider client={queryClient}>
          <TranslationProvider lang={lang} translation={dictionary}>
            <NetworkErrors>
              <Elements stripe={stripePromise}>
                <UserProvider user={user}>
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
              </Elements>
            </NetworkErrors>
          </TranslationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ProgressBarProvider>
    </>
  );
}
