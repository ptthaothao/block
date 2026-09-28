import { z } from "zod";

import { OTP_LENGTH } from "./constants";

export const loginEmailSchema = z.email();

export const loginOtpTokenSchema = z.string().regex(/^\d+$/).length(OTP_LENGTH);
