"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "./button";

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, "type">;

/**
 * Submit button for a `<form>`: Enter in any of the form's inputs triggers it,
 * and it shows a spinner while the form's Server Action is running.
 */
export function SubmitButton({ loading, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={pending || loading} {...props} />;
}
