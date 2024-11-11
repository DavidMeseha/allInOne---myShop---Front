"use client";

import { ICategory, Pagination } from "@/types";
import { useTranslation } from "@/context/Translation";
import Link from "next/link";
import React from "react";
import Button from "@/components/Button";
import { BiLoaderCircle } from "react-icons/bi";
import axios from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function CategoriesView() {
  const { lang, t } = useTranslation();

  const categoriesQuery = useInfiniteQuery({
    queryKey: ["tagsDiscover"],
    queryFn: ({ pageParam }) =>
      axios
        .get<{ data: ICategory[]; pages: Pagination }>("/api/catalog/discover/categories", {
          params: { page: pageParam }
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const categoriesPages = categoriesQuery.data?.pages;
  const lastPage = categoriesPages?.findLast((page) => page);

  return (
    <ul className="mt-10 md:mt-0">
      {categoriesQuery.isFetchedAfterMount && categoriesPages ? (
        categoriesPages.map((page) =>
          page.data.map((category) => (
            <ListItem category={category} key={category._id} to={`/${lang}/profile/category/${category._id}`} />
          ))
        )
      ) : (
        <div className="py-6 text-center text-strongGray">Could not find any categories</div>
      )}

      {!categoriesQuery.isFetchedAfterMount ? (
        <div className="flex w-full flex-col items-center justify-center py-2">
          <BiLoaderCircle className="animate-spin fill-primary" role="status" size={35} />
        </div>
      ) : lastPage && lastPage.pages.hasNext ? (
        <div className="px-w py-4 text-center">
          <Button
            className="w-full bg-primary text-white"
            isLoading={categoriesQuery.isFetchingNextPage}
            onClick={() => categoriesQuery.fetchNextPage()}
          >
            {t("loadMore")}
          </Button>
        </div>
      ) : null}
    </ul>
  );
}

type ListItemProps = {
  category: ICategory;
  to: string;
};

function ListItem({ to, category }: ListItemProps) {
  const { t } = useTranslation();
  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <Link className="font-bold" href={to}>
          {category.name}
        </Link>
      </div>
      <p className="text-strongGray">
        {t("discover.products")}: {category.productsCount || 0}
      </p>
    </li>
  );
}
