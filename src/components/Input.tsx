import { cn } from "@/lib/utils";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  className?: string;
};

export default function Input({ label, className, ...props }: Props) {
  return (
    <div className="mb-4 w-full">
      <label className="mb-1 text-[15px]">{label}</label>
      <input
        {...props}
        className={cn("w-full rounded-md border-secondary focus:border-primary focus:ring-primary", className)}
      />
    </div>
  );
}
