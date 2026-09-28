import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Input, Label } from "@/components/ui/input";

import { signInWithEmail, signInWithGitHub, verifyEmailOtp } from "../actions";
import { LOGIN_FORM_FIELDS, OTP_LENGTH } from "../constants";

export function LoginForm({ next, sentToEmail }: { next: string; sentToEmail?: string }) {
  if (sentToEmail) {
    return (
      <form action={verifyEmailOtp} className="mt-8 space-y-3">
        <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
        <input type="hidden" name={LOGIN_FORM_FIELDS.email} value={sentToEmail} />
        <Label htmlFor={LOGIN_FORM_FIELDS.token}>Mã đăng nhập</Label>
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

  return (
    <>
      <form action={signInWithGitHub} className="mt-8">
        <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
        <Button type="submit" variant="inverted" size="lg" fullWidth>
          Tiếp tục với GitHub
        </Button>
      </form>

      <Divider label="hoặc" />

      <form action={signInWithEmail} className="space-y-3">
        <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
        <Label htmlFor={LOGIN_FORM_FIELDS.email}>Email</Label>
        <Input
          id={LOGIN_FORM_FIELDS.email}
          name={LOGIN_FORM_FIELDS.email}
          type="email"
          required
          autoComplete="email"
          placeholder="ban@example.com"
        />
        <Button type="submit" size="lg" fullWidth>
          Gửi mã đăng nhập
        </Button>
      </form>
    </>
  );
}
