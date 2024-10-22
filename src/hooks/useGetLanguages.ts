import axios from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type Language = {
  name: string;
  language_culture: string;
  unique_seo_code: string;
  flag_image_file_name: string;
  rtl: boolean;
  limited_to_stores: boolean;
  default_currency_id: number;
  published: boolean;
  display_order: number;
  store_ids: number[];
  id: number;
};

type Response = {
  languages: Language[];
};

interface HookProps {
  onSuccess?: (data: Language) => void;
  onError?: (err: AxiosError) => void;
}

const useGetLanguages = ({ onSuccess, onError }: HookProps) => {
  const query = useQuery({
    queryKey: ["system-languages"],
    queryFn: () =>
      axios
        .get<Response>(`/languages`)
        .then((res) => {
          onSuccess && onSuccess(res.data.languages[0]);
          return res.data.languages;
        })
        .catch((error: AxiosError) => {
          onError && onError(error);
        })
  });
  return query;
};

export default useGetLanguages;
