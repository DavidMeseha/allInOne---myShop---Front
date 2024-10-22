import ProductPage from "../ProductPage";
import { cookies } from "next/headers";
import { Dictionaries } from "@/dictionary";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { Metadata, ResolvingMetadata } from "next";
import { IFullProduct } from "@/types";
import { AxiosError } from "axios";
import ProductNotFound from "@/app/product-not-found";

type Props = {
  params: { productId: string; lang: Dictionaries };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const product = await axiosInstanceNew
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
  const data = await axiosInstanceNew
    .get<IFullProduct>(`/api/product/details/${params.productId}`, {
      headers: { Authorization: `Bearer ${cookies().get("access_token")?.value}` }
    })
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      console.log(err.response?.data);
      return null;
    });

  if (!data) return <ProductNotFound />;
  if (data) return <ProductPage product={data} />;
}
