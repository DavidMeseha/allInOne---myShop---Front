import { Dictionaries, Translation } from "@/dictionary";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";
import MainLayout from "@/components/layout/MainLayout";
import { act, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TranslationProvider } from "@/context/Translation";
import React from "react";

const queryClient = new QueryClient();

export const renderWithProviders = async (
  ui: React.ReactNode,
  lang: Dictionaries = "en",
  dictionary: Translation = en
) => {
  return await act(async () =>
    render(
      <MainLayout dictionary={dictionary} lang={lang}>
        {ui}
      </MainLayout>
    )
  );
};

export const renderDiscoverPages = async (
  ui: React.ReactNode,
  lang: Dictionaries = "en",
  dictionary: Translation = en
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <TranslationProvider lang={lang} translation={dictionary}>
        {ui}
      </TranslationProvider>
    </QueryClientProvider>
  );
};

export const renderWithTransation = async (
  ui: React.ReactNode,
  lang: Dictionaries = "en",
  dictionary: Translation = en
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <TranslationProvider lang={lang} translation={dictionary}>
        {ui}
      </TranslationProvider>
    </QueryClientProvider>
  );
};

const dictionaries = {
  en: en,
  ar: ar
};

export const languages: Dictionaries[] = ["en", "ar"];
export const getDictionary = (lang: Dictionaries) => dictionaries[lang];
