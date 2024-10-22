import axios from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ImageUploadResponse {
  success: boolean;
  pictureId: number;
  imageUrl: string;
}

interface HookProps {
  onSuccess?: (data: ImageUploadResponse) => void;
  onError?: (err: AxiosError) => void;
}

const useUploadImage = ({ onSuccess, onError }: HookProps) => {
  const mutation = useMutation({
    mutationKey: ["uploadImage"],
    mutationFn: (data: FormData) =>
      axios
        .post<ImageUploadResponse>("https://suodod.com/admin/picture/asyncUpload", data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((res) => res.data),
    onSuccess: onSuccess,
    onError: onError
  });
  return mutation;
};

export default useUploadImage;
