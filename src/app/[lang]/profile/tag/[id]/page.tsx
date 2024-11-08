import { cookies } from "next/headers";
import axios from "@/lib/axios";
import { ITag } from "@/types";
import ViewtagProfile from "../../components/ViewTagProfile";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  const tagData = await axios
    .get<ITag>(`/api/Catalog/tag/${params.id}`, {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`
      }
    })
    .then((res) => res.data);

  return <ViewtagProfile tag={tagData} />;
}
