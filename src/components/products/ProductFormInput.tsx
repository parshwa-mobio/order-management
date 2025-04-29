import React from "react";

interface ProductFormInputProps {
  label: string;
  name: string;
  value: string | number;
  type: "text" | "number" | "select";
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  required?: boolean;
  min?: number;
  step?: string;
  options?: { value: string; label: string }[];
  className?: string;
}

export const ProductFormInput: React.FC<ProductFormInputProps> = ({
  label,
  name,
  value,
  type,
  onChange,
  required = false,
  min,
  step,
  options,
  className = "",
}) => {
  const baseInputClass =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={baseInputClass}
          required={required}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={baseInputClass}
          required={required}
          min={min}
          step={step}
        />
      )}
    </div>
  );
};
