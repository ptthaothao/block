import { NextResponse, type NextRequest } from "next/server";

import { QUERY_PARAMS } from "@/config/routes";
import { markAuthChanged } from "@/features/auth/services/mark-auth-changed";
import { callbackErrorCode } from "@/features/auth/utils/callback-error-code";
import { buildLoginPath } from "@/features/auth/utils/login-url";
import { postLoginDestination } from "@/features/auth/utils/post-login-destination";
import { safeNextPath } from "@/features/auth/utils/safe-next-path";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get(QUERY_PARAMS.code);
  const next = safeNextPath(searchParams.get(QUERY_PARAMS.next));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await markAuthChanged();
      return NextResponse.redirect(new URL(await postLoginDestination(next), origin));
    }
    return NextResponse.redirect(new URL(buildLoginPath({ error: callbackErrorCode(error.code) }), origin));
  }

  return NextResponse.redirect(new URL(buildLoginPath({ error: callbackErrorCode(undefined) }), origin));
}
