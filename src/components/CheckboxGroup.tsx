import React, { ChangeEvent } from "react";

type Props = {
  title: string;
  values: string | string[];
  options: { name: string; value: string }[];
  onChange: (value: string[]) => void;
};

export default function CheckboxGroup({ values, options, title, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let tempValues = [];
    if (typeof values === "object") tempValues = [...values];
    else values && tempValues.push(values);

    if (e.currentTarget.checked) tempValues.push(e.currentTarget.value);
    else tempValues.splice(tempValues.indexOf(e.target.value), 1);

    onChange(tempValues);
  };

  return (
    <>
      <div className="mb-2 text-lg">{title}</div>
      <div className="flex flex-wrap gap-4">
        {options.map((option, index) => (
          <label className="mb-2" htmlFor={option.name} key={index}>
            <input
              checked={values.includes(option.value)}
              className="me-2 border-primary bg-red-100 text-primary focus:ring-red-200"
              id={option.name}
              type="checkbox"
              value={option.value}
              onChange={handleChange}
            />
            {option.name}
          </label>
        ))}
      </div>
    </>
  );
}
