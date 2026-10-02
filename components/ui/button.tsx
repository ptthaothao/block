import Link from "next/link";
import type { ComponentProps } from "react";

import { buttonClassName, type ButtonStyleProps } from "./button-variants";
import { Spinner } from "./spinner";

type ButtonProps = ComponentProps<"button"> & ButtonStyleProps & { loading?: boolean };

/** `loading` disables the button and shows a spinner before its label. */
export function Button({ variant, size, fullWidth, loading, disabled, className, type = "button", children, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClassName({ variant, size, fullWidth }, className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, size, fullWidth }, className)} {...props} />;
}
