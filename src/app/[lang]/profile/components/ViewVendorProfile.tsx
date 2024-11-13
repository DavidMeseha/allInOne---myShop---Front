"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/context/Translation";
import { UserActivity } from "./UserActivity";
import Button from "@/components/Button";
import Image from "next/image";
import { IFullProduct, IVendor, Pagination } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useInView } from "react-intersection-observer";
import { BiLoaderCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ProductHomeCard from "@/components/ProductHomeCard";
import { useUser } from "@/context/user";
import { useGeneralStore } from "@/stores/generalStore";

type Props = {
  vendor: IVendor;
};

export default function ViewVendorProfile({ vendor }: Props) {
  const { t } = useTranslation();
  const [ref, isInView] = useInView();
  const { setFollowedVendors, following } = useUserStore();
  const { user } = useUser();
  const { setIsLoginOpen } = useGeneralStore();
  const [followersCount, setFollowersCount] = useState(vendor.followersCount);

  const activities = [
    {
      name: t("profile.followers"),
      value: followersCount,
      to: null
    },
    {
      name: t("profile.products"),
      value: vendor.productCount,
      to: null
    }
  ];

  const followMutation = useMutation({
    mutationKey: ["followVendor", vendor._id],
    mutationFn: () => axios.post(`/api/user/followVendor/${vendor._id}`),
    onSuccess: () => {
      setFollowedVendors();
      toast.success("Vendor followed successfully");
      setFollowersCount(followersCount + 1);
    }
  });

  const unfollowMutation = useMutation({
    mutationKey: ["followVendor", vendor._id],
    mutationFn: () => axios.post(`/api/user/unfollowVendor/${vendor._id}`),
    onSuccess: () => {
      setFollowedVendors();
      toast.warning("Vendor unFollowed");
      setFollowersCount(followersCount - 1);
    }
  });

  const productsQuery = useInfiniteQuery({
    queryKey: ["vendorProducts", vendor._id],
    queryFn: ({ pageParam }) =>
      axios
        .get<{ data: IFullProduct[]; pages: Pagination }>(`/api/catalog/VendorProducts/${vendor._id}`, {
          params: {
            page: pageParam
          }
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + 1
  });
  const lastPage = productsQuery.data?.pages.findLast((page) => page);

  useEffect(() => {
    if (!productsQuery.isFetching && !productsQuery.isFetchingNextPage && isInView && lastPage?.pages.hasNext)
      productsQuery.fetchNextPage();
  }, [isInView]);

  const handleFollowingState = () => {
    if (!user?.isRegistered) return setIsLoginOpen(true);
    if (following.includes(vendor._id)) return unfollowMutation.mutate();
    followMutation.mutate();
  };

  return (
    <div className="py-4">
      <div className="flex w-full flex-row items-center justify-start px-4 md:mt-0">
        <Image
          alt={vendor.name}
          className="h-[120px] w-[120px] rounded-md object-cover"
          height={140}
          src={vendor.imageUrl}
          width={140}
        />

        <div className="ms-5">
          <div className="flex items-center gap-4">
            <h1 className="inline-block truncate text-[30px] font-bold" dir="ltr">
              {vendor.name}
            </h1>
            <RiVerifiedBadgeFill className="fill-primary" size={25} />
          </div>
          <Button
            className="item-center mt-3 block bg-primary px-8 py-1.5 text-[15px] font-semibold text-white"
            onClick={handleFollowingState}
          >
            {following.includes(vendor._id) ? t("unfollow") : t("follow")}
          </Button>
        </div>
      </div>

      <UserActivity activities={activities} />

      <div className="mt-2 border-t" />

      {productsQuery.isFetchedAfterMount ? (
        productsQuery.data && productsQuery.data.pages[0].data.length > 0 ? (
          <div className="relative mt-4 grid grid-cols-2 gap-3 px-4 pb-20 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {productsQuery.data.pages.map((page) =>
              page.data.map((product, index) => <ProductHomeCard key={index} product={product} />)
            )}
          </div>
        ) : (
          <div className="py-14 text-center text-strongGray">{t("profile.noProducts")}</div>
        )
      ) : null}

      {lastPage?.pages.hasNext || !productsQuery.isFetchedAfterMount ? (
        <div className="flex w-full flex-col items-center justify-center py-2" ref={ref}>
          <BiLoaderCircle className="animate-spin fill-primary" size={35} />
        </div>
      ) : null}
    </div>
  );
}
