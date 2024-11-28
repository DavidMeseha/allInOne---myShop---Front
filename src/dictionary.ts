import "server-only";
import tJson from "@/dictionaries/en.json";
import { Language } from "./types";

export type Translation = typeof tJson;
export type TKey = keyof typeof tJson;
export type TFunction = (key: TKey) => string;

const dictionaries = {
  en: import("@/dictionaries/en.json").then((module) => module.default),
  ar: import("@/dictionaries/ar.json").then((module) => module.default),
  fr: import("@/dictionaries/fr.json").then((module) => module.default)
};

export const getDictionary = async (locale: Language) => await dictionaries[locale];
