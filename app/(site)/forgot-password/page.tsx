import type { Metadata } from "next";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { QUERY_PARAMS } from "@/config/routes";
import { LOGIN_COPY } from "@/features/auth/constants";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { readLoginStatus } from "@/features/auth/utils/login-status";
import { safeNextPath } from "@/features/auth/utils/safe-next-path";

export const metadata: Metadata = { title: LOGIN_COPY.forgotPasswordTitle, robots: { index: false } };

export default async function ForgotPasswordPage({ searchParams }: PageProps<"/forgot-password">) {
  const params = await searchParams;
  const next = safeNextPath(params[QUERY_PARAMS.next]);
  const { errorMessage, sent, email } = readLoginStatus(params);

  return (
    <Container width="narrow" className="py-20">
      <Card className="rounded-xl p-8 shadow-popover">
        <h1 className="font-display text-2xl font-extrabold">{LOGIN_COPY.forgotPasswordTitle}</h1>
        <p className="mt-2 text-sm text-muted">{LOGIN_COPY.forgotPasswordHint}</p>

        {errorMessage && (
          <Alert tone="error" className="mt-6">
            {errorMessage}
          </Alert>
        )}
        {sent && (
          <Alert tone="success" className="mt-6">
            {LOGIN_COPY.resetSent} ({email})
          </Alert>
        )}

        {!sent && <ForgotPasswordForm next={next} />}
      </Card>
    </Container>
  );
}
