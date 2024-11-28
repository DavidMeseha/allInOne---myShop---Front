"use client";

import { LocalLink } from "@/components/LocalizedNavigation";
import Image from "next/image";
import { IVendor, Pagination } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import Button from "@/components/Button";
import { useUserStore } from "@/stores/userStore";
import Loading from "@/components/LoadingUi/LoadingSpinner";
import useHandleFollow from "@/hooks/useHandleFollow";
import { useTranslation } from "@/context/Translation";

export default function VendorsView() {
  const vendorsQuery = useInfiniteQuery({
    queryKey: ["vendorsDiscover"],
    queryFn: ({ pageParam }) =>
      axios
        .get<{ data: IVendor[]; pages: Pagination }>("/api/catalog/discover/vendors", {
          params: { page: pageParam }
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const vendorsPages = vendorsQuery.data?.pages;
  const lastPage = vendorsPages?.findLast((page) => page);

  return (
    <ul className="mt-14 md:mt-4">
      {vendorsQuery.isFetchedAfterMount ? (
        vendorsPages ? (
          <div>
            {vendorsPages.map((page) =>
              page.data.map((vendor) => (
                <ListItem key={vendor._id} to={`/profile/vendor/${vendor.seName}`} vendor={vendor} />
              ))
            )}
          </div>
        ) : (
          <div className="py-14 text-center text-secondary">You Created No Reviews Yet</div>
        )
      ) : null}

      {!vendorsQuery.isFetchedAfterMount ? (
        <Loading />
      ) : lastPage && lastPage.pages.hasNext ? (
        <div className="px-w py-4 text-center">
          <Button
            className="w-full bg-primary text-white"
            isLoading={vendorsQuery.isFetchingNextPage}
            onClick={() => vendorsQuery.fetchNextPage()}
          >
            Load More
          </Button>
        </div>
      ) : null}
    </ul>
  );
}

type ListItemProps = {
  vendor: IVendor;
  to: string;
};

function ListItem({ vendor, to }: ListItemProps) {
  const { t } = useTranslation();
  const { following } = useUserStore();
  const { handleFollow, isPending } = useHandleFollow({ vendor });

  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={vendor.name}
          className="h-14 w-14 rounded-full bg-lightGray object-cover"
          height={56}
          src={vendor.imageUrl}
          width={56}
        />

        <div>
          <LocalLink className="font-bold hover:underline" href={to}>
            {vendor.name}
          </LocalLink>
          <p className="text-secondary">Products: {vendor.productCount}</p>
        </div>
      </div>
      <div>
        {following.includes(vendor._id) ? (
          <div className="text-secondary">{t("profile.following")}</div>
        ) : (
          <Button
            className="bg-primary px-4 font-bold text-white"
            isLoading={isPending}
            onClick={() => handleFollow(true)}
          >
            +
          </Button>
        )}
      </div>
    </li>
  );
}
