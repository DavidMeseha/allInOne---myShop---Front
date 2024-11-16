import ProductPage from "../ProductPage";
import { cookies } from "next/headers";
import axios from "@/lib/axios";
import { Metadata, ResolvingMetadata } from "next";
import { IFullProduct } from "@/types";
import { cache } from "react";
import { AxiosError } from "axios";
import { notFound } from "next/navigation";

type Props = {
  params: { productId: string };
};

const fetchProduct = async (id: string) => {
  return await axios.get<IFullProduct>(`/api/product/details/${id}`, {
    headers: { Authorization: `Bearer ${cookies().get("access_token")?.value}` }
  });
};

const cachedGetProduct = cache(fetchProduct);

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const res = await cachedGetProduct(params.productId);
    const product = res.data;
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
  } catch {
    return { title: "Error" };
  }
}

export default async function Page({ params }: Props) {
  try {
    const res = await cachedGetProduct(params.productId);
    return <ProductPage product={res.data} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status === 500) throw new Error("Server Error");
    else if (!error.response) throw new Error("500: Server Is Down");
    else notFound();
  }
}
