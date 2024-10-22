import React, { ChangeEvent } from "react";

type Props = {
  className?: string;
  title: string;
  value: string;
  options: { name: string; value: string }[];
  onChange: (value: string) => void;
};

export default function RadioGroup({ value, options, title, onChange, className }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className ?? ""}>
      <div className="mb-2 text-lg">{title}</div>
      <div className="flex flex-wrap">
        {options.map((option, index) => (
          <label className="mb-2 w-1/2" htmlFor={option.name} key={index}>
            <input
              checked={value === option.value}
              className="me-2 border-red-300 bg-red-100 text-red-500 focus:ring-red-200"
              id={option.name}
              type="radio"
              value={option.value}
              onChange={handleChange}
            />
            {option.name}
          </label>
        ))}
      </div>
    </div>
  );
}
