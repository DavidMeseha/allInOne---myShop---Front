import React, { useState } from "react";
import FormTextInput from "../FormTextInput";
import { useTranslation } from "@/context/Translation";
import { FieldError } from "@/types";
import { emailValidation } from "@/lib/formatValidation";

export default function ForgetPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<FieldError>(false);

  const submitHandle = () => {
    if (error) return;
    if (!email) return setError(t("auth.emailRequired"));

    console.log("confirm");
  };

  const fieldChangeHandle = (value: string) => {
    setError(false);
    setEmail(value);
  };

  return (
    <>
      <p className="mb-4 text-center text-sm text-strongGray">{t("auth.EnterEmailtoResetPassword")}</p>

      <FormTextInput
        error={error}
        inputType="email"
        name="email"
        placeholder={t("auth.email")}
        value={email}
        onUpdate={fieldChangeHandle}
        onBlur={(e) => {
          if (e.target.value && !emailValidation(e.target.value)) setError(t("auth.emailNotValid"));
        }}
      />

      <div className="mt-6 pb-2">
        <button
          className={`flex w-full items-center justify-center rounded-sm bg-primary py-3 text-[17px] font-semibold text-white`}
          onClick={submitHandle}
        >
          {t("auth.confirm")}
        </button>
      </div>
    </>
  );
}
