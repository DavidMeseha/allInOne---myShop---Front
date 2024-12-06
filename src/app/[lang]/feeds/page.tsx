import { IFullProduct, Pagination } from "@/types";
import InfiniteFeed from "./InfiniteFeed";
import { cookies } from "next/headers";
import axios from "@/lib/axios";

export default async function Page() {
  const getProducts = async (page = 1) => {
    "use server";
    const res = await axios
      .get<{ data: IFullProduct[]; pages: Pagination }>("api/catalog/homefeed", {
        params: {
          page: page
        },
        headers: {
          Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`
        }
      })
      .catch(() => ({ data: { data: [], pages: { current: 0, limit: 0, hasNext: false } } }));

    return res.data ?? [];
  };

  const products = (await getProducts()).data;

  const loadMore = async (page: number): Promise<{ data: IFullProduct[]; pages: Pagination }> => {
    "use server";
    const moreProducts = await getProducts(page);
    return moreProducts || [];
  };

  return <InfiniteFeed loadMore={loadMore} products={products} />;
}
