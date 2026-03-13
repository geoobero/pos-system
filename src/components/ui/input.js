import { forwardRef } from "react";

const Input = forwardRef(function Input(
    {
        label,
        type = "text",
        value,
        onChange,
        placeholder = "",
        error = "",
        disabled = false,
        className = "",
        ...props
    },
    ref
) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                ref={ref}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`px-3 py-2 border rounded-md focus:outline-none focus:ring
                ${error
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-300"
                    }
                ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                ${className}`}
                {...props}
            />

            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
});

export default Input;
