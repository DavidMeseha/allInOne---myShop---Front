import { useUser } from "@/context/user";
import axios from "@/lib/axios";
import { useGeneralStore } from "@/stores/generalStore";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Props = {
  product: IFullProduct;
  onSuccess?: (liked: boolean) => void;
};

export default function useHandleSave({ product, onSuccess }: Props) {
  const { user } = useUser();
  const { setSavedProducts } = useUserStore();
  const { setIsLoginOpen } = useGeneralStore();

  const saveMutation = useMutation({
    mutationKey: ["save", product._id],
    mutationFn: () => axios.post(`/api/user/saveProduct/${product._id}`),
    onSuccess: () => {
      setSavedProducts();
      onSuccess && onSuccess(true);
    }
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", product._id],
    mutationFn: () => axios.post(`/api/user/unsaveProduct/${product._id}`),
    onSuccess: () => {
      setSavedProducts();
      onSuccess && onSuccess(false);
    }
  });

  const handleSave = (save: boolean) => {
    if (!user || saveMutation.isPending || unsaveMutation.isPending) return;
    if (user && !user.isRegistered) return setIsLoginOpen(true);
    if (save) return saveMutation.mutate();
    unsaveMutation.mutate();
  };

  return { handleSave, isPending: saveMutation.isPending || unsaveMutation.isPending };
}
