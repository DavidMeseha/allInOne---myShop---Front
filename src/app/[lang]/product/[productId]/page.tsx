import ProductPage from "../ProductPage";
import { cookies } from "next/headers";
import axios from "@/lib/axios";
import { Metadata, ResolvingMetadata } from "next";
import { IFullProduct } from "@/types";
import ProductNotFound from "@/app/product-not-found";
import { cache } from "react";

type Props = {
  params: { productId: string };
};

const fetchProduct = async (id: string) => {
  return await axios
    .get<IFullProduct>(`/api/product/details/${id}`, {
      headers: { Authorization: `Bearer ${cookies().get("access_token")?.value}` }
    })
    .then((res) => res.data)
    .catch(() => null);
};

const cachedGetProduct = cache(fetchProduct);

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const product = await cachedGetProduct(params.productId);
  if (!product) return { title: "not found" };

  const parentMeta = await parent;

  return {
    title: `${parentMeta.title?.absolute} | ${product.name}`,
    description: product.fullDescription,
    openGraph: {
      type: "website",
      images: product.pictures.map((image) => image.imageUrl),
      title: `${parentMeta.title?.absolute} | ${product.name}`,
      description: product.fullDescription
    }
  };
}

export default async function Page({ params }: Props) {
  const product = await cachedGetProduct(params.productId);

  if (!product) return <ProductNotFound />;
  return <ProductPage product={product} />;
}
