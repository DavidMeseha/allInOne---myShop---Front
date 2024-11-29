import axios from "@/lib/axios";
import { languages } from "@/lib/misc";
import { IFullProduct } from "@/types";
import { MetadataRoute } from "next";

const BASE_URL = "https://techshop-commerce.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await axios.get<{ data: IFullProduct[] }>(`/api/catalog/homefeed`).then((res) => res.data.data);
  const routs2D = languages.map(() =>
    products.map((product) => ({
      url: `${BASE_URL}/product/${product.seName}`,
      lastModified: product.updatedAt
    }))
  );
  let flatRouts: { url: string; lastModified: string }[] = [];
  routs2D.forEach((routeSet) => (flatRouts = [...flatRouts, ...routeSet]));
  return flatRouts;
}
