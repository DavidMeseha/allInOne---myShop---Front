import { AxiosError } from "axios";
import axiosInstanceNew from "./lib/axiosInstanceNew";
import { FieldError, User } from "./types";

export async function actionLogin(prevState: any, form: FormData): Promise<{ message: FieldError } | User> {
  const email = form.get("email");
  const password = form.get("password");

  try {
    const res = await axiosInstanceNew
      .post<{ user: User; token: string }>("/api/auth/login", { email, password })
      .then((data) => data.data);

    return res.user;
  } catch (error: any) {
    const err = error as AxiosError;
    // console.log(err);
    return { message: err.message };
  }
}
