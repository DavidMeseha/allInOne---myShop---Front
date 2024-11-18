import axios from "@/lib/axios";
import { ITag } from "@/types";
import ViewtagProfile from "../../components/ViewTagProfile";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { AxiosError } from "axios";

type Props = { params: { id: string } };

const getTagInfo = async (id: string) => {
  return await axios.get<ITag>(`/api/Catalog/tag/${id}`).then((res) => res.data);
};

const cachedTagInfo = cache(getTagInfo);

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const tag = await cachedTagInfo(params.id);
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
    return { title: "Error" };
  }
}

export default async function Page({ params }: Props) {
  try {
    const tag = await cachedTagInfo(params.id);
    return <ViewtagProfile tag={tag} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500)
      throw new Error("404: Category Not found");

    throw new Error("500: Server Error");
  }
}
