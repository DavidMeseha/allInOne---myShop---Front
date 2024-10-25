"use client";

import React from "react";
import type { Category } from "@/types";
import type { TagsListItem, Vendor } from "@/types";
import CategoriesView from "./CategoriesView";

type Props = { vendors?: Vendor[]; tags?: TagsListItem[]; categories?: Category[] };

export default function DiscoverPage({ categories }: Props) {
  return <ul className="mt-10 md:mt-0">{categories ? <CategoriesView /> : null}</ul>;
}
