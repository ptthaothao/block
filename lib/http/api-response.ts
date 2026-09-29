import "server-only";

import { NextResponse } from "next/server";

import { COMMON_ERROR_MESSAGES } from "@/lib/actions/constants";

import { HTTP_STATUS, NO_STORE_HEADERS } from "./constants";

export function jsonNoStore<T>(body: T) {
  return NextResponse.json(body, { headers: NO_STORE_HEADERS });
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE_HEADERS });
}

export function unauthorized(message: string = COMMON_ERROR_MESSAGES.unauthorized) {
  return errorResponse(message, HTTP_STATUS.unauthorized);
}

export function forbidden(message: string = COMMON_ERROR_MESSAGES.forbidden) {
  return errorResponse(message, HTTP_STATUS.forbidden);
}

export function notFound(message: string = COMMON_ERROR_MESSAGES.notFound) {
  return errorResponse(message, HTTP_STATUS.notFound);
}

export function badRequest(message: string = COMMON_ERROR_MESSAGES.invalid) {
  return errorResponse(message, HTTP_STATUS.badRequest);
}
