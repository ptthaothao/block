/** What every Server Action returns: data, or a message people can act on. */
export type ActionResult<T = null> = { ok: true; data: T } | { ok: false; error: string };
