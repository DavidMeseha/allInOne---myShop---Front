import ViewCategoryProfile from "../../components/ViewCategoryProfile";
import { ICategory } from "@/types";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";

type Props = { params: { id: string } };

const getCategoryInfo = async (id: string) => {
  return await axios.get<ICategory>(`/api/Catalog/Category/${id}`).then((res) => res.data);
};

const cachedCategoryInfo = cache(getCategoryInfo);

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const category = await cachedCategoryInfo(params.id);
    const parentMeta = await parent;

    return {
      title: `${parentMeta.title?.absolute} | ${category.name}`,
      description: category.seName + " products" + category.productsCount,
      openGraph: {
        type: "website",
        title: `${parentMeta.title?.absolute} | ${category.name}`,
        description: category.seName + " products" + category.productsCount
      }
    };
  } catch {
    return { title: "Error" };
  }
}

export default async function Page({ params }: Props) {
  try {
    const category = await cachedCategoryInfo(params.id);
    return <ViewCategoryProfile category={category} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500)
      throw new Error("404: Category Not found");

    throw new Error("500: Server Error");
  }
}
