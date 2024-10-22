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
        .then((res) => {
          console.log(res.data);
          return res.data;
        }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const tagsPages = tagsQuery.data?.pages;
  const lastPage = tagsPages?.findLast((page) => page);

  return (
    <ul className=" mt-10 md:mt-0">
      {tagsQuery.isFetchedAfterMount ? (
        tagsPages ? (
          <div>
            {tagsPages.map((page) =>
              page.data.map((tag) => <ListItem key={tag._id} tag={tag} to={`/${lang}/profile/tag/${tag._id}`} />)
            )}
          </div>
        ) : (
          <div className="py-14 text-center text-strongGray">You Created No Reviews Yet</div>
        )
      ) : null}

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
      ) : (
        <div className="p-4 text-center">No More vendors</div>
      )}
    </ul>
  );
}

type ListItemProps = {
  tag: ITag;
  to: string;
};

function ListItem({ tag, to }: ListItemProps) {
  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex w-full items-center gap-3">
        <div className="flex items-center justify-center rounded-full border p-1.5">
          <BsHash size={25} />
        </div>

        <div>
          <Link className="font-bold" href={to}>
            {tag.name}
          </Link>
        </div>
      </div>
      <div>
        <p className="w-max text-sm text-strongGray">{tag.productCount} products</p>
      </div>
    </li>
  );
}
