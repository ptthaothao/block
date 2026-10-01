import type { ComponentProps, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

import { EditorIcon } from "../editor-icon";

/** One block of the settings sidebar, separated from the next by a rule. */
export function SettingsSection({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("flex flex-col gap-3 border-t border-editor-line px-5 pt-[21px] pb-5", className)} {...props} />;
}

type SettingsLabelProps = {
  htmlFor?: string;
  id?: string;
  /** Small text on the right, e.g. a counter. */
  meta?: ReactNode;
  metaClassName?: string;
  children: ReactNode;
};

export function SettingsLabel({ htmlFor, id, meta, metaClassName, children }: SettingsLabelProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={htmlFor} id={id} className="text-xs leading-4 font-semibold text-text">
        {children}
      </label>
      {meta !== undefined && <span className={cn("text-[11px] leading-[16.5px] text-faint", metaClassName)}>{meta}</span>}
    </div>
  );
}

type SettingsSelectProps = ComponentProps<"select"> & { wrapperClassName?: string; small?: boolean };

export function SettingsSelect({ wrapperClassName, small, className, ...props }: SettingsSelectProps) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <Select
        className={cn(
          "appearance-none rounded-lg border-editor-line bg-editor-base py-[9px] pr-8 pl-[13px] text-xs leading-4 text-text disabled:opacity-60",
          className,
        )}
        {...props}
      />
      <EditorIcon
        name={small ? "chevronDownSmall" : "chevronDown"}
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2", small ? "right-2" : "right-2.5")}
      />
    </div>
  );
}

export function SettingsInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <Input
      className={cn("rounded-lg border-editor-line bg-editor-base px-[11px] py-[9px] text-xs leading-4 text-text disabled:opacity-60", className)}
      {...props}
    />
  );
}

export function SettingsTextarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <Textarea
      className={cn(
        "resize-y rounded-lg border-editor-line bg-editor-base p-[11px] text-xs leading-[19.5px] text-text disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
