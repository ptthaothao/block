import type { Metadata } from "next";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { QUERY_PARAMS } from "@/config/routes";
import { LOGIN_COPY } from "@/features/auth/constants";
import { SetPasswordForm } from "@/features/auth/components/set-password-form";
import { readLoginStatus } from "@/features/auth/utils/login-status";
import { safeNextPath } from "@/features/auth/utils/safe-next-path";

export const metadata: Metadata = { title: LOGIN_COPY.setPasswordTitle, robots: { index: false } };

export default async function SetPasswordPage({ searchParams }: PageProps<"/set-password">) {
  const params = await searchParams;
  const next = safeNextPath(params[QUERY_PARAMS.next]);
  const { errorMessage } = readLoginStatus(params);

  return (
    <Container width="narrow" className="py-20">
      <Card className="rounded-xl p-8 shadow-popover">
        <h1 className="font-display text-2xl font-extrabold">{LOGIN_COPY.setPasswordTitle}</h1>
        <p className="mt-2 text-sm text-muted">{LOGIN_COPY.setPasswordHint}</p>

        {errorMessage && (
          <Alert tone="error" className="mt-6">
            {errorMessage}
          </Alert>
        )}

        <SetPasswordForm next={next} />
      </Card>
    </Container>
  );
}
