import { ROUTES } from "@/config/routes";
import { getJson } from "@/lib/http/get-json";

import type { MeResponse } from "./types";

/** Browser-side reads from our own API (BFF). */
export const authApi = {
  me: () => getJson<MeResponse>(ROUTES.apiMe),
};
