import React from "react";
import { FieldError } from "../types";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
}

export default function FormTextInput({ label, error, ...props }: TextInputProps) {
  return (
    <div className="pb-1">
      <label className="mb-1 block capitalize">
        {label}
        {props.required ? <span className="text-primary">*</span> : null}
      </label>
      <input
        autoComplete="off"
        className="block w-full rounded-sm border border-strongGray px-4 py-2 focus:border-primary focus:ring-primary"
        {...props}
      />

      {<div className="min-h-[21px] text-[14px] font-semibold text-red-500">{error ? error : null}</div>}
    </div>
  );
}
