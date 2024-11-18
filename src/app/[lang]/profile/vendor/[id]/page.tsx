import { IVendor } from "@/types";
import ViewVendorProfile from "../../components/ViewVendorProfile";
import axios from "@/lib/axios";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { AxiosError } from "axios";

type Props = { params: { id: string } };

const getVendorInfo = async (id: string) => {
  return await axios.get<IVendor>(`/api/catalog/vendor/${id}`).then((res) => res.data);
};

const cachedVendorInfo = cache(getVendorInfo);

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const vendor = await cachedVendorInfo(params.id);
    const parentMeta = await parent;

    return {
      title: `${parentMeta.title?.absolute} | ${vendor.name}`,
      description: vendor.seName + " " + vendor.productCount,
      openGraph: {
        type: "website",
        title: `${parentMeta.title?.absolute} | ${vendor.name}`,
        description: vendor.seName + " " + vendor.productCount
      }
    };
  } catch {
    return { title: "Error" };
  }
}

export default async function Page({ params }: Props) {
  try {
    const vendor = await cachedVendorInfo(params.id);
    return <ViewVendorProfile vendor={vendor} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500)
      throw new Error("404: Category Not found");

    throw new Error("500: Server Error");
  }
}
