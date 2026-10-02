import { SubmitButton } from "@/components/ui/submit-button";
import { Input, Label } from "@/components/ui/input";

import { setPassword } from "../actions";
import { LOGIN_COPY, LOGIN_FORM_FIELDS } from "../constants";

export function SetPasswordForm({ next }: { next: string }) {
  return (
    <form action={setPassword} className="mt-8 space-y-3">
      <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
      <Label htmlFor={LOGIN_FORM_FIELDS.password}>{LOGIN_COPY.newPasswordLabel}</Label>
      <Input
        id={LOGIN_FORM_FIELDS.password}
        name={LOGIN_FORM_FIELDS.password}
        type="password"
        required
        autoComplete="new-password"
        autoFocus
        placeholder={LOGIN_COPY.newPasswordPlaceholder}
      />
      <SubmitButton size="lg" fullWidth>
        {LOGIN_COPY.setPasswordSubmit}
      </SubmitButton>
    </form>
  );
}
