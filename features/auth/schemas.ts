import { z } from "zod";

import { OTP_LENGTH, PASSWORD_MIN_LENGTH } from "./constants";

export const loginEmailSchema = z.email();

export const loginOtpTokenSchema = z.string().regex(/^\d+$/).length(OTP_LENGTH);

/** Same floor Supabase Auth enforces server-side; kept here so the form can reject early. */
export const passwordSchema = z.string().min(PASSWORD_MIN_LENGTH);
