import { follow, unfollow } from "@/actions";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { IVendor } from "@/types";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface FollowHookProps {
  vendor: IVendor;
  onSuccess?: (followed: boolean) => void;
}

export default function useHandleFollow({ vendor, onSuccess }: FollowHookProps) {
  const { setFollowedVendors, user } = useUserStore();
  const { t } = useTranslation();
  const pathname = usePathname();

  const followMutation = useMutation({
    mutationKey: ['follow', vendor._id],
    mutationFn: () => follow(vendor._id, pathname),
    onSuccess: async () => {
      await setFollowedVendors();
      onSuccess?.(true);
    },
  });

  const unfollowMutation = useMutation({
    mutationKey: ['unfollow', vendor._id],
    mutationFn: () => unfollow(vendor._id, pathname),
    onSuccess: async () => {
      await setFollowedVendors();
      onSuccess?.(false);
    },
  });

  const handleFollow = async (shouldFollow: boolean) => {
    if (!user) return;
    if (!user.isRegistered) {
      return toast.warn(t('loginToPerformAction'));
    }
    if (followMutation.isPending || unfollowMutation.isPending) return;

    if (shouldFollow) {
      await followMutation.mutateAsync();
    } else {
      await unfollowMutation.mutateAsync();
    }
  };

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  return { handleFollow, isPending };
}
