import { IVendor } from "@/types";
import ViewVendorProfile from "../../components/ViewVendorProfile";
import axios from "@/lib/axios";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { AxiosError } from "axios";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ seName: string }> };

const getVendorInfo = cache(async (seName: string) => {
  return await axios.get<IVendor>(`/api/catalog/vendor/${seName}`).then((res) => res.data);
});

export const revalidate = 600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const vendors = await axios.get<{ seName: string }[]>(`/api/catalog/allVendors`).then((res) => res.data);
  return vendors.map((vendor) => ({
    seName: vendor.seName
  }));
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  try {
    const vendor = await getVendorInfo(params.seName);
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

export default async function Page(props: Props) {
  const params = await props.params;
  try {
    const vendor = await getVendorInfo(params.seName);
    return <ViewVendorProfile vendor={vendor} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500) notFound();
  }
}
