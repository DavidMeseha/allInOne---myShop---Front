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

export default function useHandleSave({ product, onSuccess }: Props) {
  const { user } = useUser();
  const { setSavedProducts } = useUserStore();

  const saveMutation = useMutation({
    mutationKey: ["save", product.seName],
    mutationFn: () => axios.post(`/api/user/saveProduct/${product._id}`),
    onSuccess: () => {
      setSavedProducts();
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
      onSuccess && onSuccess(true);
    }
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", product.seName],
    mutationFn: () => axios.post(`/api/user/unsaveProduct/${product._id}`),
    onSuccess: () => {
      setSavedProducts();
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
      onSuccess && onSuccess(false);
    }
  });

  const handleSave = (save: boolean) => {
    if (!user || saveMutation.isPending || unsaveMutation.isPending) return;
    if (user && !user.isRegistered) return toast.warn("You need to login to perform action");
    if (save) return saveMutation.mutate();
    unsaveMutation.mutate();
  };

  return { handleSave, isPending: saveMutation.isPending || unsaveMutation.isPending };
}
