import { queryClient } from "@/components/layout/MainLayout";
import { useUser } from "@/context/user";
import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Props = {
  product: IFullProduct;
  onSuccess?: (liked: boolean) => void;
};

export default function useHandleLike({ product, onSuccess }: Props) {
  const { user } = useUser();
  const { setLikes } = useUserStore();

  const likeMutation = useMutation({
    mutationKey: ["Like", product.seName],
    mutationFn: () => axios.post(`/api/user/likeProduct/${product._id}`),
    onSuccess: () => {
      setLikes();
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
      onSuccess && onSuccess(true);
    }
  });

  const unlikeMutation = useMutation({
    mutationKey: ["Unlike", product.seName],
    mutationFn: () => axios.post(`/api/user/unlikeProduct/${product._id}`),
    onSuccess: () => {
      setLikes();
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
      onSuccess && onSuccess(false);
    }
  });

  const handleLike = (like: boolean) => {
    if (!user || likeMutation.isPending || unlikeMutation.isPending) return;
    if (user && !user.isRegistered) return toast.warn("You need to login to perform action");
    if (like) return likeMutation.mutate();
    unlikeMutation.mutate();
  };

  return { handleLike, isPending: likeMutation.isPending || unlikeMutation.isPending };
}
