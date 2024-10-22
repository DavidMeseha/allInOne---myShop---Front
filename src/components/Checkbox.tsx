import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export default function Checkbox({ label, id, className, ...props }: Props) {
  return (
    <label className={`block px-4 py-2 ${className}`} htmlFor={id}>
      <input
        className={`mb-1 me-2 border-primary bg-red-100 text-primary focus:ring-red-200`}
        id={id}
        type="checkbox"
        {...props}
      />
      {label}
    </label>
  );
}
