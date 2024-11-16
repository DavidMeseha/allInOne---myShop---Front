import ViewCategoryProfile from "../../components/ViewCategoryProfile";
import { ICategory } from "@/types";
import { cookies } from "next/headers";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  try {
    const res = await axios.get<ICategory>(`/api/Catalog/Category/${params.id}`, {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`
      }
    });

    const category = res.data;

    return <ViewCategoryProfile category={category} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500)
      throw new Error("404: Category Not found");

    throw new Error("500: Server Error");
  }
}
