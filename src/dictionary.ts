import "server-only";
import { Language, TranslationKey } from "./types";

export type TFunction = (key: TranslationKey) => string;

const dictionaries = {
  en: import("@/dictionaries/en.json").then((module) => module.default),
  ar: import("@/dictionaries/ar.json").then((module) => module.default),
  fr: import("@/dictionaries/fr.json").then((module) => module.default)
};

export const getDictionary = async (locale: Language) => await dictionaries[locale];
