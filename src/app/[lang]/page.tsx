import { IFullProduct, Pagination } from "@/types";
import HomePage from "./HomePage";
import axios from "@/lib/axios";

export default async function Page() {
  const getProducts = async (page = 1) => {
    "use server";
    const res = await axios.get<{ data: IFullProduct[]; pages: Pagination }>("api/catalog/homefeed", {
      params: {
        page: page,
        limit: 5
      }
    });

    return res.data ?? [];
  };

  const loadMore = async (page: number): Promise<{ data: IFullProduct[]; pages: Pagination }> => {
    "use server";
    const moreProducts = await getProducts(page);
    return moreProducts || [];
  };

  const products = await getProducts();

  return <HomePage loadMore={loadMore} products={products.data} />;
}
