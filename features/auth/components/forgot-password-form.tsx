import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

import { requestPasswordReset } from "../actions";
import { LOGIN_COPY, LOGIN_FORM_FIELDS } from "../constants";

export function ForgotPasswordForm({ next }: { next: string }) {
  return (
    <form action={requestPasswordReset} className="mt-8 space-y-3">
      <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
      <Label htmlFor={LOGIN_FORM_FIELDS.email}>{LOGIN_COPY.emailLabel}</Label>
      <Input
        id={LOGIN_FORM_FIELDS.email}
        name={LOGIN_FORM_FIELDS.email}
        type="email"
        required
        autoComplete="email"
        autoFocus
        placeholder="ban@example.com"
      />
      <Button type="submit" size="lg" fullWidth>
        {LOGIN_COPY.forgotPasswordSubmit}
      </Button>
    </form>
  );
}
