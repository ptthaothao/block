"use server";

import { redirect } from "next/navigation";

import { siteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

import { LOGIN_ERROR_CODES, LOGIN_FORM_FIELDS, OAUTH_PROVIDER } from "./constants";
import { getAccountCreatedAt, getSessionUser } from "./queries";
import { markAuthChanged } from "./services/mark-auth-changed";
import { loginEmailSchema, loginOtpTokenSchema, passwordSchema } from "./schemas";
import { isNewAccount } from "./utils/is-new-account";
import { buildCallbackUrl, buildForgotPasswordPath, buildLoginPath, buildSetPasswordPath } from "./utils/login-url";
import { postLoginDestination } from "./utils/post-login-destination";
import { safeNextPath } from "./utils/safe-next-path";
import { sendErrorCode } from "./utils/send-error-code";

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

/** Sign in with an email already registered with a password. */
export async function signInWithPassword(formData: FormData) {
  const next = safeNextPath(formData.get(LOGIN_FORM_FIELDS.next));
  const email = loginEmailSchema.safeParse(formData.get(LOGIN_FORM_FIELDS.email));
  const password = formData.get(LOGIN_FORM_FIELDS.password);
  if (!email.success || typeof password !== "string" || !password) {
    redirect(buildLoginPath({ error: LOGIN_ERROR_CODES.credentials, next }));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email.data, password });
  if (error) redirect(buildLoginPath({ error: LOGIN_ERROR_CODES.credentials, next }));
  await markAuthChanged();
  redirect(await postLoginDestination(next));
}

/** Registration: emails a code for a new (or not-yet-verified) address. Existing readers sign in with a password instead. */
export async function signUpWithEmail(formData: FormData) {
  const next = safeNextPath(formData.get(LOGIN_FORM_FIELDS.next));
  const email = loginEmailSchema.safeParse(formData.get(LOGIN_FORM_FIELDS.email));
  if (!email.success) redirect(buildLoginPath({ error: LOGIN_ERROR_CODES.email, next }));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email: email.data });
  if (error) redirect(buildLoginPath({ error: sendErrorCode(error.code), next }));
  redirect(buildLoginPath({ sent: true, email: email.data, next }));
}

/** Verifies the registration code. New accounts must then set a password before they can sign in again. */
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
  await markAuthChanged();

  const user = await getSessionUser();
  if (user && isNewAccount(await getAccountCreatedAt(user.id))) {
    redirect(buildSetPasswordPath(next));
  }
  redirect(await postLoginDestination(next));
}

/** Sets the signed-in reader's password: after registering, or after following a reset-password link. */
export async function setPassword(formData: FormData) {
  const next = safeNextPath(formData.get(LOGIN_FORM_FIELDS.next));
  const password = passwordSchema.safeParse(formData.get(LOGIN_FORM_FIELDS.password));
  if (!password.success) redirect(buildSetPasswordPath(next, LOGIN_ERROR_CODES.password));

  const supabase = await createClient();
  const user = await getSessionUser();
  if (!user) redirect(buildLoginPath({ error: LOGIN_ERROR_CODES.session, next }));

  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) {
    const code = error.code === "weak_password" ? LOGIN_ERROR_CODES.weakPassword : LOGIN_ERROR_CODES.password;
    redirect(buildSetPasswordPath(next, code));
  }
  redirect(await postLoginDestination(next));
}

/** Emails a reset-password link for an existing reader who forgot their password. */
export async function requestPasswordReset(formData: FormData) {
  const next = safeNextPath(formData.get(LOGIN_FORM_FIELDS.next));
  const email = loginEmailSchema.safeParse(formData.get(LOGIN_FORM_FIELDS.email));
  if (!email.success) redirect(buildForgotPasswordPath({ next, error: LOGIN_ERROR_CODES.email }));

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: buildCallbackUrl(siteUrl, buildSetPasswordPath(next)),
  });
  if (error) redirect(buildForgotPasswordPath({ next, error: sendErrorCode(error.code) }));
  redirect(buildForgotPasswordPath({ next, sent: true, email: email.data }));
}
