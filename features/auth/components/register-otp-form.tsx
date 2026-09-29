import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

import { verifyEmailOtp } from "../actions";
import { LOGIN_FORM_FIELDS, OTP_LENGTH } from "../constants";

/** Step 2 of registration: the code just emailed to sentToEmail. */
export function RegisterOtpForm({ next, sentToEmail }: { next: string; sentToEmail: string }) {
  return (
    <form action={verifyEmailOtp} className="mt-8 space-y-3">
      <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
      <input type="hidden" name={LOGIN_FORM_FIELDS.email} value={sentToEmail} />
      <Label htmlFor={LOGIN_FORM_FIELDS.token}>Mã đăng ký</Label>
      <Input
        id={LOGIN_FORM_FIELDS.token}
        name={LOGIN_FORM_FIELDS.token}
        type="text"
        inputMode="numeric"
        pattern="\d*"
        maxLength={OTP_LENGTH}
        required
        autoComplete="one-time-code"
        autoFocus
        placeholder="123456"
      />
      <Button type="submit" size="lg" fullWidth>
        Xác nhận
      </Button>
    </form>
  );
}
