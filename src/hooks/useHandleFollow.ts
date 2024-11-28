import { follow, unfollow } from "@/actions";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { IVendor } from "@/types";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  vendor: IVendor;
  onSuccess?: (follow: boolean) => void;
};

export default function useHandleFollow({ vendor, onSuccess }: Props) {
  const { setFollowedVendors, user } = useUserStore();
  const [isPending, setIsPending] = useState<boolean>(false);
  const { t } = useTranslation();
  const pathname = usePathname();

  const followAction = async () => {
    const res = await follow(vendor._id, pathname);
    if (res) {
      await setFollowedVendors();
      onSuccess && onSuccess(true);
    }
  };

  const unfollowAction = async () => {
    const res = await unfollow(vendor._id, pathname);
    if (res) {
      await setFollowedVendors();
      onSuccess && onSuccess(false);
    }
  };

  const handleFollow = async (follow: boolean) => {
    if (!user || isPending) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"));
    setIsPending(true);
    if (follow) await followAction();
    else await unfollowAction();
    setIsPending(false);
  };

  return { handleFollow, isPending };
}
