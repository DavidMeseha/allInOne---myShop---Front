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
    setIsPending(true);
    const res = await follow(vendor._id, pathname);
    if (res && res.success) {
      await setFollowedVendors();
      onSuccess && onSuccess(true);
    }
    setIsPending(false);
  };

  const unfollowAction = async () => {
    setIsPending(true);
    const res = await unfollow(vendor._id, pathname);
    if (res && res.success) {
      await setFollowedVendors();
      onSuccess && onSuccess(false);
    }
  };

  const handleFollow = async (follow: boolean) => {
    if (!user || isPending) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"));
    if (follow) await followAction();
    else await unfollowAction();
    setIsPending(false);
  };

  return { handleFollow, isPending };
}
