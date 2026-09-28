import type { Metadata } from "next";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { QUERY_PARAMS } from "@/config/routes";
import { SITE } from "@/config/site";
import { LoginForm } from "@/features/auth/components/login-form";
import { readLoginStatus } from "@/features/auth/utils/login-status";
import { safeNextPath } from "@/features/auth/utils/safe-next-path";

export const metadata: Metadata = { title: "Đăng nhập", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNextPath(params[QUERY_PARAMS.next]);
  const { errorMessage, sent, email } = readLoginStatus(params);

  return (
    <Container width="narrow" className="py-20">
      <Card className="rounded-xl p-8 shadow-popover">
        <h1 className="font-display text-2xl font-extrabold">Đăng nhập {SITE.name}</h1>
        <p className="mt-2 text-sm text-muted">Để bình luận, thả reaction và theo dõi chủ đề bạn quan tâm.</p>

        {errorMessage && (
          <Alert tone="error" className="mt-6">
            {errorMessage}
          </Alert>
        )}
        {sent && (
          <Alert tone="success" className="mt-6">
            Đã gửi mã đăng nhập tới {email}. Kiểm tra hộp thư và nhập mã bên dưới.
          </Alert>
        )}

        <LoginForm next={next} sentToEmail={sent ? email : undefined} />
      </Card>
    </Container>
  );
}
