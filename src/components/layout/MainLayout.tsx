"use client";

import ProgressBarProvider from "@/context/ProgressBarProvider";
import UserProvider from "@/context/user";
import AllOverlays from "@/components/overlays/AllOverlays";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import SideNavMain from "./includes/SideNavMain";
import TopNav from "./includes/Navbar";
import BottomNav from "./includes/BottomNav";
import { QueryClient } from "@tanstack/react-query";
import { Dictionaries, Translation } from "../../dictionary";
import { TranslationProvider } from "@/context/Translation";
import { usePathname } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export const queryClient = new QueryClient();
const stripePromise = loadStripe(
  "pk_test_51N00ChJp1pxddz1DcjxHlePPUR621MfopUXZ2vDocEhuQMYPv6Kwa5eD18Y1rF6HGnbHhn8bhmHZXPcF753UH1kg00LKLpjWbM"
);

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
  return (
    <>
      <ProgressBarProvider>
        <QueryClientProvider client={queryClient}>
          <TranslationProvider lang={lang} translation={dictionary}>
            <Elements stripe={stripePromise}>
              <UserProvider>
                {pathname.includes("/product/") ? (
                  children
                ) : (
                  <>
                    <AllOverlays />
                    <TopNav />
                    <div className="mx-auto flex w-full justify-between px-0 lg:px-2.5">
                      <SideNavMain />
                      <div className="relative mx-auto mb-[80px] mt-11 w-full md:mx-0 md:me-14 md:ms-80 md:mt-[60px]">
                        <div className="m-auto max-w-[1200px]">{children}</div>
                      </div>
                    </div>
                    <BottomNav />
                  </>
                )}
              </UserProvider>
            </Elements>
          </TranslationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ProgressBarProvider>
    </>
  );
}
