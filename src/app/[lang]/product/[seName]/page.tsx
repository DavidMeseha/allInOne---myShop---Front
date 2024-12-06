import axios from "@/lib/axios";
import { Metadata, ResolvingMetadata } from "next";
import { IFullProduct } from "@/types";
import { cache } from "react";
import { AxiosError } from "axios";
import { notFound } from "next/navigation";
import ProductPage from "../ProductPage";

type Props = {
  params: Promise<{ seName: string }>;
};

const getProduct = cache(async (seName: string) => {
  return await axios.get<IFullProduct>(`/api/product/details/${seName}`).then((res) => res.data);
});

export const revalidate = 120;
export const dynamicParams = true;
export async function generateStaticParams() {
  const products = await axios.get<{ data: IFullProduct[] }>(`/api/catalog/homefeed`).then((res) => res.data.data);
  return products.map((product) => ({
    seName: product.seName
  }));
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  try {
    const res = await getProduct(params.seName);
    const product = res;
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

export default async function Page(props: Props) {
  const params = await props.params;
  try {
    const product = await getProduct(params.seName);
    return <ProductPage product={product} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500) notFound();
  }
}
