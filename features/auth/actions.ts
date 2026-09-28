"use server";

import { redirect } from "next/navigation";

import { siteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

import { LOGIN_ERROR_CODES, LOGIN_FORM_FIELDS, OAUTH_PROVIDER } from "./constants";
import { loginEmailSchema, loginOtpTokenSchema } from "./schemas";
import { buildCallbackUrl, buildLoginPath } from "./utils/login-url";
import { postLoginDestination } from "./utils/post-login-destination";
import { sendErrorCode } from "./utils/send-error-code";
import { safeNextPath } from "./utils/safe-next-path";

export async function signInWithGitHub(formData: FormData) {
  const next = safeNextPath(formData.get(LOGIN_FORM_FIELDS.next));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: OAUTH_PROVIDER,
    options: { redirectTo: buildCallbackUrl(siteUrl, next) },
  });
  if (error || !data.url) redirect(buildLoginPath({ error: LOGIN_ERROR_CODES.oauth, next }));
  redirect(data.url);
}

export async function signInWithEmail(formData: FormData) {
  const next = safeNextPath(formData.get(LOGIN_FORM_FIELDS.next));
  const email = loginEmailSchema.safeParse(formData.get(LOGIN_FORM_FIELDS.email));
  if (!email.success) redirect(buildLoginPath({ error: LOGIN_ERROR_CODES.email, next }));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email: email.data });
  if (error) redirect(buildLoginPath({ error: sendErrorCode(error.code), next }));
  redirect(buildLoginPath({ sent: true, email: email.data, next }));
}

export async function verifyEmailOtp(formData: FormData) {
  const next = safeNextPath(formData.get(LOGIN_FORM_FIELDS.next));
  const email = loginEmailSchema.safeParse(formData.get(LOGIN_FORM_FIELDS.email));
  const token = loginOtpTokenSchema.safeParse(formData.get(LOGIN_FORM_FIELDS.token));
  if (!email.success || !token.success) {
    redirect(buildLoginPath({ error: LOGIN_ERROR_CODES.otp, sent: true, email: email.data, next }));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email: email.data, token: token.data, type: "email" });
  if (error) redirect(buildLoginPath({ error: LOGIN_ERROR_CODES.otp, sent: true, email: email.data, next }));
  redirect(await postLoginDestination(next));
}
