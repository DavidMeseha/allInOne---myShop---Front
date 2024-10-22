import { cookies } from "next/headers";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { ITag } from "@/types";
import ViewtagProfile from "../../components/ViewTagProfile";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  const tagData = await axiosInstanceNew
    .get<ITag>(`/api/Catalog/tag/${params.id}`, {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`
      }
    })
    .then((res) => res.data);

  return <ViewtagProfile tag={tagData} />;
}
