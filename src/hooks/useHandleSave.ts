import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";

interface SaveHookProps {
  product: IFullProduct;
  onSuccess?: (saved: boolean) => void;
  onError?: (saved: boolean) => void;
  onClick?: (saved: boolean) => void;
}

export default function useHandleSave({ product, onSuccess, onError, onClick }: SaveHookProps) {
  const { setSaves, user } = useUserStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const saveMutation = useMutation({
    mutationKey: ["save", product.seName],
    mutationFn: () => axios.post(`/api/user/saveProduct/${product._id}`),
    onSuccess: async () => {
      await setSaves();
      onSuccess?.(true);
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: () => onError?.(true),
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", product.seName],
    mutationFn: () => axios.post(`/api/user/unsaveProduct/${product._id}`),
    onSuccess: async () => {
      await setSaves();
      onSuccess?.(false);
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: () => onError?.(false),
  });

  const handleSave = async (shouldSave: boolean) => {
    if (!user) return;
    if (!user.isRegistered) {
      return toast.warn(t('loginToPerformAction'), { toastId: 'saveError' });
    }
    if (saveMutation.isPending || unsaveMutation.isPending) return;

    onClick?.(shouldSave);

    if (shouldSave) {
      await saveMutation.mutateAsync();
    } else {
      await unsaveMutation.mutateAsync();
    }
  };

  const isPending = saveMutation.isPending || unsaveMutation.isPending;

  return { handleSave, isPending };
}
