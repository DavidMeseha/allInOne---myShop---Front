"use client";

import Button from "@/components/Button";
import { queryClient } from "@/components/layout/MainLayout";
import { useTranslation } from "@/context/Translation";
import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { IVendor } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import { toast } from "react-toastify";

export default function FollowingPage() {
  const follwingVendorsQuery = useQuery({
    queryKey: ["following"],
    queryFn: () => axios.get<IVendor[]>("/api/user/followingVendors").then((res) => res.data)
  });
  return <ul>{follwingVendorsQuery.data?.map((vendor) => <ListItem key={vendor._id} vendor={vendor} />)}</ul>;
}

function ListItem({ vendor }: { vendor: IVendor }) {
  const { t } = useTranslation();
  const { setFollowedVendors } = useUserStore();

  const unfollowMutation = useMutation({
    mutationKey: ["followVendor", vendor._id],
    mutationFn: () => axios.post(`/api/user/unfollowVendor/${vendor._id}`),
    onSuccess: () => {
      setFollowedVendors();
      queryClient.fetchQuery({ queryKey: ["following"] });
      toast.warning("Vendor unFollowed");
    }
  });
  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={vendor.name}
          className="h-14 w-14 rounded-full bg-lightGray"
          height={66}
          src={vendor.imageUrl}
          width={66}
        />

        <div>
          <LocalLink className="font-bold" href={`/profile/vendor/${vendor.seName}`}>
            {vendor.name}
          </LocalLink>
          <p className="text-strongGray">{vendor.productCount} Products</p>
        </div>
      </div>
      <div>
        <Button
          className="flex items-center justify-center rounded-md bg-primary font-bold text-white"
          isLoading={unfollowMutation.isPending}
          onClick={() => unfollowMutation.mutate()}
        >
          {t("unfollow")}
        </Button>
      </div>
    </li>
  );
}
