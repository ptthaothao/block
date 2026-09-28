import { INTEREST_COPY } from "../constants";

/** "· 12 người quan tâm" in a hero's stat line; nothing until someone follows. */
export function FollowerStat({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <>
      <span aria-hidden>·</span>
      <span>{INTEREST_COPY.followers(count)}</span>
    </>
  );
}
