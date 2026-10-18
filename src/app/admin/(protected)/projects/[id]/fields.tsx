"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/admin/checkbox";
import { Input } from "@/components/admin/input";
import { Label } from "@/components/admin/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/admin/native-select";

// Single-language fields of the project form, registered by path.

const idOf = (path: string) => path.replaceAll(".", "-");

export function TextField({
  path,
  label,
  hint,
  ...props
}: { path: string; label: string; hint?: string } & React.ComponentProps<
  typeof Input
>) {
  const { register, getFieldState, formState } = useFormContext();
  const id = idOf(path);
  const { invalid } = getFieldState(path, formState);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...props}
        {...register(path)}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  path,
  label,
  options,
}: {
  path: string;
  label: string;
  options: readonly { value: string; label: string; disabled?: boolean }[];
}) {
  const { register, getFieldState, formState } = useFormContext();
  const id = idOf(path);
  const { invalid } = getFieldState(path, formState);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <NativeSelect
        id={id}
        aria-invalid={invalid || undefined}
        {...register(path)}
      >
        {options.map((option) => (
          <NativeSelectOption
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}

export function CheckField({
  path,
  label,
  onChecked,
}: {
  path: string;
  label: string;
  onChecked?: (checked: boolean) => void;
}) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={path}
      render={({ field }) => (
        <label className="flex items-center gap-3 text-sm">
          <Checkbox
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked === true);
              onChecked?.(checked === true);
            }}
          />
          {label}
        </label>
      )}
    />
  );
}
