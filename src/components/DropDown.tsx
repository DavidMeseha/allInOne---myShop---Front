import { SelectHTMLAttributes } from "react";

type DropdownProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { name: string; value: string }[];
};

export default function Dropdown({ label, options, className, ...props }: DropdownProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="mb-1">{label}</label>
      <select
        className="block w-full rounded-md border border-strongGray px-3 py-2 focus:border-primary focus:ring-primary"
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
