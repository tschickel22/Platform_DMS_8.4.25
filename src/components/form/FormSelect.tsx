"use client";
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: React.ReactNode; disabled?: boolean };

type FormSelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
};

export default function FormSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  id,
  name,
  required,
  disabled,
  triggerClassName,
  contentClassName,
}: FormSelectProps) {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      name={name}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn("z-50", contentClassName)} position="popper">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}