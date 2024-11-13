"use client";

import { LocalLink } from "@/components/LocalizedNavigation";
import Image from "next/image";
import { IVendor, Pagination } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { BiLoaderCircle } from "react-icons/bi";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore";
import { useUser } from "@/context/user";
import { useGeneralStore } from "@/stores/generalStore";

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
                <ListItem key={vendor._id} to={`/profile/vendor/${vendor._id}`} vendor={vendor} />
              ))
            )}
          </div>
        ) : (
          <div className="py-14 text-center text-strongGray">You Created No Reviews Yet</div>
        )
      ) : null}

      {!vendorsQuery.isFetchedAfterMount ? (
        <div className="flex w-full flex-col items-center justify-center py-2">
          <BiLoaderCircle className="animate-spin fill-primary" size={35} />
        </div>
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
  const { setFollowedVendors, following } = useUserStore();
  const { user } = useUser();
  const { setIsLoginOpen } = useGeneralStore();

  const followMutation = useMutation({
    mutationKey: ["followVendor", vendor._id],
    mutationFn: () => axios.post(`/api/user/followVendor/${vendor._id}`),
    onSuccess: () => {
      setFollowedVendors();
      toast.success("Vendor followed successfully");
    }
  });

  const handleFollowClick = () => {
    if (!user) return;
    if (user.isRegistered) return followMutation.mutate();
    setIsLoginOpen(true);
  };

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
          <p className="text-strongGray">Products: {vendor.productCount}</p>
        </div>
      </div>
      <div>
        {following.includes(vendor._id) ? (
          <div className="text-strongGray">followed</div>
        ) : (
          <Button
            className="bg-primary px-4 font-bold text-white"
            isLoading={followMutation.isPending}
            onClick={handleFollowClick}
          >
            +
          </Button>
        )}
      </div>
    </li>
  );
}
