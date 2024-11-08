import ProductPage from "../ProductPage";
import { cookies } from "next/headers";
import { Dictionaries } from "@/dictionary";
import axios from "@/lib/axios";
import { Metadata, ResolvingMetadata } from "next";
import { IFullProduct } from "@/types";
import ProductNotFound from "@/app/product-not-found";

type Props = {
  params: { productId: string; lang: Dictionaries };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const product = await axios
    .get<IFullProduct>(`/api/product/details/${params.productId}`, {
      headers: { Authorization: `Bearer ${cookies().get("access_token")?.value}` }
    })
    .then((res) => res.data)
    .catch(() => null);

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
  const data = await axios
    .get<IFullProduct>(`/api/product/details/${params.productId}`, {
      headers: { Authorization: `Bearer ${cookies().get("access_token")?.value}` }
    })
    .then((res) => res.data)
    .catch(() => null);

  if (!data) return <ProductNotFound />;
  return <ProductPage product={data} />;
}
