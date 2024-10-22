import { IFullProduct, Pagenation } from "@/types";
import HomePage from "../HomePage";
import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";

export default async function Page() {
  const getProducts = async (page = 1) => {
    "use server";
    const res = await axiosInstance
      .get<{ data: IFullProduct[]; page: Pagenation }>("api/catalog/homefeed", {
        params: {
          page: page
        },
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`
        }
      })
      .catch(() => ({ data: { data: [], page: { totalDocs: 0, total: 0, current: 0, limit: 0, hasNext: false } } }));

    return res.data ?? [];
  };

  const products = (await getProducts()).data;

  const loadMore = async (page: number): Promise<{ data: IFullProduct[]; page: Pagenation }> => {
    "use server";
    const moreProducts = await getProducts(page);
    return moreProducts || [];
  };

  return <HomePage loadMore={loadMore} products={products} />;
}
