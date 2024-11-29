"use client";

import ProgressBarProvider from "@/context/ProgressBarProvider";
import AllOverlays from "@/components/overlays/AllOverlays";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useState } from "react";
import BottomNav from "./includes/BottomNav";
import { QueryClient } from "@tanstack/react-query";
import { TranslationProvider } from "@/context/Translation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "@/lib/axios";
import Header from "./includes/Header";
import SideNav from "./includes/SideNav";
import NetworkErrors from "@/context/NetworkErrors";
import { Language, Translation } from "@/types";
import { useGeneralStore } from "@/stores/generalStore";
import UserSetupWrapper from "./includes/UserSetupWrapper";
import { useUserStore } from "@/stores/userStore";
import { usePathname } from "next/navigation";

export const queryClient = new QueryClient();
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIP_KEY ?? "");

export default function MainLayout({
  children,
  dictionary,
  lang,
  token
}: {
  children: React.ReactNode;
  dictionary: Translation;
  lang: Language;
  token: string | undefined;
}) {
  const pathname = usePathname();
  const { setCountries } = useGeneralStore();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCountries();
    setLoading(false);
  }, []);

  useEffect(() => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    setUser(null);
    queryClient.invalidateQueries({ queryKey: ["checkToken"] });
  }, [token]);

  return (
    <>
      <ProgressBarProvider>
        <QueryClientProvider client={queryClient}>
          <TranslationProvider lang={lang} translation={dictionary}>
            <NetworkErrors>
              {!loading ? (
                <UserSetupWrapper>
                  <AllOverlays />
                  <Header />
                  <div className="mx-auto flex w-full justify-between px-0">
                    <SideNav />
                    <div className="relative mx-auto my-11 w-full md:mx-0 md:ms-[230px] md:mt-[60px]">
                      <div className="m-auto max-w-[1200px] md:px-4">{children}</div>
                    </div>
                  </div>
                  <BottomNav />
                </UserSetupWrapper>
              ) : null}
            </NetworkErrors>
          </TranslationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ProgressBarProvider>
    </>
  );
}
