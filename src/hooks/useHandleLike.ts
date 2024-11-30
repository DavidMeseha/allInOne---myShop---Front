import { queryClient } from "@/components/layout/MainLayout";
import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-toastify";

type Props = {
  product: IFullProduct;
  onSuccess?: (liked: boolean) => void;
  onError?: (liked: boolean) => void;
  onClick?: (liked: boolean) => void;
};

export default function useHandleLike({ product, onSuccess, onError, onClick }: Props) {
  const { setLikes, user } = useUserStore();
  const actionTimeoutRef = useRef<number>();

  const likeMutation = useMutation({
    mutationKey: ["like", product.seName],
    mutationFn: () => axios.post(`/api/user/likeProduct/${product._id}`).catch(() => null),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
    },
    onSuccess: () => onSuccess && onSuccess(true),
    onError: () => onError && onError(true)
  });

  const unlikeMutation = useMutation({
    mutationKey: ["unlike", product.seName],
    mutationFn: () => axios.post(`/api/user/unlikeProduct/${product._id}`).catch(() => null),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
    },
    onSuccess: () => onSuccess && onSuccess(false),
    onError: () => onError && onError(false)
  });

  const handleLike = (like: boolean) => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);

    if (user && !user.isRegistered) return toast.warn("You need to login to perform action", { toastId: "likeError" });
    onClick && onClick(like);
    actionTimeoutRef.current = window.setTimeout(async () => {
      if (like) await likeMutation.mutateAsync();
      else await unlikeMutation.mutateAsync();
      setLikes();
    }, 0);
  };

  return { handleLike, isPending: likeMutation.isPending || unlikeMutation.isPending };
}
