"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import type { z } from "zod";
import type { SaveResult } from "@/lib/validation/shared";
import type { FormStatus } from "./form-footer";

/**
 * Form saved as a whole by one Server Action that returns the saved values
 * (with the ids of new rows), then resets to them.
 */
export function useSaveForm<T extends FieldValues>(
  schema: z.ZodType<T, T>,
  defaultValues: T,
  save: (values: T) => Promise<SaveResult<T>>,
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [pending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await save(values);
        if (result.ok) form.reset(result.data);
        setStatus(result.ok ? "saved" : result.error);
      }),
    () => setStatus("invalid"),
  );

  return { form, status, pending, onSubmit };
}
