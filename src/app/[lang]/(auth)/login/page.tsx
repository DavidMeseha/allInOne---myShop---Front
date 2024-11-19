import FormTextInput from "@/components/FormTextInput";
import { Dictionaries } from "@/dictionary";
import { getDictionary } from "../../../../dictionary";
import { SubmitButton } from "@/components/SubmitButton";
import axios from "@/lib/axios";
import { User } from "@/types";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";

interface Props {
  params: { lang: Dictionaries };
  searchParams: { message: string };
}

export default async function Page({ params, searchParams }: Props) {
  const dictionary = await getDictionary(params.lang);

  const login = async (form: FormData) => {
    "use server";
    const email = form.get("email");
    const password = form.get("password");

    try {
      const res = await axios
        .post<{
          user: User;
          token: string;
        }>(
          "/api/auth/login",
          { email, password },
          { headers: { Authorization: `Bearer ${cookies().get("session")?.value}` } }
        )
        .then((data) => data.data);

      cookies().set("session", res.token, { httpOnly: true, sameSite: "strict", secure: true });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return redirect(
        `/${params.lang}/login?message=${encodeURIComponent(error.response?.data.message ?? error.message)}`
      );
    }

    return redirect(`/${params.lang}`, RedirectType.push);
  };

  return (
    <form className="pt-6">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">{dictionary["auth.login"]}</h1>
        <Link className="text-primary hover:underline" href={`/${params.lang}/register`}>
          {dictionary["auth.dontHaveAnAccount"]}
        </Link>
      </div>
      <FormTextInput name="email" placeholder={dictionary["auth.login"]} type="email" />
      <FormTextInput name="password" placeholder={dictionary["auth.login"]} type="password" />
      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{searchParams.message}</div>
      <div className="mt-2 pb-2">
        <SubmitButton
          className={`w-full bg-primary py-3 text-base font-semibold text-white`}
          formAction={login}
          type="submit"
        >
          {dictionary["auth.login"]}
        </SubmitButton>
      </div>
    </form>
  );
}
