import React from "react";
import { FieldError } from "../types";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | undefined;
  inputType: string;
  placeholder: string;
  onUpdate: (newValue: string, name: string) => void;
  error?: FieldError;
  name?: string;
}

export default function FormTextInput({
  value,
  inputType,
  placeholder,
  error,
  onUpdate,
  name,
  ...props
}: TextInputProps) {
  return (
    <div className="pb-1">
      <label className="mb-1 block capitalize">
        {placeholder}
        {props.required ? <span>*</span> : null}
      </label>
      <input
        autoComplete="off"
        className="block w-full rounded-sm border border-strongGray px-4 py-2 focus:border-primary focus:ring-primary"
        name={name}
        type={inputType}
        value={value}
        onChange={(event) => onUpdate(event.target.value, event.target.name)}
        {...props}
      />

      {<div className="min-h-[21px] text-[14px] font-semibold text-red-500">{error ? error : null}</div>}
    </div>
  );
}
