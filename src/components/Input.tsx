import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ label, ...props }: Props) {
  return (
    <div className="mb-4 w-full">
      <div className="flex items-center justify-between">
        <div className="mb-1 text-[15px]">{label}</div>
      </div>
      <input {...props} className="w-full rounded-md border-strongGray focus:border-primary focus:ring-primary" />
    </div>
  );
}
