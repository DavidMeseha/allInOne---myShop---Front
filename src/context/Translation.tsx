"use client";

import { Dictionaries, TKey, Translation } from "@/dictionary";
import React, { useContext, useEffect } from "react";
import { createContext } from "react";
import { TFunction } from "../dictionary";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

type Props = { translation: Translation; children: React.ReactNode; lang: Dictionaries };
type TContext = {
  t: TFunction;
  lang: Dictionaries;
  languages: ["en", "ar"];
};

const TranslationConetxt = createContext<TContext>({
  t: () => "",
  lang: "en",
  languages: ["en", "ar"]
});

export function TranslationProvider({ translation, children, lang }: Props) {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");

  const t = (key: TKey) => (translation ? (key in translation ? translation[key as TKey] : key) : key);

  useEffect(() => {
    if (message) toast.success(t(message as TKey));
    if (error) toast.error(t(error as TKey));
  }, [message, error, translation, lang]);

  return (
    <TranslationConetxt.Provider value={{ t, lang, languages: ["en", "ar"] }}>{children}</TranslationConetxt.Provider>
  );
}

export const useTranslation = () => useContext(TranslationConetxt);
