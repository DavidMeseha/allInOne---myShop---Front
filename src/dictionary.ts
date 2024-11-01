import "server-only";
import tJson from "@/dictionaries/en.json";

export type Translation = typeof tJson;
export type TKey = keyof typeof tJson;
export type TFunction = (key: TKey) => string;
export const langs: Dictionaries[] = ["en", "ar"];

const dictionaries = {
  en: import("@/dictionaries/en.json").then((module) => module.default),
  ar: import("@/dictionaries/ar.json").then((module) => module.default)
};

export type Dictionaries = keyof typeof dictionaries;
export const getDictionary = async (locale: Dictionaries) => await dictionaries[locale];
