import axios from "@/lib/axios";
import { IFullProduct } from "@/types";
import { MetadataRoute } from "next";

const BASE_URL = "https://all-in-one-my-shop-front.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await axios.get<{ data: IFullProduct[] }>(`/api/catalog/homefeed`).then((res) => res.data.data);
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.seName}`,
    lastModified: product.updatedAt
  }));
}
