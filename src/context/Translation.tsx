"use client";

import { Dictionaries, TKey, Translation } from "@/dictionary";
import React, { useContext } from "react";
import { createContext } from "react";
import { TFunction } from "../dictionary";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

type Props = { translation: Translation; children: React.ReactNode; lang: Dictionaries };
type TContext = {
  t: TFunction;
  lang: Dictionaries;
  changeLang: (lang: Dictionaries) => void;
  languages: ["en", "ar"];
};

const TranslationConetxt = createContext<TContext>({
  t: () => "",
  lang: "en",
  changeLang: () => {},
  languages: ["en", "ar"]
});

export function TranslationProvider({ translation, children, lang }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguageMutation = useMutation({
    mutationKey: ["change-language"],
    mutationFn: (newLang: Dictionaries) =>
      axios.post(`/api/common/changeLanguage/${newLang}`).then(() => {
        let newPathname = pathname.replace(`/${lang}`, `/${newLang.toLocaleLowerCase()}`);

        router.push(newPathname);
      })
  });

  const t = (key: TKey) => (key in translation ? translation[key as TKey] : key);

  const changeLang = (newLang: Dictionaries) => {
    if (lang === newLang.toLocaleLowerCase()) return;

    changeLanguageMutation.mutate(newLang);
  };

  return (
    <TranslationConetxt.Provider value={{ t, lang, changeLang, languages: ["en", "ar"] }}>
      {children}
    </TranslationConetxt.Provider>
  );
}

export const useTranslation = () => useContext(TranslationConetxt);
