"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useState, useEffect } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, success, className, id, type, maxLength, value, onChange, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);
    const [charCount, setCharCount] = useState(
      value ? String(value).length : 0
    );

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isPassword) {
          setCapsLockActive(e.getModifierState("CapsLock"));
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPassword]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (maxLength) {
        setCharCount(e.target.value.length);
      }
      if (onChange) onChange(e);
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between items-end">
          {label && (
            <label htmlFor={inputId} className="label mb-0">
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-text-muted">
              {charCount} / {maxLength}
            </span>
          )}
        </div>
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            maxLength={maxLength}
            value={value}
            onChange={handleChange}
            className={cn(
              "input",
              icon && "pl-10",
              isPassword && "pr-10",
              error && "input-error",
              success && "border-success focus:border-success focus:ring-success",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {capsLockActive && isPassword && (
          <p className="text-xs text-warning flex items-center gap-1 mt-0.5">
            <AlertTriangle className="w-3 h-3" /> Caps Lock is on
          </p>
        )}
        {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
        {hint && !error && !capsLockActive && (
          <p className="text-xs text-text-muted mt-0.5">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  success?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, success, className, id, maxLength, value, onChange, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [charCount, setCharCount] = useState(
      value ? String(value).length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength) {
        setCharCount(e.target.value.length);
      }
      if (onChange) onChange(e);
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between items-end">
          {label && (
            <label htmlFor={inputId} className="label mb-0">
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-text-muted">
              {charCount} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={cn(
            "input resize-none",
            error && "input-error",
            success && "border-success focus:border-success focus:ring-success",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted mt-0.5">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: boolean;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, success, className, id, children, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="label mb-0">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "input appearance-none cursor-pointer",
            error && "input-error",
            success && "border-success focus:border-success focus:ring-success",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
