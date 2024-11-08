import { cookies } from "next/headers";
import { IVendor } from "@/types";
import ViewVendorProfile from "../../components/ViewVendorProfile";
import axios from "@/lib/axios";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  const vendorData = await axios
    .get<IVendor>(`/api/catalog/vendor/${params.id}`, {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`
      }
    })
    .then((res) => res.data);

  return <ViewVendorProfile vendor={vendorData} />;
}
