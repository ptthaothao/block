import { NextResponse } from "next/server";

import { NO_STORE_HEADERS } from "@/lib/http/constants";
import { toPublicSessionUser } from "@/features/auth/mappers";
import { getSessionUser } from "@/features/auth/queries";
import type { MeResponse } from "@/features/auth/types";

/** Who is signed in, for the header on otherwise static pages. */
export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json<MeResponse>({ user: user ? toPublicSessionUser(user) : null }, { headers: NO_STORE_HEADERS });
}
