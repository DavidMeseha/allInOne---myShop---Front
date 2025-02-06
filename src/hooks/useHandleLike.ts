import { queryClient } from "@/components/layout/MainLayout";
import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";

interface LikeHookProps {
  product: IFullProduct;
  onSuccess?: (liked: boolean) => void;
  onError?: (liked: boolean) => void;
  onClick?: (liked: boolean) => void;
}

export default function useHandleLike({ product, onSuccess, onError, onClick }: LikeHookProps) {
  const { setLikes, user } = useUserStore();
  const { t } = useTranslation();

  const likeMutation = useMutation({
    mutationKey: ["like", product.seName],
    mutationFn: () => axios.post(`/api/user/likeProduct/${product._id}`),
    onSuccess: async () => {
      await setLikes();
      onSuccess?.(true);
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
    },
    onError: () => onError?.(true),
  });

  const unlikeMutation = useMutation({
    mutationKey: ["unlike", product.seName],
    mutationFn: () => axios.post(`/api/user/unlikeProduct/${product._id}`),
    onSuccess: async () => {
      await setLikes();
      onSuccess?.(false);
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
    },
    onError: () => onError?.(false),
  });

  const handleLike = async (shouldLike: boolean) => {
    if (!user) return;
    if (!user.isRegistered) {
      return toast.warn(t('loginToPerformAction'), { toastId: 'likeError' });
    }
    if (likeMutation.isPending || unlikeMutation.isPending) return;

    onClick?.(shouldLike);

    if (shouldLike) {
      await likeMutation.mutateAsync();
    } else {
      await unlikeMutation.mutateAsync();
    }
  };

  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  return { handleLike, isPending };
}
