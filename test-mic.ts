import { Dictionaries } from "@/dictionary";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";

const dictionaries = {
  en: en,
  ar: ar
};

export const languages: Dictionaries[] = ["en", "ar"];
export const getDictionary = (lang: Dictionaries) => dictionaries[lang];
