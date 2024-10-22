import ViewCategoryProfile from "../../components/ViewCategoryProfile";
import { ICategory } from "@/types";
import { cookies } from "next/headers";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import NotFound from "@/components/NotFound";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  const data = await axiosInstanceNew
    .get<ICategory>(`/api/Catalog/Category/${params.id}`, {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`
      }
    })
    .then((res) => res.data);

  if (!data) return <NotFound />;
  return <ViewCategoryProfile category={data} />;
}
