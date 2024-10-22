import React, { ChangeEvent, FormEvent } from "react";
import FormTextInput from "../FormTextInput";
import { useState } from "react";
import { useTranslation } from "@/context/Translation";
import RadioGroup from "../RadioGroup";
import DateDropdownNumbers from "../DateDropdownNumbers";
import { useUser } from "@/context/user";
import Button from "../Button";
import { emailValidation, nameValidation, passwordValidation } from "@/lib/formatValidation";
import { FieldError, RegisterForm } from "@/types";

type RigesterErrors = {
  firstName: FieldError;
  lastName: FieldError;
  email: FieldError;
  password: FieldError;
  confirmPassword: FieldError;
  gender: FieldError;
};

const initalForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  dayOfBirth: 1,
  monthOfBirth: 1,
  yearOfBirth: 2000
};

export default function Register({ onSuccess }: { onSuccess: () => void }) {
  const { register } = useUser();
  const { t } = useTranslation();

  const [form, setForm] = useState<RegisterForm>(initalForm);

  const [error, setError] = useState<RigesterErrors>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    gender: false
  });

  const validate = () => {
    let isError = false;
    let errors = { ...error };

    let key: keyof typeof errors;

    for (key in errors) {
      if (errors[key]) {
        isError = true;
        break;
      }
    }

    if (!form.firstName) {
      errors = { ...errors, firstName: t("auth.nameRequired") };
      isError = true;
    }
    if (!form.lastName) {
      errors = { ...errors, lastName: t("auth.nameRequired") };
      isError = true;
    }
    if (!form.email) {
      errors = { ...errors, email: t("auth.emailRequired") };
      isError = true;
    }
    if (form.email && !emailValidation(form.email)) {
      errors = { ...errors, email: "not an email" };
      isError = true;
    }
    if (!form.password) {
      errors = { ...errors, password: t("auth.passwordRequired") };
      isError = true;
    }
    if (form.password.length < 8) {
      errors = { ...errors, password: t("auth.passwordMinimumLength") };
      isError = true;
    }
    if (form.password != form.confirmPassword) {
      errors = { ...errors, confirmPassword: t("auth.passwordsNotMatch") };
      isError = true;
    }

    setError({ ...errors });
    return isError;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const isError = validate();
    if (isError) return;
    register.clearError();
    register.mutate(form).then(() => {
      setForm(initalForm);
      onSuccess();
    });
  };

  const fieldChangeHandle = (value: string, name: string) => {
    setError({ ...error, [name]: false });
    setForm({ ...form, [name]: value });
  };

  const passwordOnBlurValidation = (e: ChangeEvent<HTMLInputElement>) => {
    let errors = { ...error };
    if (e.target.value && !passwordValidation(e.target.value))
      errors = {
        ...errors,
        password: t("auth.passwordFormatError")
      };

    if (form.confirmPassword && e.target.value !== form.confirmPassword)
      errors = { ...error, confirmPassword: t("auth.passwordsNotMatch") };

    setError({ ...errors });
  };

  return (
    <form onSubmit={submit}>
      <h1 className="mb-4 text-center text-[28px] font-bold">{t("auth.register")}</h1>

      <FormTextInput
        error={error.firstName}
        inputType="text"
        name="firstName"
        placeholder={t("auth.name")}
        required
        value={form.firstName}
        onUpdate={fieldChangeHandle}
        onBlur={(e) => {
          if (e.target.value && !nameValidation(e.target.value)) setError({ ...error, firstName: "Not a valid Name" });
        }}
      />

      <FormTextInput
        error={error.lastName}
        inputType="text"
        name="lastName"
        placeholder={t("auth.name")}
        required
        value={form.lastName}
        onUpdate={fieldChangeHandle}
        onBlur={(e) => {
          if (e.target.value && !nameValidation(e.target.value)) setError({ ...error, lastName: "Not a valid Name" });
        }}
      />

      <FormTextInput
        error={error.email}
        inputType="email"
        name="email"
        placeholder={t("auth.email")}
        required
        value={form.email}
        onUpdate={fieldChangeHandle}
        onBlur={(e) => {
          if (e.target.value && !emailValidation(e.target.value)) setError({ ...error, email: "Not a valid Email" });
        }}
      />

      <FormTextInput
        error={error.password}
        inputType="password"
        name="password"
        placeholder={t("auth.password")}
        required
        value={form.password}
        onBlur={passwordOnBlurValidation}
        onUpdate={fieldChangeHandle}
      />

      <FormTextInput
        error={error.confirmPassword}
        inputType="password"
        name="confirmPassword"
        placeholder={t("auth.confirmPassword")}
        required
        value={form.confirmPassword}
        onUpdate={fieldChangeHandle}
        onBlur={(e) => {
          if (e.target.value !== form.password) setError({ ...error, confirmPassword: t("auth.passwordsNotMatch") });
        }}
      />

      <RadioGroup
        title="Gender"
        value={form.gender}
        options={[
          { name: "Male", value: "male" },
          { name: "Female", value: "female" }
        ]}
        onChange={(value) => setForm({ ...form, gender: value })}
      />
      <div className="min-h-[21px] font-semibold text-red-500">{error.gender ?? ""}</div>

      <div className="text-lg">Date OF Birth</div>
      <DateDropdownNumbers
        changeDay={(value) => setForm({ ...form, dayOfBirth: value })}
        changeMonth={(value) => setForm({ ...form, monthOfBirth: value })}
        changeYear={(value) => setForm({ ...form, yearOfBirth: value })}
        day={form.dayOfBirth}
        month={form.monthOfBirth}
        year={form.yearOfBirth}
      />

      <div className="text-red-600">{register.errorMessage}</div>
      <div className="mt-6 pb-2">
        <Button className="w-full bg-primary font-semibold text-white" isLoading={register.isPending}>
          {t("auth.register")}
        </Button>
      </div>
    </form>
  );
}
