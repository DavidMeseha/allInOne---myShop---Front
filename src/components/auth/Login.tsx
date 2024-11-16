import FormTextInput from "../FormTextInput";
import { useState } from "react";
import { useUser } from "@/context/user";
import { FieldError } from "../../types";
import { useTranslation } from "@/context/Translation";
import Button from "../Button";

type LoginErrors = {
  password: FieldError;
  email: FieldError;
};

export default function Login() {
  const { t } = useTranslation();
  const { login } = useUser();
  const [form, setForm] = useState({ password: "", email: "" });
  const [error, setError] = useState<LoginErrors>({
    password: false,
    email: false
  });

  const validate = () => {
    let isError = false;
    if (!form.email) {
      setError({ ...error, email: t("auth.enterYourEmail") });
      isError = true;
    } else if (!form.password) {
      setError({ ...error, password: t("auth.enterYourPassword") });
      isError = true;
    }
    return isError;
  };

  const loginClickHandle = async () => {
    let isError = validate();
    if (isError) return;
    login.mutate(form.email, form.password);
  };

  const fieldChangeHandle = (value: string, name: string) => {
    login.clearError();
    setError({ ...error, [name]: false });
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      <FormTextInput
        error={error.email}
        name="email"
        placeholder={t("auth.email")}
        type="email"
        value={form.email}
        onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
      />

      <FormTextInput
        error={error.password}
        name="password"
        placeholder={t("auth.password")}
        type="password"
        value={form.password}
        onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
      />

      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">
        {login.errorMessage ? login.errorMessage : null}
      </div>

      <div className="mt-6 pb-2">
        <Button
          className={`w-full bg-primary py-3 text-base font-semibold text-white`}
          isLoading={login.isPending}
          type="submit"
          onClick={loginClickHandle}
        >
          {t("auth.login")}
        </Button>
      </div>
    </>
  );
}
