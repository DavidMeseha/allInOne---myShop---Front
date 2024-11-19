"use client";
import React, { ChangeEvent } from "react";

type Props = {
  name?: string;
  className?: string;
  title: string;
  value?: string;
  options: { name: string | React.ReactNode; value: string }[];
  onChange?: (value: string) => void;
};

export default function RadioGroup({ value, options, title, onChange, className, name }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.target.value);
  };

  return (
    <div className={className ?? ""} data-testid="radio-group">
      <div className="mb-2 text-lg">{title}</div>
      <div className="flex flex-wrap gap-4">
        {options.map((option, index) => (
          <label className="mb-2" htmlFor={option.value} key={index}>
            {!onChange && !value ? (
              <input
                className="me-2 border-red-300 bg-red-100 text-red-500 focus:ring-red-200"
                id={option.value}
                name={name ?? title}
                type="radio"
                value={option.value}
                onChange={handleChange}
              />
            ) : (
              <input
                checked={value === option.value}
                className="me-2 border-red-300 bg-red-100 text-red-500 focus:ring-red-200"
                id={option.value}
                name={name ?? title}
                type="radio"
                value={option.value}
                onChange={handleChange}
              />
            )}
            {option.name}
          </label>
        ))}
      </div>
    </div>
  );
}
