"use client";

import { useTranslation } from "@/context/Translation";
import Link from "next/link";
import React from "react";
import { BsHash } from "react-icons/bs";
import { ITag, Pagination } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import Button from "@/components/Button";
import { BiLoaderCircle } from "react-icons/bi";

export default function TagsView() {
  const { lang } = useTranslation();

  const tagsQuery = useInfiniteQuery({
    queryKey: ["tagsDiscover"],
    queryFn: ({ pageParam }) =>
      axiosInstanceNew
        .get<{ data: ITag[]; pages: Pagination }>("/api/catalog/discover/tags", {
          params: { page: pageParam }
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const tagsPages = tagsQuery.data?.pages;
  const lastPage = tagsPages?.findLast((page) => page);

  return (
    <div className="mt-10 p-4 md:mt-0">
      <ul>
        <li className="hidden text-3xl font-bold md:inline-block">Tags</li>
        {tagsPages
          ? tagsPages.map((page) =>
              page.data.map((tag) => <ListItem key={tag._id} tag={tag} to={`/${lang}/profile/tag/${tag._id}`} />)
            )
          : null}

        {!tagsQuery.isFetchedAfterMount ? (
          <div className="flex w-full flex-col items-center justify-center py-2">
            <BiLoaderCircle className="animate-spin fill-primary" size={35} />
          </div>
        ) : lastPage && lastPage.pages.hasNext ? (
          <div className="px-w py-4 text-center">
            <Button
              className="w-full bg-primary text-white"
              isLoading={tagsQuery.isFetchingNextPage}
              onClick={() => tagsQuery.fetchNextPage()}
            >
              Load More
            </Button>
          </div>
        ) : null}
      </ul>
    </div>
  );
}

type ListItemProps = {
  tag: ITag;
  to: string;
};

function ListItem({ tag, to }: ListItemProps) {
  return (
    <li className="mx-2 my-2 inline-flex items-center rounded-full border px-4 py-2">
      <BsHash size={35} />
      <Link className="text-sm font-bold" href={to}>
        <p>{tag.name}</p>
        <p className="w-max text-xs text-strongGray">{tag.productCount} products</p>
      </Link>
    </li>
  );
}
