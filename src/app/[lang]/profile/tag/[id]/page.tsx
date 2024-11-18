import axios from "@/lib/axios";
import { ITag } from "@/types";
import ViewtagProfile from "../../components/ViewTagProfile";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { AxiosError } from "axios";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

const getTagInfo = cache(async (id: string) => {
  return await axios.get<ITag>(`/api/Catalog/tag/${id}`).then((res) => res.data);
});

export const revalidate = 600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const tags = await axios.get<{ _id: string }[]>(`/api/catalog/allTags`).then((res) => res.data);
  return tags.map((tag) => ({
    id: tag._id
  }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const tag = await getTagInfo(params.id);
    const parentMeta = await parent;

    return {
      title: `${parentMeta.title?.absolute} | ${tag.name}`,
      description: tag.seName + " " + tag.productCount,
      openGraph: {
        type: "website",
        title: `${parentMeta.title?.absolute} | ${tag.name}`,
        description: tag.seName + " " + tag.productCount
      }
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function Page({ params }: Props) {
  try {
    const tag = await getTagInfo(params.id);
    return <ViewtagProfile tag={tag} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500) notFound();
  }
}
