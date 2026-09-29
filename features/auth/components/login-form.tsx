"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Input, Label } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { buildForgotPasswordPath } from "@/features/auth/utils/login-url";

import { signInWithGitHub, signInWithPassword, signUpWithEmail } from "../actions";
import { LOGIN_COPY, LOGIN_FORM_FIELDS } from "../constants";
import { RegisterOtpForm } from "./register-otp-form";

type LoginTab = "signIn" | "signUp";

const TABS = [
  { id: "signIn", label: LOGIN_COPY.signInTab },
  { id: "signUp", label: LOGIN_COPY.signUpTab },
] as const satisfies readonly { id: LoginTab; label: string }[];

export function LoginForm({ next, sentToEmail }: { next: string; sentToEmail?: string }) {
  // A code was just emailed for registration: finish that regardless of which tab was open.
  const [tab, setTab] = useState<LoginTab>("signIn");

  if (sentToEmail) return <RegisterOtpForm next={next} sentToEmail={sentToEmail} />;

  return (
    <>
      <Tabs tabs={TABS} value={tab} onChange={setTab} label={LOGIN_COPY.tabsLabel} className="mt-6" />

      <form action={signInWithGitHub} className="mt-6">
        <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
        <Button type="submit" variant="inverted" size="lg" fullWidth>
          Tiếp tục với GitHub
        </Button>
      </form>

      <Divider label="hoặc" />

      {tab === "signIn" ? (
        <form action={signInWithPassword} className="space-y-3">
          <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
          <Label htmlFor={LOGIN_FORM_FIELDS.email}>{LOGIN_COPY.emailLabel}</Label>
          <Input
            id={LOGIN_FORM_FIELDS.email}
            name={LOGIN_FORM_FIELDS.email}
            type="email"
            required
            autoComplete="email"
            placeholder="ban@example.com"
          />
          <div className="flex items-center justify-between">
            <Label htmlFor={LOGIN_FORM_FIELDS.password}>{LOGIN_COPY.passwordLabel}</Label>
            <Link href={buildForgotPasswordPath({ next })} className="text-xs text-muted hover:text-text">
              {LOGIN_COPY.forgotPassword}
            </Link>
          </div>
          <Input
            id={LOGIN_FORM_FIELDS.password}
            name={LOGIN_FORM_FIELDS.password}
            type="password"
            required
            autoComplete="current-password"
            placeholder={LOGIN_COPY.passwordPlaceholder}
          />
          <Button type="submit" size="lg" fullWidth>
            {LOGIN_COPY.signInSubmit}
          </Button>
        </form>
      ) : (
        <form action={signUpWithEmail} className="space-y-3">
          <input type="hidden" name={LOGIN_FORM_FIELDS.next} value={next} />
          <Label htmlFor={LOGIN_FORM_FIELDS.email}>{LOGIN_COPY.emailLabel}</Label>
          <Input
            id={LOGIN_FORM_FIELDS.email}
            name={LOGIN_FORM_FIELDS.email}
            type="email"
            required
            autoComplete="email"
            placeholder="ban@example.com"
          />
          <Button type="submit" size="lg" fullWidth>
            {LOGIN_COPY.signUpSubmit}
          </Button>
        </form>
      )}
    </>
  );
}
